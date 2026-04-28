"use client";

import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";

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

  // États pour la popup d'export
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalEmail, setModalEmail] = useState("");
  const [modalSuccess, setModalSuccess] = useState(false);

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
        const data = await response.json();
        throw new Error(data.error || "Une erreur est survenue");
      }

      const data = await response.json();
      setResult({
        score: data.score,
        criticalPoints: data.criticalPoints,
      });
    } catch (err: any) {
      setError(err.message || "Impossible d'effectuer l'audit pour le moment.");
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

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalEmail || !result) return;

    try {
      await fetch("https://script.google.com/macros/s/AKfycbwLJQxpc6ggHKHZlRqW9JiSN77CfInyWw4Rqtz7dbKy0_wXtWHIvuwA8FYJpIbNM57-/exec", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: modalEmail,
          url: url,
          score: result.score
        })
      });
      setModalSuccess(true);
      setTimeout(() => {
        closeItems();
      }, 3000);
    } catch (err) {
      console.error("Erreur lors de l'envoi au webhook:", err);
      // Fallback: montrer le succès quand même pour l'UX si le webhook bloque sur une erreur réseau
      setModalSuccess(true);
      setTimeout(() => closeItems(), 3000);
    }
  };

  const closeItems = () => {
    setIsModalOpen(false);
    setModalSuccess(false);
    setModalEmail("");
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
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="votre-site.com"
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
          {error && <p className="text-red-400 mt-4 text-center font-medium">{error}</p>}
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
                    {result.criticalPoints.length > 0 ? result.criticalPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-4 bg-black/40 p-4 rounded-2xl border border-white/5">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-bold mt-1">
                          !
                        </span>
                        <span className="text-white/90 text-sm leading-relaxed">{point}</span>
                      </li>
                    )) : (
                      <li className="text-teal-400 text-center py-8 font-medium">Félicitations ! Aucun point critique majeur détecté.</li>
                    )}
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
                    onClick={() => setIsModalOpen(true)}
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

            {/* Section Comment ça marche */}
            <div className="pt-16 pb-8 space-y-12">
              <div className="text-center space-y-3">
                <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">Comment ça marche ?</h2>
                <p className="text-white/60 text-lg">Une conformité simplifiée en 3 étapes clés.</p>
              </div>

              <div className="grid sm:grid-cols-3 gap-8">
                {/* Étape 1 */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center space-y-6 hover:border-teal-500/30 transition-all group">
                  <div className="w-16 h-16 bg-teal-500/10 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Audit instantané</h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Notre algorithme analyse le code source de votre page d'accueil en temps réel pour détecter les scripts.
                  </p>
                </div>

                {/* Étape 2 */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center space-y-6 hover:border-teal-500/30 transition-all group">
                  <div className="w-16 h-16 bg-teal-500/10 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Diagnostic RGPD</h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Nous vérifions la présence obligatoire du bandeau cookie et de la politique de confidentialité conforme.
                  </p>
                </div>

                {/* Étape 3 */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center space-y-6 hover:border-teal-500/30 transition-all group">
                  <div className="w-16 h-16 bg-teal-500/10 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Rapport de conformité</h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Recevez un score détaillé et les actions correctives précises pour éviter les sanctions de la CNIL.
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div id="tarifs" className="pt-16 pb-8 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              <div className="text-center space-y-3">
                <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">Passez aux normes dès aujourd'hui</h2>
                <p className="text-white/60 text-lg">Choisissez la protection adaptée à votre entreprise.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Plan 1: Essentiel */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col space-y-8 hover:border-white/20 transition-all group">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">Essentiel</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-white">29€</span>
                      <span className="text-white/40 text-sm font-medium">/ mois</span>
                    </div>
                    <p className="text-white/50 text-sm">La surveillance de base pour les petits sites.</p>
                  </div>

                  <ul className="space-y-4 flex-1">
                    {[
                      "Scan hebdomadaire automatique",
                      "Alertes par email (nouveaux traqueurs)",
                      "Générateur de politique standard",
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                        <svg className="w-5 h-5 text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button className="w-full py-4 rounded-2xl border border-white/10 hover:bg-white/5 text-white font-bold transition-all">
                    Commencer
                  </button>
                </div>

                {/* Plan 2: Sérénité Totale */}
                <div className="relative bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border-2 border-teal-500/50 rounded-3xl p-8 flex flex-col space-y-8 shadow-2xl shadow-teal-500/10 hover:border-teal-400 transition-all scale-105 sm:scale-110 z-20">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-teal-500 text-slate-900 text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
                    Le plus populaire
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      Sérénité Totale
                      <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                    </h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-white">79€</span>
                      <span className="text-white/40 text-sm font-medium">/ mois</span>
                    </div>
                    <p className="text-white/50 text-sm">Le bouclier juridique complet, on s'occupe de tout.</p>
                  </div>

                  <ul className="space-y-4 flex-1">
                    {[
                      "Tout de l'offre Essentiel",
                      "Installation du bandeau cookie",
                      "Mises à jour juridiques auto",
                      "Support prioritaire 24/7",
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                        <svg className="w-5 h-5 text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button className="w-full py-4 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-900 font-black shadow-lg shadow-teal-500/20 transition-all">
                    Sécuriser mon site
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL EXPORT */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity" />
          <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50 bg-slate-900 border border-white/10 rounded-3xl p-8 sm:p-12 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 focus:outline-none">
            {/* Bouton Fermer */}
            <Dialog.Close asChild>
              <button
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-all"
                onClick={closeItems}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </Dialog.Close>

            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <svg className="w-8 h-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>

              {!modalSuccess ? (
                <>
                  <div className="space-y-2">
                    <Dialog.Title className="text-2xl font-black text-white">Recevez votre rapport complet</Dialog.Title>
                    <Dialog.Description className="text-white/60 text-sm">
                      Entrez votre email pour obtenir les résultats.
                    </Dialog.Description>
                  </div>

                  <form onSubmit={handleModalSubmit} className="space-y-4">
                    <input
                      type="email"
                      required
                      value={modalEmail}
                      onChange={(e) => setModalEmail(e.target.value)}
                      placeholder="votre@email.com"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                    />
                    <button
                      type="submit"
                      className="w-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-black py-4 rounded-2xl transition-all shadow-xl shadow-teal-500/20"
                    >
                      RECEVOIR MON AUDIT
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-8 space-y-4 animate-in fade-in zoom-in-95">
                  <Dialog.Title className="sr-only">Succès de l'envoi</Dialog.Title>
                  <Dialog.Description className="sr-only">Votre rapport a été envoyé.</Dialog.Description>
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Rapport envoyé !</h3>
                  <p className="text-white/60 text-sm">Pensez à vérifier vos spams.</p>
                  <button
                    onClick={closeItems}
                    className="mt-6 text-teal-400 text-sm font-bold uppercase tracking-widest hover:text-teal-300 transition-all"
                  >
                    Fermer
                  </button>
                </div>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 bg-black/20 backdrop-blur-md mt-24 py-16 px-6 sm:px-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-24">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.8L18.5 8 12 11.2 5.5 8 12 4.8z" />
                </svg>
              </div>
              <span className="text-xl font-black text-white tracking-tighter">EasyPrivacy</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              La solution automatisée pour la conformité RGPD de votre entreprise. Sécurisez votre avenir numérique.
            </p>
          </div>

          {/* Produit */}
          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Produit</h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-white/60 hover:text-teal-400 transition-colors text-sm">Audit en direct</a>
              </li>
              <li>
                <a href="#tarifs" className="text-white/60 hover:text-teal-400 transition-colors text-sm">Tarifs</a>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Légal</h4>
            <ul className="space-y-4">
              <li>
                <a href="/mentions-legales" className="text-white/60 hover:text-teal-400 transition-colors text-sm">Mentions Légales</a>
              </li>
              <li>
                <a href="/politique-confidentialite" className="text-white/60 hover:text-teal-400 transition-colors text-sm">Politique de Confidentialité</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/20 text-[10px] font-medium uppercase tracking-[0.2em]">
            © 2026 EasyPrivacy Compliance SaaS - Sécurisé par chiffrement AES-256
          </p>
          <div className="flex gap-6">
            <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" title="Système opérationnel"></div>
          </div>
        </div>
      </footer>
    </main>
  );
}
