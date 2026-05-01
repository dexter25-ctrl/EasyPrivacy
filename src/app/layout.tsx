import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Script from 'next/script';

export const dynamic = 'force-dynamic';

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
          <Analytics />
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "wk9v00jtcx");
  `}
          </Script>

        </body>
      </html>
    </ClerkProvider>
  );
}
