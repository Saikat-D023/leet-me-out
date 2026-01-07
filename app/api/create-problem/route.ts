import { getJudge0LanguageId, pollBatchResults, submitBatch } from "@/lib/judge0";
import { currentUserRole, getCurrentUserData } from "@/modules/auth/actions/index"; // Corrected import path and function name

import { UserRole, Difficulty } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server"; // Added NextRequest
import { db } from "@/lib/db";

// Define interfaces for the request body
interface ReferenceSolutions {
    [language: string]: string;
}

interface TestCase {
    input: string;
    output: string;
}

interface CreateProblemBody {
    title: string;
    description: string;
    difficulty: Difficulty;
    tags: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    examples: any[]; // You might want to define a stricter type for examples if possible
    constraints: string; // Changed from string[] to match frontend
    testCases: TestCase[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    codeSnippets: any; // Define strict type if available
    referenceSolutions: ReferenceSolutions;
}

export async function POST(request: NextRequest) {
    try {
        const userRole = await currentUserRole();
        const user = await getCurrentUserData();

        // Check if userRole is NOT admin (handling potential error object from action)
        if (userRole !== UserRole.ADMIN) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if user is valid and not an error object
        if (!user || (typeof user === 'object' && 'error' in user)) {
            return NextResponse.json({ error: "Unauthorized - User not found" }, { status: 401 });
        }

        // We know user is valid now, but Typescript might need a cast if the return type of action is complex.
        // Assuming getCurrentUserData returns strict User object on success for now, 
        // or we access it safely. The 'error' check handles the failure case.
        // However, standard Prisma User type usage is safer.
        // Let's aliasing user to avoid TS warnings if the action return type is loose.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const currentUser = user as any;


        const body = (await request.json()) as CreateProblemBody;

        const {
            title,
            description,
            difficulty,
            tags,
            examples,
            constraints,
            testCases,
            codeSnippets,
            referenceSolutions,
        } = body;

        // Basic validation
        if (!title || !description || !difficulty || !testCases || !codeSnippets || !referenceSolutions) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Validate test cases
        if (!Array.isArray(testCases) || testCases.length === 0) {
            return NextResponse.json(
                { error: "At least one test case is required" },
                { status: 400 }
            );
        }

        // Validate reference solutions
        if (!referenceSolutions || typeof referenceSolutions !== 'object') {
            return NextResponse.json(
                { error: "Reference solutions must be provided for all supported languages" },
                { status: 400 }
            );
        }

        // Only validate with Judge0 if the API URL is configured
        if (process.env.JUDGE0_API_URL) {
            console.log('Judge0 validation enabled - validating reference solutions...');

            for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
                // Step 2.1: Get Judge0 language ID for the current language
                const languageId = getJudge0LanguageId(language);
                if (!languageId) {
                    return NextResponse.json(
                        { error: `Unsupported language: ${language}` },
                        { status: 400 }
                    );
                }

                // Step 2.2: Prepare Judge0 submissions for all test cases
                const submissions = testCases.map(({ input, output }) => ({
                    source_code: solutionCode,
                    language_id: languageId,
                    stdin: input,
                    expected_output: output,
                }));



                // Step 2.3: Submit all test cases in one batch
                const submissionResults = await submitBatch(submissions);

                // Step 2.4: Extract tokens from response
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const tokens = submissionResults.map((res: any) => res.token);

                // Step 2.5: Poll Judge0 until all submissions are done
                const results = await pollBatchResults(tokens);

                // Step 2.6: Validate that each test case passed (status.id === 3)
                for (let i = 0; i < results.length; i++) {
                    const result = results[i];
                    console.log(`Test case ${i + 1} details:`, {
                        input: submissions[i].stdin,
                        expectedOutput: submissions[i].expected_output,
                        actualOutput: result.stdout,
                        status: result.status,
                        language: language,
                        error: result.stderr || result.compile_output,
                    });

                    if (result.status.id !== 3) {
                        return NextResponse.json(
                            {
                                error: `Validation failed for ${language}`,
                                testCase: {
                                    input: submissions[i].stdin,
                                    expectedOutput: submissions[i].expected_output,
                                    actualOutput: result.stdout,
                                    error: result.stderr || result.compile_output,
                                },
                                details: result,
                            },
                            { status: 400 }
                        );
                    }
                }
            }
        } else {
            console.warn('⚠️  JUDGE0_API_URL not configured - skipping reference solution validation');
            console.warn('⚠️  Problems will be created without validating that reference solutions work correctly');
        }

        // Step 3: Save the problem in the database after all validations pass
        const newProblem = await db.problem.create({
            data: {
                title,
                description,
                difficulty,
                tags,
                examples,
                constraints,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                testCases: testCases as any, // Prisma json field
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                codeSnippets: codeSnippets as any, // Prisma json field
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                referenceSolutions: referenceSolutions as any, // Prisma json field
                userId: currentUser.id,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Problem created successfully",
            data: newProblem,
        }, { status: 201 });
    } catch (dbError) {
        console.error("Database error:", dbError);
        return NextResponse.json(
            { error: "Failed to save problem to database" },
            { status: 500 }
        );
    }
}
