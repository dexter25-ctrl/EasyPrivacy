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

      <div className="w-full max-w-5xl z-10 space-y-12">
        {/* Header Dashboard */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Espace de conformité de {user?.firstName || "Chargement..."}
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
            Nouvel Audit
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Résumé Audit */}
          <div className="md:col-span-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6">
            <h3 className="text-white/60 font-bold uppercase tracking-widest text-xs">Dernier Audit</h3>
            <div className="flex items-center gap-4">
              <div className="relative flex items-center justify-center w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" className="stroke-white/5" strokeWidth="8" fill="none" />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    className={`${displayAudit.score > 70 ? 'stroke-teal-400' : displayAudit.score > 40 ? 'stroke-yellow-400' : 'stroke-red-400'} transition-all duration-1000`}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * displayAudit.score) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-2xl font-black">{displayAudit.score}</span>
              </div>
              <div>
                <p className="text-white font-bold truncate max-w-[150px]">{displayAudit.url}</p>
                <p className="text-white/40 text-xs">Scan du {displayAudit.date}</p>
              </div>
            </div>
            <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition-all uppercase tracking-widest">
              Voir le rapport complet
            </button>
          </div>

          {/* Points Critiques */}
          <div className="md:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Actions prioritaires
            </h2>
            
            <div className="space-y-4">
              {lastAudit ? (
                displayAudit.criticalPoints.map((point, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5 group hover:border-teal-500/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span className="text-white/80 text-sm">{point}</span>
                    </div>
                    <button className="text-teal-400 text-xs font-bold uppercase tracking-widest hover:text-teal-300 transition-all opacity-0 group-hover:opacity-100">
                      Corriger
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 space-y-6">
                  <p className="text-white/40 text-sm">Vous n'avez pas encore effectué d'audit de conformité.</p>
                  <Link 
                    href="/" 
                    className="inline-block bg-gradient-to-r from-teal-500 to-blue-500 text-slate-900 font-black px-8 py-4 rounded-2xl hover:scale-105 transition-all shadow-xl shadow-teal-500/20"
                  >
                    LANCER MON PREMIER AUDIT (TEST)
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section Plans Upgrade */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-8">
          <h2 className="text-xl font-bold text-white uppercase tracking-widest text-center">Améliorez votre couverture</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pro Upgrade */}
            <div className="p-6 bg-black/40 rounded-2xl border border-white/5 hover:border-teal-500/30 transition-all space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-white text-lg">Plan Pro</h3>
                <span className="text-teal-400 font-black">29€/m</span>
              </div>
              <p className="text-white/40 text-sm italic">Surveillance hebdomadaire et rapports auto.</p>
              <button className="w-full py-3 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 font-bold rounded-xl border border-teal-500/20 transition-all">
                S'abonner au Plan Pro
              </button>
            </div>
            {/* Enterprise Upgrade */}
            <div className="p-6 bg-teal-500/5 rounded-2xl border border-teal-500/20 hover:border-teal-400 transition-all space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-white text-lg">Plan Entreprise</h3>
                <span className="text-teal-400 font-black">79€/m</span>
              </div>
              <p className="text-white/40 text-sm italic">Support 24/7 et mise en conformité expert.</p>
              <button className="w-full py-3 bg-teal-500 text-slate-900 font-bold rounded-xl hover:bg-teal-400 transition-all">
                Passer à l'Entreprise
              </button>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">Contacter le Support</h2>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-white/40 text-[10px] font-bold uppercase tracking-widest ml-1">Objet</label>
                <input 
                  type="text" 
                  required
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  placeholder="Ex: Question sur mon audit"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-teal-500/50 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-white/40 text-[10px] font-bold uppercase tracking-widest ml-1">Message</label>
                <textarea 
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Votre message ici..."
                  rows={4}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-teal-500/50 outline-none resize-none"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-white text-slate-900 font-black py-3 rounded-xl hover:scale-[1.02] transition-all shadow-xl"
              >
                ENVOYER PAR EMAIL
              </button>
            </form>
          </div>

          {/* Quick Help CTA */}
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
