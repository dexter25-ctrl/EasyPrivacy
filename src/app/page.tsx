"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    criticalPoints: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-24 relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-3xl z-10 space-y-8">
        {/* Main Panel */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10 text-center space-y-8">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-white">
              ASSUREZ VOTRE CONFORMITÉ RGPD EN UN CLIC
            </h1>
            <p className="text-white/70 text-lg">
              Saisissez l'URL de votre site pour obtenir un audit instantané et gratuit.
            </p>

            <form onSubmit={handleAudit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://votre-site.com"
                required
                className="flex-1 bg-black/20 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold px-8 py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[200px]"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  "DÉMARRER L'AUDIT"
                )}
              </button>
            </form>
            {error && <p className="text-red-400 mt-4">{error}</p>}
          </div>
        </div>

        {/* Dashboard / Results Panel */}
        {result && (
          <div className="grid sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
            {/* Score Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 flex flex-col items-center justify-center space-y-4">
              <h2 className="text-xl text-white/80 font-medium">Score de Conformité</h2>
              <div className="relative flex items-center justify-center w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" className="stroke-white/10" strokeWidth="12" fill="none" />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    className={`${result.score > 70 ? 'stroke-teal-400' : result.score > 40 ? 'stroke-yellow-400' : 'stroke-red-400'} transition-all duration-1000 ease-out`}
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray="439.8"
                    strokeDashoffset={439.8 - (439.8 * result.score) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex items-baseline gap-1">
                  <span className="text-5xl font-bold">{result.score}</span>
                  <span className="text-xl text-white/60">/100</span>
                </div>
              </div>
            </div>

            {/* Critical Points Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 space-y-6">
              <h2 className="text-xl text-white/80 font-medium flex items-center gap-2">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Points critiques détectés
              </h2>
              <ul className="space-y-4">
                {result.criticalPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3 bg-black/20 p-4 rounded-xl border border-white/5">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-sm mt-0.5">
                      !
                    </span>
                    <span className="text-white/90">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
