"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function Dashboard() {
  const { user } = useUser();
  
  // Données simulées pour l'interface
  const [lastAudit] = useState({
    score: 68,
    date: "28 Avril 2026",
    url: "monsite-ecommerce.fr",
  });

  const [criticalPoints] = useState([
    "Bandeau de consentement aux cookies non conforme",
    "Absence de lien vers la Politique de Confidentialité dans le footer",
    "Traceurs Google Analytics activés avant le consentement",
    "Formulaire de contact sans case à cocher RGPD",
  ]);

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-24 relative overflow-hidden bg-slate-950">
      {/* Decorative background blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl z-10 space-y-12">
        {/* Header Dashboard */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Bienvenue, {user?.firstName}</h1>
            <p className="text-white/40 text-sm mt-1">Gérez la conformité de vos projets en temps réel.</p>
          </div>
          <Link 
            href="/"
            className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 text-slate-900 font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Lancer un nouveau scan
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
                    className="stroke-teal-400 transition-all duration-1000"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * lastAudit.score) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-2xl font-black">{lastAudit.score}</span>
              </div>
              <div>
                <p className="text-white font-bold">{lastAudit.url}</p>
                <p className="text-white/40 text-xs">Scan du {lastAudit.date}</p>
              </div>
            </div>
            <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition-all uppercase tracking-widest">
              Voir le rapport complet
            </button>
          </div>

          {/* Points Critiques */}
          <div className="md:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-white/60 font-bold uppercase tracking-widest text-xs">Points critiques à corriger</h3>
              <span className="bg-red-500/20 text-red-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                {criticalPoints.length} Alertes
              </span>
            </div>
            
            <div className="space-y-4">
              {criticalPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-4 bg-black/40 p-4 rounded-2xl border border-white/5 group hover:border-red-500/30 transition-all">
                  <div className="w-5 h-5 bg-red-500/10 rounded flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span className="text-white/80 text-sm leading-relaxed group-hover:text-white transition-colors">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Dashboard */}
        <div className="bg-gradient-to-r from-teal-900/20 to-blue-900/20 border border-teal-500/10 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold">Besoin d'aide pour corriger ces points ?</p>
              <p className="text-white/40 text-sm">Nos experts sont disponibles pour une mise en conformité éclair.</p>
            </div>
          </div>
          <button className="whitespace-nowrap bg-white text-slate-900 font-black px-8 py-3 rounded-xl hover:scale-105 transition-all shadow-xl">
            PRENDRE RENDEZ-VOUS
          </button>
        </div>
      </div>
    </main>
  );
}
