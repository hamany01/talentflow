
alter table users enable row level security;
alter table jobs enable row level security;
alter table applicants enable row level security;
alter table applications enable row level security;
alter table notes enable row level security;

create policy "Public read jobs" on jobs for select using (true);
create policy "User can read self" on users for select using (auth.uid() = id);
create policy "User can update self" on users for update using (auth.uid() = id);

create policy "Anyone can insert applicant" on applicants for insert with check (true);
create policy "HR read applicants" on applicants for select using (true);

create policy "Anyone can insert application" on applications for insert with check (true);
create policy "Read applications (starter)" on applications for select using (true);

create policy "Auth can insert notes" on notes for insert with check (auth.role() = 'authenticated');
create policy "Read notes (starter)" on notes for select using (true);
