# TalentFlow HRjeddah (Next.js + Supabase)

## البيئة
ضع هذه المتغيرات في Vercel (أو `.env.local` للتجربة المحلية):
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## الجداول المتوقعة
- jobs(id serial pk, title text, location text, type text, description text, requirements text, status text default 'open')
- applications(id serial pk, job_id int, full_name text, email text, phone text, summary text, cv_url text, status text default 'new', created_at timestamptz default now())

## تشغيل محلي
```
npm install
npm run dev
```
