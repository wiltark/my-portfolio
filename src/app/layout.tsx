import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "Karl — Développeur Full Stack", template: "%s | Karl" },
  description: "Portfolio de Karl — Développeur Full Stack, créateur de Veko.js et CosmoChat.",
  icons: { icon: "/78685616.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-[#0a0a0f] text-slate-200`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
