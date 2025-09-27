
import Image from 'next/image';
import { BRAND } from '@/lib/theme';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ fontFamily: 'system-ui', background: BRAND.colors.bg, color: BRAND.colors.text }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
          <header style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 24 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <Image src="/logo.png" alt="Logo" width={64} height={28} />
              <div>
                <h1 style={{ margin:0, color: BRAND.colors.primary }}>TalentFlow</h1>
                <div style={{ fontSize:12, opacity:.9 }}>{BRAND.companyAr}</div>
              </div>
            </div>
            <nav style={{ display:'flex', gap: 12 }}>
              <a href="/" style={{ color: BRAND.colors.accent }}>الوظائف</a>
              <a href="/admin" style={{ color: BRAND.colors.accent }}>الإدارة</a>
            </nav>
          </header>
          <div style={{ borderTop:`2px solid ${BRAND.colors.secondary}`, marginBottom:16 }} />
          {children}
        </div>
      </body>
    </html>
  );
}
