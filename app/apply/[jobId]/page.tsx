'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function ApplyPage() {
  const { jobId } = useParams() as { jobId: string };

  const [fullName, setFullName] = useState('');
  const [email, setEmail]       = useState('');
  const [phone, setPhone]       = useState('');
  const [summary, setSummary]   = useState('');
  const [file, setFile]         = useState<File | null>(null);
  const [sending, setSending]   = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    let cv_path: string | null = null;

    // 1) ارفع الـCV إن وُجد (إلى bucket=cv)
    try {
      if (file) {
        const ext = file.name.split('.').pop() || 'pdf';
        const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const path = `uploads/${name}`;

        const { error: upErr } = await supabase
          .storage
          .from('cv')
          .upload(path, file, {
            contentType: file.type || 'application/pdf',
            upsert: false
          });

        if (!upErr) cv_path = path;
        else console.warn('CV upload failed:', upErr.message);
      }
    } catch (err: any) {
      console.warn('CV upload threw:', err?.message);
    }

    // 2) جهّز Payload “مسموح فقط”
    const payload: any = {
      job_id: Number(jobId),
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      summary: summary.trim() || null,
      skills_text: summary.trim() || null,
      cv_url: cv_path
    };

    // احذف أي مفاتيح قيمتها undefined (حتى لا ترسل source أو مفاتيح غريبة)
    Object.keys(payload).forEach((k) => {
      if (payload[k] === undefined) delete payload[k];
    });

    // 3) أدخل الصف
    try {
      const { error } = await supabase.from('applications').insert(payload);
      if (error) throw error;
      alert('تم إرسال طلبك بنجاح');
      setFullName(''); setEmail(''); setPhone(''); setSummary(''); setFile(null);
    } catch (err: any) {
      console.error(err);
      alert('حدث خطأ أثناء الإرسال: ' + (err?.message || ''));
    } finally {
      setSending(false);
    }
  };

  return (
    <main style={{ maxWidth: 720, margin: '0 auto' }}>
      <h2>التقديم على الوظيفة #{jobId}</h2>
      <form onSubmit={onSubmit} style={{ display:'grid', gap:12 }}>
        <input required placeholder="الاسم الكامل" value={fullName} onChange={e=>setFullName(e.target.value)} />
        <input required type="email" placeholder="البريد الإلكتروني" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="رقم الجوال" value={phone} onChange={e=>setPhone(e.target.value)} />
        <textarea rows={4} placeholder="مهاراتك / ملخص الخبرات" value={summary} onChange={e=>setSummary(e.target.value)} />
        <div>
          <input type="file" accept="application/pdf" onChange={e=>setFile(e.target.files?.[0] || null)} />
          <small>رفع السيرة الذاتية (اختياري)</small>
        </div>
        <button disabled={sending} style={{ padding: '10px 14px' }}>
          {sending ? 'جارٍ الإرسال…' : 'إرسال'}
        </button>
      </form>
    </main>
  );
}
