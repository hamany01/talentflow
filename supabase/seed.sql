
insert into roles (name) values ('admin'), ('hr_manager'), ('talent_acq'), ('hiring_manager')
on conflict (name) do nothing;

insert into departments (name) values ('الموارد البشرية'), ('المبيعات'), ('التشغيل'), ('الجودة')
on conflict (name) do nothing;

insert into jobs (title, dept_id, location, type, description, requirements)
values
('أخصائي موارد بشرية', 1, 'جدة', 'دوام كامل', 'إدارة شؤون الموظفين، متابعة الحضور، اللوائح', 'HR, قانون العمل, Excel, ERP, English'),
('مندوب مبيعات دهانات', 2, 'الرياض', 'دوام كامل', 'زيارة العملاء وتغطية المنطقة، تحقيق الأهداف', 'Sales, Paints, CRM, Negotiation, Driving License');
