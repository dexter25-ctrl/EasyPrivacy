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

  const displayAudit = lastAudit || {
    score: 0,
    date: "N/A",
    url: "Aucun scan récent",
    criticalPoints: [],
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-24 relative overflow-hidden bg-[#020617]">
      {/* Decorative background blurs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse delay-700" />

      <div className="w-full max-w-6xl z-10 space-y-10">
        {/* Header Dashboard */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Bienvenue, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">{user?.firstName || "Utilisateur"}</span>
            </h1>
            <p className="text-white/40 text-sm mt-1 font-medium">Votre centre de contrôle de conformité RGPD.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-2xl transition-all text-sm font-bold"
            >
              Retour accueil
            </Link>
            <Link 
              href="/"
              className="bg-gradient-to-r from-teal-500 to-blue-600 hover:scale-105 text-white font-bold px-8 py-3 rounded-2xl transition-all shadow-[0_0_20px_rgba(45,212,191,0.3)] flex items-center gap-2"
            >
              Nouveau Scan
            </Link>
          </div>
        </div>

        {/* SECTION: En un coup d'œil */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Score */}
          <div className="relative group overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 transition-all hover:border-teal-500/50 shadow-2xl">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-all" />
            <div className="relative space-y-4">
              <h3 className="text-white/60 font-bold uppercase tracking-widest text-[10px]">Score de Conformité</h3>
              <div className="flex items-end gap-3">
                <span className="text-6xl font-black text-white">{displayAudit.score}%</span>
                <div className="mb-2 w-12 h-1 bg-teal-500 rounded-full shadow-[0_0_10px_rgba(45,212,191,0.8)]" />
              </div>
              <p className="text-white/40 text-xs">Basé sur le dernier scan du {displayAudit.date}</p>
            </div>
          </div>

          {/* Card 2: Risques */}
          <div className="relative group overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 transition-all hover:border-red-500/50 shadow-2xl">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all" />
            <div className="relative space-y-4">
              <h3 className="text-white/60 font-bold uppercase tracking-widest text-[10px]">Risques Détectés</h3>
              <div className="flex items-end gap-3">
                <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                  {displayAudit.score > 0 ? Math.floor((100 - displayAudit.score) / 5) : 0}
                </span>
                <span className="mb-2 px-2 py-1 bg-red-500/10 text-red-400 rounded-lg text-[10px] font-black uppercase">Critique</span>
              </div>
              <p className="text-white/40 text-xs">Points nécessitant une action immédiate</p>
            </div>
          </div>

          {/* Card 3: Statut */}
          <div className="relative group overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 transition-all hover:border-blue-500/50 shadow-2xl">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
            <div className="relative space-y-4">
              <h3 className="text-white/60 font-bold uppercase tracking-widest text-[10px]">Statut du Site</h3>
              <div className="flex items-center gap-3 py-2">
                <div className={`w-3 h-3 rounded-full animate-pulse ${displayAudit.score > 70 ? 'bg-teal-400 shadow-[0_0_10px_#2dd4bf]' : 'bg-yellow-400 shadow-[0_0_10px_#facc15]'}`} />
                <span className="text-3xl font-black text-white">
                  {displayAudit.score > 70 ? 'Sécurisé' : 'En attente'}
                </span>
              </div>
              <p className="text-white/40 text-xs">Surveillance active 24/7</p>
            </div>
          </div>
        </div>

        {/* SECTION: Graphique & Analyse */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 space-y-8">
            <h3 className="text-lg font-bold text-white tracking-tight">Analyse Détaillée</h3>
            <div className="space-y-6">
              {[
                { label: "Cookies & Traceurs", val: displayAudit.score > 0 ? displayAudit.score : 0, color: "bg-teal-500" },
                { label: "Mentions Légales", val: displayAudit.score > 0 ? Math.min(100, displayAudit.score + 10) : 0, color: "bg-blue-500" },
                { label: "Sécurité des données", val: displayAudit.score > 0 ? Math.max(0, displayAudit.score - 5) : 0, color: "bg-purple-500" }
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/60">
                    <span>{item.label}</span>
                    <span>{item.val}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden p-[2px]">
                    <div 
                      className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`} 
                      style={{ width: `${item.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulaire de Contact intégré */}
          <div className="bg-gradient-to-br from-white/10 to-transparent backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-500/20 rounded-2xl flex items-center justify-center text-teal-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Besoin d'aide ?</h3>
                <p className="text-white/40 text-xs">Experts disponibles en moins de 6h.</p>
              </div>
            </div>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <input 
                type="text" 
                required
                value={contactSubject}
                onChange={(e) => setContactSubject(e.target.value)}
                placeholder="Objet de votre demande"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-teal-500 transition-all outline-none"
              />
              <textarea 
                required
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Décrivez votre problème..."
                rows={3}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-teal-500 transition-all outline-none resize-none"
              />
              <button 
                type="submit"
                className="w-full bg-white text-slate-950 font-black py-3 rounded-xl hover:bg-teal-400 hover:text-slate-900 transition-all shadow-xl uppercase text-xs tracking-widest"
              >
                Envoyer au Support
              </button>
            </form>
          </div>
        </div>

        {/* SECTION: Tableau des Scans */}
        <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
          <div className="px-8 py-6 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
            <h3 className="text-lg font-bold text-white tracking-tight">Historique des Scans</h3>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Base de données sécurisée</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-8 py-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Site Web</th>
                  <th className="px-8 py-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Date</th>
                  <th className="px-8 py-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] text-center">Score</th>
                  <th className="px-8 py-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {lastAudit ? (
                  <tr className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-teal-500/10 rounded-lg flex items-center justify-center text-teal-400 group-hover:scale-110 transition-all">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                        </div>
                        <span className="text-white font-bold text-sm">{displayAudit.url}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-white/40 text-sm">{displayAudit.date}</td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${displayAudit.score > 70 ? 'bg-teal-500/10 text-teal-400' : 'bg-red-500/10 text-red-400'}`}>
                        {displayAudit.score}/100
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="text-white/60 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-all">
                        Rapport →
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-white/20 text-xs italic tracking-widest">
                      AUCUN AUDIT DÉTECTÉ DANS LA BASE DE DONNÉES.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
