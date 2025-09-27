
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { BRAND } from '@/lib/theme';

export default function JobDetails() {
  const params = useParams();
  const [job, setJob] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('jobs').select('*').eq('id', Number(params?.id)).single();
      setJob(data);
    })();
  }, [params?.id]);

  if (!job) return <p>جارِ التحميل...</p>;

  return (
    <main>
      <h2 style={{ color: BRAND.colors.secondary }}>{job.title}</h2>
      <p><b>الموقع:</b> {job.location || 'غير محدد'} | <b>النوع:</b> {job.type || 'دوام كامل'}</p>
      <h3>الوصف</h3>
      <p style={{ whiteSpace:'pre-wrap' }}>{job.description}</p>
      <h3>المتطلبات</h3>
      <p style={{ whiteSpace:'pre-wrap' }}>{job.requirements}</p>
      <a href={`/apply/${job.id}`} style={{ color:BRAND.colors.primary }}>التقديم على هذه الوظيفة</a>
    </main>
  );
}
