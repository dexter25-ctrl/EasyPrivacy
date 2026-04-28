"use client";

import Link from "next/link";

export default function MentionsLegales() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-24 relative overflow-hidden bg-slate-950 text-white">
      {/* Decorative background blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl z-10 space-y-12">
        {/* Header */}
        <div className="space-y-6">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors font-bold uppercase tracking-widest text-xs"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à l'accueil
          </Link>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-white to-blue-200 leading-tight">
            MENTIONS LÉGALES
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"></div>
        </div>

        {/* Content */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8 text-white/70 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">1. PRÉSENTATION DU SITE</h2>
            <p>
              En vertu de l'article 6 de la loi n° 2004-575 du 21 juin 2004, il est précisé aux utilisateurs du site EasyPrivacy l'identité des différents intervenants dans le cadre de sa réalisation :<br />
              <strong>Propriétaire / Éditeur :</strong> [TON PRÉNOM ET NOM]<br />
              <strong>Statut :</strong> Auto-entrepreneur (en cours de formation)<br />
              <strong>Contact :</strong> [TON EMAIL]
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">2. HÉBERGEMENT</h2>
            <p>
              Le site est hébergé par Vercel Inc., situé au 340 S Lemon Ave #1142, Walnut, CA 91789, USA.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">3. PROPRIÉTÉ INTELLECTUELLE</h2>
            <p>
              L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">4. LIMITATION DE RESPONSABILITÉ</h2>
            <p>
              EasyPrivacy fournit un score de conformité à titre indicatif basé sur une analyse automatisée. Cet audit ne remplace en aucun cas l'avis d'un avocat spécialisé ou d'un expert juridique agréé.
            </p>
          </section>
        </div>
      </div>

      {/* Footer minimal */}
      <footer className="mt-24 pb-12 text-white/20 text-[10px] font-medium uppercase tracking-[0.2em] z-10 text-center">
        © 2026 EasyPrivacy Compliance SaaS - Tous droits réservés
      </footer>
    </main>
  );
}
