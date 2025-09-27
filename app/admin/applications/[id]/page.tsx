
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { BRAND } from '@/lib/theme';

export default function ApplicationDetails() {
  const params = useParams();
  const appId = Number(params?.id);
  const [app, setApp] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [note, setNote] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('applications').select('*, applicants(*), jobs(title)').eq('id', appId).single();
      setApp(data);
      const { data: n } = await supabase.from('notes').select('*').eq('application_id', appId).order('id', { ascending: false });
      setNotes(n||[]);
    })();
  }, [appId]);

  const addNote = async () => {
    const { data: user } = await supabase.auth.getUser();
    const uid = user?.user?.id || null;
    const { data, error } = await supabase.from('notes').insert({ application_id: appId, author_id: uid, body: note, visibility: 'internal' }).select().single();
    if (!error && data) setNotes([data, ...notes]);
    setNote('');
  };

  if (!app) return <p>جارِ التحميل...</p>;

  return (
    <main>
      <h2 style={{ color:BRAND.colors.secondary }}>طلب #{app.id} — {app.jobs?.title}</h2>
      <p><b>المرشح:</b> {app.applicants?.full_name} — <a style={{ color:BRAND.colors.accent }} href={app.applicants?.cv_file_url || '#'} target="_blank">السيرة</a></p>
      <p><b>المرحلة:</b> {app.stage} | <b>درجة AI:</b> {app.ai_score ?? '-'}</p>

      <h3>ملاحظات داخلية</h3>
      <div style={{ display:'grid', gap:8, maxWidth:700 }}>
        <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="أضف ملاحظة داخلية" rows={3} />
        <button onClick={addNote} style={{ background:BRAND.colors.primary, color:'#fff', padding:'6px 12px', border:'none', borderRadius:8 }}>حفظ</button>
      </div>
      <ul>
        {notes.map(n => (<li key={n.id}>{n.body}</li>))}
      </ul>
    </main>
  );
}
