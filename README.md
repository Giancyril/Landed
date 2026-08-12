# Landed — AI Job Search Copilot

A production-grade, full-stack AI-augmented job search platform. Features live job search via the Adzuna API, non-fabrication resume tailoring via Google Gemini, an anti-boilerplate cover letter generator, a Kanban application tracker, an ATS match analyzer & heatmap, an AI interview prep copilot, salary negotiation script advisor, multi-format exports (PDF, JSON Resume, MD), and real-time pipeline velocity analytics — all built on Next.js 16 App Router with Supabase Auth and Row Level Security.

## 🌟 Advanced AI Features

### 1. 📊 Interactive Resume ATS Score Analyzer & Heatmap Generator (`/ats`)
- **Quantitative ATS Match Score (0–100%)** comparing base/tailored resumes against target job postings.
- **Dimensional Breakdown Cards**: Score cards for *Keyword Density*, *Technical Stack Coverage*, *Formatting/Readability*, and *Experience Relevance*.
- **Skill Gap Heatmap**: Color-coded matched vs missing skill tags with 1-click "Auto-Tailor Resume" integration.

### 2. 🎙️ AI Interview Prep Copilot & Practice Workbench (`/interview`)
- **Tailored Question Bank**: Generates role-specific questions across *Technical Deep Dives*, *Behavioral (STAR Method)*, and *Situational*.
- **Interactive Practice Workbench**: Users submit answers to receive real-time Gemini AI scoring (0–100), key strengths, improvement gaps, and an exemplar model answer.

### 3. 💰 Interactive Salary & Offer Negotiation Advisor (`/negotiate`)
- **Offer Evaluator & Total Compensation Calculator**: Compare base pay, annual bonus %, equity grant, signing bonus, and remote stipends.
- **AI Negotiation Email Generator**: Generates customized counter-offer emails with tone controls (*Collaborative*, *Firm & Competitive*, *Direct Executive*) and target counter-offer benchmarks.

### 4. 📄 Multi-Format Resume Export & Template Engine
- **Multiple Executive Templates**: Modern Minimalist, Executive Emerald, and Tech Compact styling themes.
- **Multi-Format Exports**: PDF export, HTML preview, Plain Text, and standard **JSON Resume** schema format.

### 5. 📈 Career Analytics & Pipeline Insights Dashboard (`/analytics`)
- **Visual Analytics Suite**: Application velocity, Response Rate %, Interview Conversion %, and Offer Conversion %.
- **Pipeline Bottleneck Diagnostics**: AI insights comparing performance with vs. without resume tailoring.
- **Data Export**: Download tracking and analytics history as CSV/JSON.

---

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

---

## Database Schema Migrations

```
supabase/migrations/
├── 20260811000000_initial_schema.sql       # Core profiles, resumes, saved_jobs, tailored_resumes, cover_letters, applications
├── 20260811000001_triggers.sql             # Auto-updated_at triggers
└── 20260812000000_advanced_features.sql    # ats_analyses, interview_sessions, interview_answers, offer_evaluations, negotiation_scripts
```

All tables enforce Supabase Row Level Security (`auth.uid() = user_id`).

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/Giancyril/Landed.git
cd Landed
npm install
```

### 2. Configure Environment

Edit `.env` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

GEMINI_API_KEY="your-gemini-api-key"

ADZUNA_APP_ID="your-adzuna-app-id"
ADZUNA_APP_KEY="your-adzuna-app-key"

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Apply Migrations & Run

In your Supabase SQL Editor, execute all SQL files from `supabase/migrations/`. Then start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## License

MIT
