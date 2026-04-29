import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Conformité RGPD automatique | EasyPrivacy",
  description: "Sécurisez votre site avec notre solution de conformité RGPD automatique. Évitez les amendes de la CNIL grâce à un audit en temps réel.",
};

import Navbar from "@/components/Navbar";
import CookieBanner from "@/components/CookieBanner";
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-br from-[#0f172a] via-[#113247] to-[#042f2e] text-white selection:bg-teal-500/30 pt-20`}
      >
        <Navbar />
        {children}
        <CookieBanner />
      </body>
    </html>
    </ClerkProvider>
  );
}
