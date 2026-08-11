# Landed — AI Job Search Copilot

A production-grade, full-stack AI-augmented job search platform. Features live job search via the Adzuna API, non-fabrication resume tailoring via Google Gemini, an anti-boilerplate cover letter generator, a Kanban application tracker, PDF/DOCX text extraction, and an executive dark-navy design system — all on Next.js 16 App Router with Supabase Auth and Row Level Security.

## Features

### Core Functionality
- **Live Job Search** — Real-time postings via the Adzuna REST API with keyword, location, country, and remote filters. Arbeitnow zero-config fallback for instant demo without API keys
- **Smart Job Cards** — Company avatar initials, salary range, remote badges, direct external links, and 1-click "Track" and "Tailor Resume" actions
- **Job Details Modal** — Full description viewer with formatted metadata and inline action buttons

### AI Resume Pipeline (Google Gemini 1.5 Flash)
- **Resume Upload & Parsing** — PDF text extraction via `pdf-parse` and DOCX extraction via `mammoth` with server-side text cleaning
- **Non-Fabrication Resume Tailoring** — AI rewrites achievement bullets to match target job keywords without inventing credentials, job titles, companies, or dates
- **Side-by-Side Diff Viewer** — Before/After column comparison of every bullet with AI reasoning, matched keyword badges, and missing keyword callouts
- **Markdown Export** — Download tailored resume bullets as a `.md` file

### Cover Letter Generator
- **Anti-Boilerplate Engine** — Strict system prompt banning generic AI clichés ("I am writing to express my enthusiastic interest...", "Thrilled to apply", etc.)
- **Custom Candidate Notes** — Inject personal instructions (relocation details, specific projects to highlight, notice period)
- **Interactive Inline Editor** — Live word/character counter, editable draft, copy to clipboard, `.txt` download

### Application Tracker
- **6-Stage Kanban Board** — `Saved → Applied → Interviewing → Offer → Rejected → Withdrawn` columns
- **Optimistic Status Updates** — Inline stage dropdown with instant client-side updates, server rollback on error
- **Table List View** — Toggle between Kanban Board and searchable flat table view
- **Application Notes** — Personal notes per application with modal editor

### Dashboard
- **Live Stats Bar** — Real-time counts of tracked applications by pipeline stage
- **Personalised Homepage** — Gradient feature cards with animated hover arrows
- **Executive Design System** — Deep navy palette (`#0b1329`), emerald accent (`#10b981`), custom scrollbars, focus glow rings

### Security & Infrastructure
- **Supabase Row Level Security** — Every table scoped to `auth.uid()` — zero cross-user data leakage
- **Server-Side Auth Guards** — Dashboard layout enforces session check with `createClient()` before rendering
- **Supabase Storage** — Resume PDF/DOCX binaries stored in the `resumes` bucket

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, full-stack) |
| Language | TypeScript 5 (strict mode) |
| AI | Google Gemini 1.5 Flash (`@google/generative-ai`) |
| Auth & DB | Supabase (`@supabase/ssr`, Postgres, RLS) |
| File Storage | Supabase Storage |
| Job Board | Adzuna REST API (Arbeitnow fallback) |
| PDF Parser | `pdf-parse` + `mammoth` |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Icons | Lucide React |
| Hosting | Vercel (recommended) |

## Getting Started

