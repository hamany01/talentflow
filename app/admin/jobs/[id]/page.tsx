import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

type Props = { params: { id: string } };

export default async function JobApplicants({ params }: Props) {
  const jobId = Number(params.id);
  if (Number.isNaN(jobId)) {
    return <p style={{color:"#b91c1c"}}>معرّف غير صحيح.</p>;
  }

  const [{ data: job }, { data: apps }] = await Promise.all([
    supabase.from("jobs").select("*").eq("id", jobId).single(),
    supabase.from("applications").select("*").eq("job_id", jobId).order("id", { ascending: false }),
  ]);

  return (
    <main>
      <h1 style={{fontSize:36, marginBottom:24}}>مرشحو الوظيفة #{jobId} — {job?.title ?? ""}</h1>
      <div style={{display:"grid", gap:12}}>
        {(apps ?? []).length === 0 && <div>لا يوجد مرشحون بعد.</div>}
        {(apps ?? []).map(a => (
          <div key={a.id} style={{background:"#fff", border:"1px solid #e5e7eb", borderRadius:16, padding:16}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <div>
                <div style={{fontWeight:700}}>{a.full_name}</div>
                <div style={{opacity:.8, fontSize:14}}>{a.email} · {a.phone}</div>
              </div>
              {a.cv_url && <a href={a.cv_url} target="_blank" rel="noreferrer" style={{color:"#1e40af"}}>عرض السيرة</a>}
            </div>
            {a.ai_score != null && (
              <div style={{marginTop:8, fontSize:14}}>ملاءمة AI: <b>{a.ai_score}%</b></div>
            )}
            {a.status && <div style={{marginTop:6, fontSize:14}}>المرحلة: {a.status}</div>}
            {a.ai_notes && <div style={{marginTop:6, fontSize:14, opacity:.9}}>ملاحظات: {a.ai_notes}</div>}
          </div>
        ))}
      </div>
      <div style={{marginTop:16}}>
        <Link href="/admin/jobs" style={{color:"#1e40af"}}>رجوع للوظائف</Link>
      </div>
    </main>
  );
}
