
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { BRAND } from '@/lib/theme';

export default function JobCandidates() {
  const params = useParams();
  const jobId = Number(params?.id);
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.rpc('get_applications_with_applicants', { p_job_id: jobId });
      setRows(data || []);
    })();
  }, [jobId]);

  return (
    <main>
      <h2 style={{ color:BRAND.colors.primary }}>مرشحو الوظيفة #{jobId}</h2>
      <table style={{ width:'100%', background:'#14171a', borderRadius:12, border:`1px solid ${BRAND.colors.accent}` }}>
        <thead>
          <tr>
            <th style={{ textAlign:'right', padding:8 }}>الاسم</th>
            <th>المرحلة</th>
            <th>ملاءمة AI</th>
            <th>ملاحظات</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.application_id}>
              <td style={{ padding:8 }}>{r.full_name}</td>
              <td>{r.stage}</td>
              <td>{r.ai_score ?? '-'}</td>
              <td><a style={{ color:BRAND.colors.secondary }} href={`/admin/applications/${r.application_id}`}>فتح</a></td>
            </tr>
          ))}
          {rows.length===0 && <tr><td colSpan={4} style={{ padding:8 }}>لا يوجد مرشحون بعد.</td></tr>}
        </tbody>
      </table>
    </main>
  );
}
