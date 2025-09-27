
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { BRAND } from '@/lib/theme';

export default function AdminHome() {
  const [stats, setStats] = useState<any>({ jobs:0, applicants:0, applications:0 });

  useEffect(() => {
    (async () => {
      const [{ count: c1 }, { count: c2 }, { count: c3 }] = await Promise.all([
        supabase.from('jobs').select('*', { count:'exact', head:true }),
        supabase.from('applicants').select('*', { count:'exact', head:true }),
        supabase.from('applications').select('*', { count:'exact', head:true }),
      ]);
      setStats({ jobs: c1||0, applicants: c2||0, applications: c3||0 });
    })();
  }, []);

  return (
    <main>
      <h2 style={{ color:BRAND.colors.primary }}>لوحة الإدارة</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
        <div style={{ background:'#14171a', padding:16, borderRadius:12, border:`1px solid ${BRAND.colors.accent}` }}><b>الوظائف</b><div>{stats.jobs}</div></div>
        <div style={{ background:'#14171a', padding:16, borderRadius:12, border:`1px solid ${BRAND.colors.accent}` }}><b>المتقدمون</b><div>{stats.applicants}</div></div>
        <div style={{ background:'#14171a', padding:16, borderRadius:12, border:`1px solid ${BRAND.colors.accent}` }}><b>طلبات التوظيف</b><div>{stats.applications}</div></div>
      </div>
      <div style={{ marginTop:16 }}>
        <a href="/admin/jobs" style={{ color:BRAND.colors.secondary }}>إدارة الوظائف</a> |{" "}
        <a href="/admin/reports" style={{ color:BRAND.colors.accent }}>التقارير</a>
      </div>
    </main>
  );
}
