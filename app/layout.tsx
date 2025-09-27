import "./globals.css";
import { theme } from "@/lib/theme";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TalentFlow",
  description: "بوابة التوظيف",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{
        background: theme.surface.bg,
        color: theme.text.main,
        fontFamily: "system-ui, -apple-system, Segoe UI, Tahoma, Arial",
        fontSize: "18px",            // +5 درجات تقريبًا
        lineHeight: 1.6,
        margin: 0,
      }}>
        <div style={{maxWidth: 1100, margin: "0 auto", padding: "32px 20px"}}>
          {children}
        </div>
      </body>
    </html>
  );
}
