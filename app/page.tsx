
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { BRAND } from '@/lib/theme';

type Job = { id: number; title: string; description: string | null; location: string | null; type: string | null; };

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('jobs').select('id, title, description, location, type').order('id', { ascending: false });
      setJobs(data || []);
    })();
  }, []);

  return (
    <main>
      <h2 style={{ color: BRAND.colors.primary }}>الوظائف المتاحة</h2>
      <div style={{ display:'grid', gap:16 }}>
        {jobs.map(j => (
          <div key={j.id} style={{ background:'#14171a', padding:16, borderRadius:12, border:`1px solid ${BRAND.colors.accent}` }}>
            <h3 style={{ marginTop:0, color: BRAND.colors.secondary }}>{j.title}</h3>
            <p style={{ opacity:.9 }}>{(j.description || '').slice(0,180)}...</p>
            <div style={{ display:'flex', gap:12, fontSize:14, opacity:.8 }}>
              <span>{j.location || 'غير محدد'}</span>
              <span>-</span>
              <span>{j.type || 'دوام كامل'}</span>
            </div>
            <div style={{ marginTop:12 }}>
              <a href={`/jobs/${j.id}`} style={{ color:BRAND.colors.accent }}>عرض التفاصيل</a>
              {" "} | {" "}
              <a href={`/apply/${j.id}`} style={{ color:BRAND.colors.primary }}>تقدم الآن</a>
            </div>
          </div>
        ))}
        {jobs.length===0 && <p>لا توجد وظائف بعد.</p>}
      </div>
    </main>
  );
}
