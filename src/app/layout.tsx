import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Sidebar } from "@/components/sidebar/sidebar";
import { AuthModal } from "@/components/auth/auth-modal";

export const metadata: Metadata = {
  title: "HUNO | دستیار هوش مصنوعی",
  description: "دستیار هوش مصنوعی پیشرفته با قابلیت‌های تحلیل، ایده‌پردازی، مناظره و حل مسئله",
  keywords: ["هوش مصنوعی", "AI", "چت بات", "GPT", "Claude", "Gemini", "HUNO"],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="antialiased bg-background text-foreground">
        <Sidebar />
        <AuthModal />
        {children}
      </body>
    </html>
  );
}
