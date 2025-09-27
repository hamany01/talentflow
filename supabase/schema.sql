
-- (Same schema as starter) See previous package if needed; keeping concise:
create table if not exists roles (
  id serial primary key,
  name text unique not null check (name in ('admin','hr_manager','talent_acq','hiring_manager'))
);
create table if not exists departments ( id serial primary key, name text not null unique );
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique, name text, role text references roles(name),
  department_id int references departments(id), created_at timestamptz default now()
);
create table if not exists jobs (
  id serial primary key, title text not null, dept_id int references departments(id),
  location text, type text, description text, requirements text, status text default 'open',
  created_by uuid references users(id), created_at timestamptz default now()
);
create table if not exists applicants (
  id serial primary key,
  full_name text not null, email text, phone text, city text, country text,
  education_summary text, years_exp int, last_company text, skills_text text,
  cv_file_url text, parsed_text text, created_at timestamptz default now()
);
create table if not exists applications (
  id serial primary key, job_id int references jobs(id) on delete cascade,
  applicant_id int references applicants(id) on delete cascade,
  stage text default 'applied', ai_score int, ai_label text, source text,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists notes (
  id serial primary key, application_id int references applications(id) on delete cascade,
  author_id uuid references users(id), body text, visibility text default 'internal',
  created_at timestamptz default now()
);
create table if not exists events (
  id serial primary key, application_id int references applications(id) on delete cascade,
  type text, payload_json jsonb, created_at timestamptz default now()
);
create table if not exists evaluations (
  id serial primary key, application_id int references applications(id) on delete cascade,
  evaluator_id uuid references users(id), criteria_json jsonb, total_score int, created_at timestamptz default now()
);
create table if not exists attachments (
  id serial primary key, application_id int references applications(id) on delete cascade,
  file_url text, type text, created_at timestamptz default now()
);
create table if not exists audit_log (
  id serial primary key, actor_id uuid references users(id), action text,
  target_table text, target_id int, meta_json jsonb, created_at timestamptz default now()
);
create or replace function get_applications_with_applicants(p_job_id int)
returns table(application_id int, stage text, ai_score int, full_name text) language sql as $$
  select a.id, a.stage, a.ai_score, ap.full_name
  from applications a join applicants ap on ap.id = a.applicant_id
  where a.job_id = p_job_id order by a.id desc;
$$;
