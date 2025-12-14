"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { includes } from "zod";


export const getCurrentUser = async () => {
    try {
        const user = await currentUser();

        if (!user) {
            return { success: false, error: "User not authenticated" };
        }
        const data = await db.user.findUnique({
            where: {
                clerkId: user.id
            },
            include: {
                submissions: true,
                solvedProblems: true,
                playlists: true
            }

        })
        return data;
    } catch (error) {
        console.error("❌ Error fetching user:", error);
        return { success: false, error: "Failed to fetch user" };
    }
};