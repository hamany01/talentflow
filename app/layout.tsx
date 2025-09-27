import { BRAND } from '@/lib/theme';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{
        backgroundColor: BRAND.colors.background,
        color: BRAND.colors.text,
        margin: 0
      }}>
        {children}
      </body>
    </html>
  );
}
