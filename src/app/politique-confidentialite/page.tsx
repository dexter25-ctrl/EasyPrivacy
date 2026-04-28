"use client";

import Link from "next/link";

export default function PolitiqueConfidentialite() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-24 relative overflow-hidden bg-slate-950 text-white">
      {/* Decorative background blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl z-10 space-y-12">
        {/* Header */}
        <div className="space-y-6">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-bold uppercase tracking-widest text-xs"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à l'accueil
          </Link>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-teal-200 leading-tight">
            POLITIQUE DE <br className="hidden sm:block" /> CONFIDENTIALITÉ
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"></div>
        </div>

        {/* Content */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8 text-white/70 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">1. Collecte des données</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">2. Utilisation des données</h2>
            <p>
              Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">3. Protection des données</h2>
            <p>
              Quisque congue tristique eros. In turpis. Integer aliquet adpiscing mi. Donec vulputate nunc. Vivamus ac sodales dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">4. Vos droits</h2>
            <p>
              Nulla facilisi. Séd sit amet felis ac purus elementum tristique. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ut sem. Donec nec erat. Curabitur elementum ultrices diam.
            </p>
          </section>
        </div>
      </div>

      {/* Footer minimal */}
      <footer className="mt-24 pb-12 text-white/20 text-[10px] font-medium uppercase tracking-[0.2em] z-10 text-center">
        © 2026 EasyPrivacy Compliance SaaS - Vos données sont en sécurité
      </footer>
    </main>
  );
}