### Prerequisites
- Node.js 20+
- A [Supabase](https://supabase.com) project
- A [Google Gemini](https://aistudio.google.com/app/apikey) API key
- (Optional) An [Adzuna](https://developer.adzuna.com/) API key

### 1. Clone the Repository

```bash
git clone https://github.com/Giancyril/Landed.git
cd Landed
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

GEMINI_API_KEY="your-gemini-api-key"

ADZUNA_APP_ID="your-adzuna-app-id"
ADZUNA_APP_KEY="your-adzuna-app-key"

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

> **Note:** Adzuna keys are optional. The app falls back to the free Arbeitnow API automatically when they are absent.

### 3. Run the Database Migration

In your Supabase project, navigate to **SQL Editor** and run the full migration file:

```
supabase/migrations/20260811000000_initial_schema.sql
```

This creates all tables (`profiles`, `resumes`, `tailored_resumes`, `cover_letters`, `applications`, `saved_jobs`), indexes, Row Level Security policies, and the auto-profile trigger.

### 4. Create Supabase Storage Bucket

In the Supabase dashboard → **Storage**:
1. Create a bucket named `resumes`
2. Set the bucket to **private**
3. Add an RLS policy: `auth.uid()::text = (storage.foldername(name))[1]`

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the app.

## Project Structure

```
├── app/
│   ├── (auth)/               # Login & Signup pages
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/          # Protected route group
│   │   ├── layout.tsx        # Auth guard + Sidebar + Header
│   │   ├── jobs/page.tsx     # Homepage + job search
│   │   ├── resumes/page.tsx  # Resume manager
│   │   ├── tailor/page.tsx   # AI tailoring workspace
│   │   ├── cover-letter/     # Cover letter generator
│   │   └── tracker/page.tsx  # Kanban tracker board
│   └── api/
│       ├── auth/callback/    # Supabase OAuth callback
│       ├── jobs/search/      # GET job search (Adzuna)
│       ├── resume/           # GET list, POST upload, DELETE, PATCH
│       │   ├── upload/       # POST: PDF/DOCX parse + store
│       │   ├── tailor/       # POST: Gemini non-fabrication tailor
│       │   └── [id]/         # DELETE / PATCH single resume
│       ├── cover-letter/generate/ # POST: Gemini cover letter
│       └── applications/     # GET/POST + [id] PATCH/DELETE
├── components/
│   ├── auth/                 # LoginForm, SignupForm
│   ├── cover-letter/         # CoverLetterEditor
│   ├── jobs/                 # JobCard, JobFilters, JobDetailsModal
│   ├── layout/               # Sidebar, Header
│   ├── resumes/              # ResumeCard, ResumeUploadZone, ExtractedTextModal
│   ├── tailoring/            # TailorDiffViewer, TailorProgressLoader
│   ├── tracker/              # KanbanColumn, ApplicationCard, ApplicationModal
│   └── ui/                   # EmptyState, SkeletonCard
├── lib/
│   ├── ai/                   # Gemini client + prompts
│   ├── jobs/                 # Adzuna provider client
│   ├── resume/               # PDF/DOCX parser
│   └── supabase/             # Client, server, middleware
├── supabase/migrations/      # Full Postgres schema + RLS
└── types/index.ts            # Shared TypeScript types
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/jobs/search` | Search job postings (Adzuna / Arbeitnow) |
| `GET` | `/api/resume` | List user resumes |
| `POST` | `/api/resume/upload` | Upload & parse PDF/DOCX resume |
| `PATCH` | `/api/resume/[id]` | Set resume as primary |
| `DELETE` | `/api/resume/[id]` | Delete resume record |
| `POST` | `/api/resume/tailor` | Gemini AI resume tailoring |
| `POST` | `/api/cover-letter/generate` | Gemini AI cover letter |
| `GET` | `/api/applications` | List tracked applications |
| `POST` | `/api/applications` | Track new application |
| `PATCH` | `/api/applications/[id]` | Update status / notes |
| `DELETE` | `/api/applications/[id]` | Remove tracked application |

## Database Schema

```sql
profiles        -- Auto-created on signup via trigger
resumes         -- PDF/DOCX files + extracted text
tailored_resumes -- Gemini AI output (diff_json JSONB)
cover_letters   -- Generated letter content
applications    -- Kanban board (status ENUM)
saved_jobs      -- Cached job postings from providers
```

All tables have RLS enabled and are scoped to `auth.uid()`.

## Deployment

### Vercel (Recommended)

1. Push to GitHub (already done)
2. Import the repository at [vercel.com/new](https://vercel.com/new)
3. Add all environment variables from `.env.example`
4. Deploy — the Next.js App Router is fully supported with zero config

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

## License

MIT
