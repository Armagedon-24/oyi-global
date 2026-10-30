import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "OYİ GLOBAL — Olay Yeri İnceleme Teknikleri Küresel İzleme Dergisi",
  description:
    "Dünyanın 14 dilinde olay yeri inceleme teknikleri ve adli bilimler gelişmelerini tarayan, yapay zekâ ile Türkçeye çeviren dijital e-dergi.",
  keywords: [
    "olay yeri inceleme",
    "adli bilimler",
    "kriminalistik",
    "forensic science",
    "crime scene investigation",
    "OYİ GLOBAL",
    "Türkçe",
  ],
  authors: [{ name: "OYİ GLOBAL" }],
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
