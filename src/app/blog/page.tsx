import Link from "next/link";

export const metadata = {
  title: "Blog | Conformité RGPD automatique",
  description: "Découvrez nos derniers articles et actualités sur la conformité RGPD automatique et la protection des données.",
};

export default function BlogPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-24 relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl z-10 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-block px-4 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium mb-4">
            Blog EasyPrivacy
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-white to-blue-200 leading-tight">
            ACTUALITÉS & CONSEILS <br className="hidden sm:block" /> RGPD
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Retrouvez tous nos articles pour comprendre et appliquer la conformité RGPD de manière automatique sur votre site.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-16 text-center space-y-6">
          <div className="w-20 h-20 bg-teal-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Le blog arrive très bientôt !</h2>
          <p className="text-white/60">
            Nous préparons actuellement nos premiers articles pour vous aider à y voir plus clair dans le monde du RGPD.
          </p>
          <div className="pt-8">
            <Link 
              href="/"
              className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-teal-500/20"
            >
              RETOURNER À L'ACCUEIL
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
