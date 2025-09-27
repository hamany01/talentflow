'use client';

import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import { v4 as uuid } from "uuid";

export default function ApplyPage({ params }: { params: { jobId: string }}) {
  const jobId = Number(params.jobId);
  const [full_name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [summary, setSummary] = useState('');
  const [file, setFile] = useState<File|null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try{
      let cv_url: string | null = null;
      if (file) {
        const ext = file.name.split('.').pop();
        const path = `uploads/${uuid()}.${ext}`;
        const { error: upErr } = await supabase.storage.from('cv').upload(path, file, { upsert: false });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from('cv').getPublicUrl(path);
        cv_url = data.publicUrl;
      }

      const { error } = await supabase.from('applications').insert({
        job_id: jobId, full_name, email, phone, summary, cv_url, status: 'new'
      });

      if (error) throw error;
      alert('تم ارسال طلبك بنجاح');
      setName(''); setEmail(''); setPhone(''); setSummary(''); setFile(null);
    }catch(e:any){
      console.error(e);
      alert('حدث خطأ أثناء الإرسال');
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h1 className="title">التقديم على الوظيفة #{jobId}</h1>
      <div className="grid" style={{gap:'1rem'}}>
        <div>
          <label>الاسم الكامل</label>
          <input value={full_name} onChange={e=>setName(e.target.value)} placeholder="اسمك" />
        </div>
        <div>
          <label>البريد الإلكتروني</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div>
          <label>رقم الجوال</label>
          <input value={phone} onChange={e=>setPhone(e.target.value)} />
        </div>
        <div>
          <label>مهاراتك / ملخص الخبرات</label>
          <textarea rows={4} value={summary} onChange={e=>setSummary(e.target.value)} />
        </div>
        <div>
          <label>رفع السيرة الذاتية (اختياري)</label>
          <input type="file" onChange={e=>setFile(e.target.files?.[0] || null)} />
        </div>
        <div>
          <button onClick={submit} disabled={loading}>{loading? '...جاري' : 'إرسال'}</button>
        </div>
      </div>
    </div>
  );
}
