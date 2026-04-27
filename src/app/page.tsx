"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Initialisation de l'audit...");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    criticalPoints: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Simulation de messages de chargement réalistes
  useEffect(() => {
    if (loading) {
      const messages = [
        "Analyse de la structure du site...",
        "Vérification des traceurs tiers...",
        "Examen de la conformité des formulaires...",
        "Analyse finale en cours...",
      ];
      let i = 0;
      const interval = setInterval(() => {
        if (i < messages.length) {
          setLoadingMessage(messages[i]);
          i++;
        }
      }, 800);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    setIsUnlocked(false);

    try {
      // Forcer un délai de 3 secondes pour un effet "réaliste"
      const [response] = await Promise.all([
        fetch("/api/audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        }),
        new Promise((resolve) => setTimeout(resolve, 3200)),
      ]);

      if (!response.ok) {
        throw new Error("Une erreur est survenue");
      }

      const data = await response.json();
      setResult({
        score: data.score,
        criticalPoints: data.criticalPoints,
      });
    } catch (err) {
      setError("Impossible d'effectuer l'audit pour le moment.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsUnlocked(true);
    }
  };

  const handleExport = () => {
    if (!result) return;
    const text = `Audit EasyPrivacy - ${url}\nScore: ${result.score}/100\nPoints critiques:\n- ${result.criticalPoints.join("\n- ")}`;
    navigator.clipboard.writeText(text);
    alert("Audit copié dans le presse-papier !");
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-24 relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl z-10 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-block px-4 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium mb-4">
            Analyseur de Conformité RGPD v2.0
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-white to-blue-200 leading-tight">
            VOTRE SITE EST-IL <br className="hidden sm:block" /> EN RÈGLE ?
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Identifiez les failles juridiques de votre plateforme avant qu'il ne soit trop tard. Gratuit, instantané et précis.
          </p>
        </div>

        {/* Input Panel */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative group transition-all hover:border-teal-500/30">
          <form onSubmit={handleAudit} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://votre-site.com"
                required
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 text-slate-900 font-bold px-10 py-4 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
            >
              {loading ? "ANALYSE EN COURS..." : "LANCER L'AUDIT GRATUIT"}
            </button>
          </form>
          {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
        </div>

        {/* Loading State / Skeleton */}
        {loading && (
          <div className="space-y-8 animate-pulse">
            <div className="h-64 bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin"></div>
              <p className="text-teal-400 font-medium">{loadingMessage}</p>
            </div>
          </div>
        )}

        {/* Results Panel */}
        {result && !loading && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Score Card */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 flex flex-col items-center justify-center space-y-6">
                <h2 className="text-xl text-white/80 font-bold uppercase tracking-widest">Score de Conformité</h2>
                <div className="relative flex items-center justify-center w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="84" className="stroke-white/5" strokeWidth="16" fill="none" />
                    <circle
                      cx="96"
                      cy="96"
                      r="84"
                      className={`${result.score > 70 ? 'stroke-teal-400' : result.score > 40 ? 'stroke-yellow-400' : 'stroke-red-400'} transition-all duration-1000 ease-out`}
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray="527.7"
                      strokeDashoffset={527.7 - (527.7 * result.score) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-6xl font-black">{result.score}</span>
                    <span className="text-sm text-white/40 font-bold uppercase">Points</span>
                  </div>
                </div>
              </div>

              {/* Critical Points / Lock Overlay */}
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-hidden">
                <div className={`space-y-6 transition-all duration-500 ${!isUnlocked ? 'blur-md select-none pointer-events-none opacity-40' : ''}`}>
                  <h2 className="text-xl text-white/80 font-bold flex items-center gap-3">
                    <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Points critiques détectés
                  </h2>
                  <ul className="space-y-3">
                    {result.criticalPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-4 bg-black/40 p-4 rounded-2xl border border-white/5">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-bold mt-1">
                          !
                        </span>
                        <span className="text-white/90 text-sm leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Lead Magnet Overlay */}
                {!isUnlocked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-black/20 backdrop-blur-[2px]">
                    <div className="bg-slate-900/90 border border-teal-500/30 p-8 rounded-2xl shadow-2xl text-center space-y-6 max-w-sm">
                      <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg mb-2">Débloquer votre rapport</h3>
                        <p className="text-white/60 text-sm">Entrez votre email pour recevoir les détails de votre audit et les solutions correctives.</p>
                      </div>
                      <form onSubmit={handleUnlock} className="space-y-3">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="votre@email.com"
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                        />
                        <button type="submit" className="w-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-3 rounded-xl transition-all shadow-lg shadow-teal-500/20">
                          VOIR LES RÉSULTATS
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Export & CTA */}
            {isUnlocked && (
              <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                <div className="flex justify-center">
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Exporter mon rapport complet
                  </button>
                </div>

                {/* Final CTA */}
                <div className="bg-gradient-to-br from-teal-900/40 via-blue-900/20 to-transparent border border-teal-500/20 rounded-3xl p-10 text-center space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-teal-500/10 transition-all"></div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    NE LAISSEZ PAS VOTRE SITE DANS L'ILLÉGALITÉ
                  </h3>
                  <p className="text-teal-100/60 max-w-xl mx-auto">
                    Nos experts peuvent corriger tous ces points critiques en moins de 48h. Réservez une consultation gratuite pour faire le point.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button className="bg-white text-slate-900 font-black px-10 py-4 rounded-2xl hover:scale-105 transition-all shadow-xl">
                      RÉSERVER MON APPEL STRATÉGIQUE
                    </button>
                    <button className="text-white/60 hover:text-white transition-all text-sm font-bold uppercase tracking-widest">
                      Voir nos offres de mise en conformité
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="mt-auto pt-12 pb-6 text-white/20 text-xs font-medium uppercase tracking-[0.2em] z-10">
        © 2026 EasyPrivacy Compliance SaaS - Sécurisé par chiffrement AES-256
      </footer>
    </main>
  );
}
