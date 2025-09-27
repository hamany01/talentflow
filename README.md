
# TalentFlow (HRjeddah) — Branded Starter

Brand: Jeddah Paints Factory / شركة مصنع جدة للدهانات والمعاجين  
Colors: Primary #31489D, Secondary #DF2D2F, Accent #7C8ABC  
Logo: `/public/logo.png`

## Quick Start
1) Supabase → run `supabase/schema.sql`, then `supabase/policies.sql`, then (optional) `supabase/seed.sql`.
2) Storage → create bucket `cv` (private).
3) Env:
   - NEXT_PUBLIC_SUPABASE_URL = https://tgyeozdjcwutmaiqzemw.supabase.co
   - NEXT_PUBLIC_SUPABASE_ANON_KEY = (see .env.local)
4) Deploy on Vercel (Hobby). First signup → set role admin with `supabase/admin.sql`.

## Branding
- Colors and logo are wired in `lib/theme.ts` and `app/layout.tsx`.
