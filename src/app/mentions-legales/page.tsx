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
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">ÉDITEUR DU SITE</h2>
            <p>
              Le site EasyPrivacy est édité par <strong>Kaufmann Dejan</strong>, entrepreneur individuel, domicilié en France.<br />
              <strong>Email :</strong> <a href="mailto:dextoolstudio@gmail.com" className="text-teal-400 hover:underline">dextoolstudio@gmail.com</a>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">HÉBERGEMENT</h2>
            <p>
              Le site est hébergé par la société <strong>Vercel Inc.</strong>, située au 340 S Lemon Ave #1142, Walnut, CA 91789, USA. Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">https://vercel.com</a>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">PROPRIÉTÉ INTELLECTUELLE</h2>
            <p>
              <strong>Kaufmann Dejan</strong> est propriétaire des droits de propriété intellectuelle sur tous les éléments accessibles sur le site (textes, images, graphismes, logo, icônes). Toute reproduction ou adaptation est interdite sans autorisation écrite préalable.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">RESPONSABILITÉ</h2>
            <p>
              EasyPrivacy propose un outil d'analyse automatisé. Les résultats sont fournis à titre informatif et ne constituent pas un conseil juridique formel. <strong>Kaufmann Dejan</strong> ne pourra être tenu responsable des décisions prises sur la base de cet audit.
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
