import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export const revalidate = 0;

export default async function JobsList() {
  const { data: jobs, error } = await supabase.from("jobs").select("*").order("id", { ascending: false });
  if (error) {
    return <p style={{color:"#b91c1c"}}>خطأ: {error.message}</p>;
  }
  return (
    <main>
      <h1 style={{fontSize: 36, marginBottom: 24}}>الوظائف</h1>
      <Link href="/admin/jobs/new" style={{color:"#e11d48", fontWeight:700}}>إضافة وظيفة</Link>
      <div style={{display:"grid", gap:16, marginTop:20}}>
        {(jobs ?? []).map(j => (
          <div key={j.id} style={{background:"#fff", border:"1px solid #e5e7eb", borderRadius:16, padding:20, boxShadow:"0 2px 8px rgba(15,23,42,0.06)"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", gap:12}}>
              <div>
                <div style={{fontSize:22, fontWeight:700}}>{j.title}</div>
                <div style={{opacity:.8}}>الموقع: {j.location} — النوع: {j.type}</div>
              </div>
              <Link href={`/admin/jobs/${j.id}`} style={{color:"#1e40af", fontWeight:700}}>تفاصيل المرشحين</Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
