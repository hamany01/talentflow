
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { BRAND } from '@/lib/theme';

export default function JobsAdmin() {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('jobs').select('*').order('id', { ascending: false });
      setJobs(data || []);
    })();
  }, []);

  return (
    <main>
      <h2 style={{ color:BRAND.colors.primary }}>الوظائف</h2>
      <a href="/admin/jobs/new" style={{ color:BRAND.colors.secondary }}>إضافة وظيفة</a>
      <div style={{ marginTop:12, display:'grid', gap:12 }}>
        {jobs.map(j => (
          <div key={j.id} style={{ background:'#14171a', padding:12, borderRadius:12, border:`1px solid ${BRAND.colors.accent}` }}>
            <b>{j.title}</b> — {j.location || 'غير محدد'} — {j.type || 'دوام كامل'}
            <div><a href={`/admin/jobs/${j.id}`} style={{ color:BRAND.colors.accent }}>تفاصيل المرشحين</a></div>
          </div>
        ))}
        {jobs.length===0 && <p>لا توجد وظائف.</p>}
      </div>
    </main>
  );
}
