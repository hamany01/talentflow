import { supabase } from "@/lib/supabaseClient";

export default async function JobPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const { data: job } = await supabase.from("jobs")
    .select("*").eq("id", id).single();

  if (!job) {
    return <div className="card"><h1 className="title">الوظيفة غير موجودة</h1></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="title">{job.title}</h1>
      <div className="card">
        <p>الموقع: {job.location} — النوع: {job.type}</p>
        <h3 className="subtitle">الوصف</h3>
        <p className="text-gray-700">{job.description}</p>
        <h3 className="subtitle">المتطلبات</h3>
        <p className="text-gray-700">{job.requirements}</p>
        <div style={{height:12}}/>
        <a className="badge" href={`/apply/${job.id}`}>التقديم على هذه الوظيفة</a>
      </div>
    </div>
  );
}
