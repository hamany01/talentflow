import { supabase } from "@/lib/supabaseClient";

export default async function Reports() {
  const { data: jobs } = await supabase.from("jobs").select("id");
  const { data: apps } = await supabase.from("applications").select("id, status, ai_score").order("ai_score", { ascending: false }).limit(10);

  const counts = {
    jobs: jobs?.length ?? 0,
    apps: apps?.length ?? 0,
    newApps: (apps ?? []).filter(a=>a.status === "new").length,
    shortlisted: (apps ?? []).filter(a=>a.status === "shortlist").length,
    rejected: (apps ?? []).filter(a=>a.status === "rejected").length,
  };

  return (
    <main>
      <h1 style={{fontSize:36, marginBottom:24}}>التقارير</h1>
      <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16}}>
        {Object.entries({
          "الوظائف": counts.jobs,
          "طلبات التقديم": counts.apps,
          "جديدة": counts.newApps,
          "مختارة": counts.shortlisted,
        }).map(([k,v]) => (
          <div key={k} style={{background:"#fff", border:"1px solid #e5e7eb", borderRadius:16, padding:16, textAlign:"center"}}>
            <div style={{fontSize:18, opacity:.8}}>{k}</div>
            <div style={{fontSize:36, color:"#1e40af", fontWeight:800}}>{v}</div>
          </div>
        ))}
      </div>

      <h2 style={{fontSize:24, marginTop:32}}>أفضل 10 سير ذاتية (حسب AI)</h2>
      {(apps ?? []).length === 0 ? <div>لا توجد بيانات بعد.</div> : (
        <ol>
          {(apps ?? []).map(a => (
            <li key={a.id} style={{marginTop:8}}>
              #{a.id} — درجة الملاءمة: <b>{a.ai_score ?? 0}%</b>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
