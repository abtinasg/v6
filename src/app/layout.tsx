import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Sidebar } from "@/components/sidebar/sidebar";
import { AuthModal } from "@/components/auth/auth-modal";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AI Studio | هوش مصنوعی پیشرفته",
  description: "پلتفرم هوش مصنوعی پیشرفته با قابلیت‌های تحلیل، ایده‌پردازی، مناظره و حل مسئله",
  keywords: ["هوش مصنوعی", "AI", "چت بات", "GPT", "Claude", "Gemini"],
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <Sidebar />
        <AuthModal />
        {children}
      </body>
    </html>
  );
}
