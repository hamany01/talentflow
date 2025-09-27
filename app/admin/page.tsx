"use client";
import Link from "next/link";

export default function AdminHome() {
  return (
    <main>
      <h1 style={{fontSize: 36, marginBottom: 24}}>لوحة الإدارة</h1>
      <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20}}>
        {["طلبات التقديم","المتقدمون","الوظائف"].map((t,i)=>(
          <div key={i} style={{background:"#fff", border:"1px solid #e5e7eb", borderRadius:16, padding:24, textAlign:"center", boxShadow:"0 2px 8px rgba(15,23,42,0.06)"}}>
            <div style={{fontSize:22, fontWeight:700}}>{t}</div>
            <div style={{fontSize:40, color:"#1e40af"}}>—</div>
          </div>
        ))}
      </div>
      <div style={{marginTop:24}}>
        <Link href="/admin/jobs" style={{marginInlineStart:12, color:"#e11d48", fontWeight:700}}>إدارة الوظائف</Link>
        <span> | </span>
        <Link href="/admin/reports" style={{color:"#1e40af", fontWeight:700}}>التقارير</Link>
      </div>
    </main>
  );
}
