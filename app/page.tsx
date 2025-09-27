import { supabase } from "@/lib/supabaseClient";

export default async function Home() {
  const { data: jobs } = await supabase
    .from("jobs")
    .select("id,title,location,type,description,requirements")
    .order("id", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="title">الوظائف المتاحة</h1>
      {!jobs?.length && <p className="text-gray-700">لا توجد وظائف بعد.</p>}
      <div className="grid" style={{gap:'1rem'}}>
        {jobs?.map((j:any)=>(
          <div key={j.id} className="card">
            <h3 className="subtitle">{j.title}</h3>
            <p className="text-gray-700">الموقع: {j.location} — النوع: {j.type}</p>
            <div style={{height:8}}/>
            <a href={`/jobs/${j.id}`}>عرض التفاصيل والتقديم</a>
          </div>
        ))}
      </div>
    </div>
  );
}
