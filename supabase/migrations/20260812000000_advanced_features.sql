-- Migration: Schema additions for 5 Advanced Features
-- 1. ATS Analyses Table
CREATE TABLE IF NOT EXISTS public.ats_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  company TEXT NOT NULL,
  job_description TEXT NOT NULL,
  overall_score INT NOT NULL,
  keyword_score INT NOT NULL,
  skills_score INT NOT NULL,
  readability_score INT NOT NULL,
  relevance_score INT NOT NULL,
  breakdown_json JSONB NOT NULL,
  matched_keywords TEXT[] DEFAULT '{}'::TEXT[],
  missing_keywords TEXT[] DEFAULT '{}'::TEXT[],
  recommendations TEXT[] DEFAULT '{}'::TEXT[],
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. Interview Prep Sessions & Q&A Tables
CREATE TABLE IF NOT EXISTS public.interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
  job_title TEXT NOT NULL,
  company TEXT NOT NULL,
  job_description TEXT NOT NULL,
  questions_json JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS public.interview_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  category TEXT NOT NULL,
  user_answer TEXT NOT NULL,
  feedback_json JSONB NOT NULL,
  score INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. Offer Evaluations & Negotiation Scripts Table
CREATE TABLE IF NOT EXISTS public.offer_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
  company TEXT NOT NULL,
  job_title TEXT NOT NULL,
  base_salary NUMERIC NOT NULL,
  bonus NUMERIC DEFAULT 0,
  equity_value NUMERIC DEFAULT 0,
  signing_bonus NUMERIC DEFAULT 0,
  remote_allowance NUMERIC DEFAULT 0,
  total_compensation NUMERIC NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS public.negotiation_scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  evaluation_id UUID REFERENCES public.offer_evaluations(id) ON DELETE CASCADE,
  tone TEXT NOT NULL,
  counter_target NUMERIC NOT NULL,
  justification TEXT NOT NULL,
  email_script TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Enable RLS
ALTER TABLE public.ats_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negotiation_scripts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own ATS analyses" ON public.ats_analyses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own interview sessions" ON public.interview_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own interview answers" ON public.interview_answers FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own offer evaluations" ON public.offer_evaluations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own negotiation scripts" ON public.negotiation_scripts FOR ALL USING (auth.uid() = user_id);

-- Indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_ats_analyses_user ON public.ats_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user ON public.interview_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_answers_session ON public.interview_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_offer_evaluations_user ON public.offer_evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_negotiation_scripts_eval ON public.negotiation_scripts(evaluation_id);
