"use client";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewJob() {
  const [title, setTitle] = useState("");
  const [dept_id, setDeptId] = useState<number | "">("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("دوام كامل");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const payload = { title, dept_id: dept_id === "" ? null : Number(dept_id), location, type, description, requirements };
    const { data, error } = await supabase.from("jobs").insert(payload).select("*").single();
    if (error) { setMsg("خطأ: " + error.message); return; }
    setMsg("تم إنشاء الوظيفة بنجاح");
    router.push(`/admin/jobs/${data.id}`);
  };

  return (
    <main>
      <h1 style={{fontSize:36, marginBottom:24}}>إنشاء وظيفة</h1>
      <form onSubmit={submit} style={{display:"grid", gap:12, maxWidth:700}}>
        <input required placeholder="المسمى الوظيفي" value={title} onChange={e=>setTitle(e.target.value)} />
        <input placeholder="قسم (رقم اختياري)" inputMode="numeric" value={dept_id} onChange={e=>setDeptId(e.target.value===""? "": Number(e.target.value))} />
        <input placeholder="الموقع" value={location} onChange={e=>setLocation(e.target.value)} />
        <input placeholder="نوع الوظيفة" value={type} onChange={e=>setType(e.target.value)} />
        <textarea placeholder="الوصف" value={description} onChange={e=>setDescription(e.target.value)} rows={4} />
        <textarea placeholder="المتطلبات" value={requirements} onChange={e=>setRequirements(e.target.value)} rows={3} />
        <button type="submit" style={{background:"#e11d48", color:"#fff", border:"none", padding:"12px 18px", borderRadius:12, fontWeight:700}}>حفظ</button>
        {msg && <div>{msg}</div>}
      </form>
      <style jsx global>{`
        input, textarea {border:1px solid #e5e7eb; border-radius:12px; padding:10px 12px; font-size:16px}
        input:focus, textarea:focus {outline:2px solid #bfdbfe}
      `}</style>
    </main>
  );
}
