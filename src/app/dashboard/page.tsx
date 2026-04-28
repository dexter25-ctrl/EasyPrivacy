"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function Dashboard() {
  const { user } = useUser();
  const [lastAudit, setLastAudit] = useState<{
    score: number;
    date: string;
    url: string;
    criticalPoints: string[];
  } | null>(null);

  // States pour le formulaire de contact
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  useEffect(() => {
    const savedAudit = localStorage.getItem("lastAudit");
    if (savedAudit) {
      setLastAudit(JSON.parse(savedAudit));
    }
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:dextoolstudio@gmail.com?subject=${encodeURIComponent(contactSubject)}&body=${encodeURIComponent(contactMessage)}`;
    window.location.href = mailtoUrl;
  };

  // Données par défaut si aucun audit n'a été fait
  const displayAudit = lastAudit || {
    score: 0,
    date: "Aucun audit récent",
    url: "Scannez votre premier site",
    criticalPoints: [
      "Effectuez un audit sur la page d'accueil pour voir les résultats ici.",
      "Le score de conformité s'affichera dynamiquement.",
      "Vous recevrez des conseils personnalisés après analyse."
    ],
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-24 relative overflow-hidden bg-slate-950">
      {/* Decorative background blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-6xl z-10 space-y-12">
        {/* Header Dashboard */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Bienvenue dans votre espace, {user?.firstName || "Chargement..."}
            </h1>
            <p className="text-white/40 text-sm mt-1">Gérez la conformité de vos projets en temps réel.</p>
          </div>
          <Link 
            href="/"
            className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 text-slate-900 font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Lancer un nouvel audit
          </Link>
        </div>

        {/* Stats Grid - 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Score Global */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center space-y-4 text-center">
            <h3 className="text-white/60 font-bold uppercase tracking-widest text-[10px]">Score Global</h3>
            <div className="relative flex items-center justify-center w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" className="stroke-white/5" strokeWidth="8" fill="none" />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  className={`${displayAudit.score > 70 ? 'stroke-teal-400' : displayAudit.score > 40 ? 'stroke-yellow-400' : 'stroke-red-400'} transition-all duration-1000`}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="351.8"
                  strokeDashoffset={351.8 - (351.8 * displayAudit.score) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black">{displayAudit.score}</span>
                <span className="text-[10px] text-white/40 uppercase">/100</span>
              </div>
            </div>
          </div>

          {/* Card 2: Cookies Détectés */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center space-y-4 text-center">
            <h3 className="text-white/60 font-bold uppercase tracking-widest text-[10px]">Cookies Détectés</h3>
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
              {displayAudit.score > 0 ? Math.floor(displayAudit.score / 4) : 0}
            </div>
            <p className="text-white/40 text-xs">Traceurs actifs sur le site</p>
          </div>

          {/* Card 3: Conformité RGPD */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center space-y-4 text-center">
            <h3 className="text-white/60 font-bold uppercase tracking-widest text-[10px]">Conformité RGPD</h3>
            <div className="text-5xl font-black text-white">
              {displayAudit.score}%
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-teal-500 transition-all duration-1000" 
                style={{ width: `${displayAudit.score}%` }}
              />
            </div>
          </div>
        </div>

        {/* Section Audit Récent & Tableau */}
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-white tracking-tight">Historique des Audits</h2>
            <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs text-white/40 font-medium">
              Dernière mise à jour : {new Date().toLocaleTimeString()}
            </div>
          </div>

          {/* Tableau des Audits */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-8 py-5 text-xs font-bold text-white/40 uppercase tracking-widest">Domaine</th>
                  <th className="px-8 py-5 text-xs font-bold text-white/40 uppercase tracking-widest">Date du Scan</th>
                  <th className="px-8 py-5 text-xs font-bold text-white/40 uppercase tracking-widest text-center">Score</th>
                  <th className="px-8 py-5 text-xs font-bold text-white/40 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {lastAudit ? (
                  <tr className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-500/10 rounded-xl flex items-center justify-center text-teal-400">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                        </div>
                        <span className="text-white font-bold">{displayAudit.url}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-white/60 text-sm">{displayAudit.date}</td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-black ${displayAudit.score > 70 ? 'bg-teal-500/20 text-teal-400' : 'bg-red-500/20 text-red-400'}`}>
                        {displayAudit.score}/100
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="text-white bg-white/10 hover:bg-white/20 px-6 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-widest">
                        Voir le rapport
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-white/20 italic">
                      Aucun audit disponible pour le moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section Bas de page (Upgrade & Support) */}
        <div className="grid md:grid-cols-2 gap-8 pt-8">
          {/* Upgrade Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-8 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4">Améliorez votre couverture</h2>
              <p className="text-white/40 text-sm leading-relaxed mb-6">
                Passez au plan Pro ou Entreprise pour bénéficier d'une surveillance continue et de correctifs automatiques par nos experts.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-center space-y-2">
                  <span className="text-teal-400 font-black block">Plan Pro</span>
                  <span className="text-white/40 text-[10px] uppercase">29€/mois</span>
                </div>
                <div className="p-4 bg-teal-500/10 rounded-2xl border border-teal-500/20 text-center space-y-2">
                  <span className="text-white font-black block">Entreprise</span>
                  <span className="text-white/40 text-[10px] uppercase">79€/mois</span>
                </div>
              </div>
            </div>
            <button className="w-full py-4 bg-white text-slate-900 font-black rounded-2xl hover:scale-[1.02] transition-all shadow-xl">
              VOIR LES OFFRES DE MISE À NIVEAU
            </button>
          </div>

          {/* Support Section */}
          <div className="bg-gradient-to-br from-teal-900/40 to-blue-900/20 border border-teal-500/10 rounded-3xl p-8 flex flex-col justify-center space-y-6 text-center">
            <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Support Prioritaire</h3>
              <p className="text-white/40 text-sm">Une question urgente ? <br/>Nos experts vous répondent en moins de 6h.</p>
            </div>
            <Link 
              href="mailto:dextoolstudio@gmail.com?subject=Demande de RDV EasyPrivacy"
              className="bg-teal-500 text-slate-900 font-black px-8 py-3 rounded-xl hover:scale-105 transition-all shadow-xl"
            >
              CONTACTER NOTRE ÉQUIPE
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
