<div align="center">

# ⚡ LeetMeOut

### Master Problem Solving with a Full-Stack LeetCode Clone

A modern competitive programming platform built with **Next.js App Router**, **Clerk** authentication, a **Judge0**-powered code execution engine, and a **PostgreSQL** database via **Prisma ORM**.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge)](https://clerk.com/)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | Full sign-up / sign-in flow powered by **Clerk**, with role-based access (Admin / User) |
| 🧩 **Problem Library** | Browse, filter by difficulty & tags, and search through a curated problem set |
| 💻 **Code Editor** | In-browser **Monaco Editor** (VS Code engine) with multi-language support |
| ▶️ **Code Execution** | Run & submit code against test cases via the **Judge0** execution engine |
| 📊 **Submissions** | Track submission history, execution status, memory, and runtime per problem |
| 🏆 **User Profiles** | View your stats — success rate, total submissions, and problems solved |
| 📁 **Playlists** | Create and manage personal playlists to group problems by topic or difficulty |
| ✍️ **Problem Creation** | Admin users can create problems with examples, test cases, hints, and editorials |
| 🌙 **Dark / Light Mode** | Theme toggling with `next-themes` for comfortable coding at any hour |
| 🐳 **Docker Setup** | One-command PostgreSQL database spin-up via **Docker Compose** |

---

## 🖼️ Screenshots

**Homepage — Master Problem Solving**
![Homepage](./screenshots/01-homepage.png)

**Problems — Browse, Filter & Search**
![Problems Page](./screenshots/02-problems.png)

**Problem Detail — Code Editor & Test Cases**
![Code Editor](./screenshots/03-code-editor.png)

**Profile — Stats & Submission History**
![User Profile](./screenshots/04-profile.png)

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org/) | Full-stack React framework with App Router |
| [React 19](https://react.dev/) | UI library |
| [TypeScript 5](https://www.typescriptlang.org/) | End-to-end type safety |
| [Clerk](https://clerk.com/) | Authentication & user management |
| [Prisma ORM](https://www.prisma.io/) | Type-safe database access layer |
| [PostgreSQL](https://www.postgresql.org/) | Relational database for all app data |
| [Judge0](https://judge0.com/) | Remote code execution engine (run & submit) |
| [Monaco Editor](https://microsoft.github.io/monaco-editor/) | VS Code-powered in-browser code editor |
| [TailwindCSS v4](https://tailwindcss.com/) | Utility-first CSS framework |
| [shadcn/ui](https://ui.shadcn.com/) | Accessible, composable UI component library |
| [Radix UI](https://www.radix-ui.com/) | Headless primitives powering shadcn/ui |
| [React Hook Form](https://react-hook-form.com/) | Performant form state management |
| [Zod](https://zod.dev/) | Schema validation |
| [date-fns](https://date-fns.org/) | Date formatting utilities |
| [Docker Compose](https://docs.docker.com/compose/) | Local PostgreSQL database orchestration |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [Docker](https://www.docker.com/) (for local PostgreSQL)
- A [Clerk](https://clerk.com/) account (for authentication)
- A [Judge0](https://judge0.com/) API key (for code execution)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/leetcode-nextjs-clone.git
cd leetcode-nextjs-clone

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres123@localhost:5433/leetcode"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
CLERK_SECRET_KEY=<your-clerk-secret-key>
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Judge0 Code Execution
JUDGE0_API_URL=<your-judge0-api-url>
JUDGE0_API_KEY=<your-judge0-api-key>
```

### Database Setup

```bash
# Start PostgreSQL via Docker
docker compose up -d

# Run Prisma migrations
npx prisma migrate dev

# (Optional) Open Prisma Studio to inspect data
npx prisma studio
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

> `npm run dev` automatically starts the Docker container before launching the Next.js dev server.

### Production Build

```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
leetcode-nextjs-clone/
├── app/
│   ├── (auth)/                    # Clerk sign-in / sign-up pages
│   ├── (root)/
│   │   ├── problems/              # Problem list page
│   │   └── profile/               # User profile & stats page
│   ├── api/
│   │   ├── create-problem/        # API route — create a new problem
│   │   └── playlists/             # API routes — playlist CRUD
│   ├── create-problem/            # Admin: problem creation form
│   ├── problem/[id]/              # Dynamic problem detail & editor page
│   ├── layout.tsx                 # App shell (Clerk provider, theme)
│   ├── page.tsx                   # Landing page (hero, stats, features)
│   └── globals.css                # Global styles & Tailwind theme
├── components/                    # Shared, reusable UI components
├── hooks/                         # Custom React hooks
├── lib/                           # Utility functions & shared logic
├── modules/
│   ├── auth/                      # Auth-related components/logic
│   ├── home/                      # Landing page sections
│   ├── problems/                  # Problem list & filtering logic
│   └── profile/                   # Profile page components
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/                # Prisma migration history
├── public/                        # Static assets
├── docker-compose.yml             # PostgreSQL container config
├── next.config.ts                 # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json
```

---

## 🔄 How It Works

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Browse &   │────▶│  Open a     │────▶│  Write & Run    │────▶│  Submit & Track │
│  Filter     │     │  Problem    │     │  in Monaco      │     │  via Judge0     │
│  Problems   │     │  Detail     │     │  Editor         │     │  Execution API  │
└─────────────┘     └─────────────┘     └─────────────────┘     └─────────────────┘
```

1. **Browse** — Filter problems by difficulty (Easy / Medium / Hard) and tags from the Problems page
2. **Open** — View the problem description, examples, constraints, hints, and editorial
3. **Write** — Use the Monaco editor to write a solution in your preferred language
4. **Run** — Test your code against provided test cases before submitting
5. **Submit** — Full submission is evaluated by Judge0 and results are persisted to PostgreSQL via Prisma
6. **Track** — View your submission history and stats on your personal Profile page

---

## 🗃️ Database Schema

The app uses **PostgreSQL** managed by **Prisma ORM** with the following core models:

| Model | Description |
|---|---|
| `User` | Auth via Clerk, role (Admin / User), linked to problems & submissions |
| `Problem` | Title, description, difficulty, tags, test cases, code snippets & solutions |
| `Submission` | Per-user code run results, language, status, memory, and runtime |
| `TestCaseResult` | Individual test case pass/fail per submission |
| `ProblemSolved` | Tracks which problems each user has solved |
| `Playlist` | User-created problem collections |
| `ProblemInPlaylist` | Many-to-many join for problems within a playlist |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

Built with ❤️ using Next.js, Prisma & Judge0

</div>
