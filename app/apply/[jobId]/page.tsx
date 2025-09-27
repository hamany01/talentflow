
'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { BRAND } from '@/lib/theme';

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = Number(params?.jobId);
  const [form, setForm] = useState<any>({ full_name:'', email:'', phone:'', skills_text:'' });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data: applicant, error: e1 } = await supabase.from('applicants').insert({
        full_name: form.full_name, email: form.email, phone: form.phone, skills_text: form.skills_text
      }).select().single();
      if (e1) throw e1;
      let file_url: string | null = null;

      if (file) {
        const path = `${applicant.id}/${Date.now()}_${file.name}`;
        const { error: upErr } = await supabase.storage.from('cv').upload(path, file);
        if (upErr) throw upErr;
        const { data: pub } = await supabase.storage.from('cv').getPublicUrl(path);
        file_url = pub?.publicUrl || null;
        await supabase.from('applicants').update({ cv_file_url: file_url }).eq('id', applicant.id);
      }

      const { data: job } = await supabase.from('jobs').select('id, requirements').eq('id', jobId).single();
      const req = job?.requirements || '';
      const res = await fetch('/api/score', { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ resumeText: form.skills_text, jobRequirements: req }) });
      const { score, label } = await res.json();

      const { error: e2 } = await supabase.from('applications').insert({
        job_id: jobId, applicant_id: applicant.id, stage: 'applied', ai_score: score, source: 'site'
      });
      if (e2) throw e2;

      alert(`تم التقديم بنجاح. التقييم الأولي: ${label} (${score})`);
      router.push('/');
    } catch (err: any) {
      alert('حدث خطأ أثناء الإرسال');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <h2 style={{ color:BRAND.colors.primary }}>التقديم على الوظيفة #{jobId}</h2>
      <form onSubmit={onSubmit} style={{ display:'grid', gap:12, maxWidth:600 }}>
        <input required placeholder="الاسم الكامل" value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})} />
        <input required type="email" placeholder="البريد الإلكتروني" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <input placeholder="رقم الجوال" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
        <textarea placeholder="مهاراتك/ملخص الخبرات" value={form.skills_text} onChange={e=>setForm({...form, skills_text:e.target.value})} rows={6} />
        <div>
          <label>ارفع السيرة الذاتية (اختياري): </label>
          <input type="file" onChange={e=>setFile(e.target.files?.[0] || null)} />
        </div>
        <button disabled={submitting} style={{ background:BRAND.colors.secondary, color:'#fff', padding:'8px 14px', borderRadius:8, border:'none' }}>
          {submitting? 'جارِ الإرسال...' : 'إرسال'}
        </button>
      </form>
    </main>
  );
}
