# Jumble

Jumble is a modern, full-stack job application platform where users can showcase portfolios, apply to jobs with one swipe, and connect tech projects—all with a beautiful, performant UI.

## Features

- Swipe-to-apply for jobs (Bumble-style UX)
- Upload portfolios and resumes (URL-based storage)
- Track projects and display skillsets
- Flexible job filters and search
- Tech stack tagging for roles and users
- Built on a monorepo architecture for optimal team workflow

## Tech Stack

| Layer         | Technology                |
| ------------- | ------------------------- |
| Backend       | Node.js, Prisma ORM       |
| Frontend      | Next.js, React            |
| Styling       | Tailwind CSS              |
| Monorepo      | Turborepo                 |
| Database      | PostgreSQL (suggested)    |
| File Storage  | Cloud storage (e.g. S3)   |

## Project Structure

- `/apps/` — Application frontends (Next.js)
- `/packages/` — Reusable logic and components, Prisma client, shared types
- `/prisma/` — Schema files

## Getting Started

1. **Clone the repository:**
git clone https://github.com/ParasharDeb/Jumble

2. **Install dependencies:**

3. **Configure Environment:**
- Copy `.env.example` to `.env` and set your database and storage credentials.

4. **Set Up Prisma:**

5. **Run the app:**


## Scripts

- `pnpm run dev` — Start development server
- `pnpm run build` — Build for production
- `pnpm dlx prisma studio` — Prisma Studio (database GUI)
- `pnpm dlx prisma migrate dev` — Run DB migrations

