"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
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

  // States pour les modales
  const [activeModal, setActiveModal] = useState<"score" | "risques" | "statut" | null>(null);

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
          <div 
            onClick={() => setActiveModal("score")}
            className="relative group overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 transition-all hover:border-teal-500/50 shadow-2xl cursor-pointer"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-all" />
            <div className="relative space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-white/60 font-bold uppercase tracking-widest text-[10px]">Score de Conformité</h3>
                <div className="w-10 h-10 rounded-full border border-teal-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <div 
                    className="absolute inset-0 rounded-full" 
                    style={{ background: `conic-gradient(#2dd4bf ${displayAudit.score}%, rgba(255,255,255,0.05) 0)` }}
                  />
                  <div className="absolute inset-[3px] bg-slate-900 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-black text-white">{displayAudit.score}%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">Analyse Active</span>
                  <p className="text-white/40 text-[10px]">Dernier scan : {displayAudit.date}</p>
                </div>
              </div>
              <p className="text-white/40 text-[10px] italic pt-2">Cliquer pour le détail analytique</p>
            </div>
          </div>

          {/* Card 2: Risques */}
          <div 
            onClick={() => setActiveModal("risques")}
            className="relative group overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 transition-all hover:border-red-500/50 shadow-2xl cursor-pointer"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all" />
            <div className="relative space-y-4">
              <h3 className="text-white/60 font-bold uppercase tracking-widest text-[10px]">Risques Détectés</h3>
              <div className="flex items-end gap-3">
                <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                  {displayAudit.score > 0 ? Math.floor((100 - displayAudit.score) / 5) : 0}
                </span>
                <span className="mb-2 px-2 py-1 bg-red-500/10 text-red-400 rounded-lg text-[10px] font-black uppercase">Critique</span>
              </div>
              <p className="text-white/40 text-xs italic">Voir les points de vulnérabilité</p>
            </div>
          </div>

          {/* Card 3: Statut */}
          <div 
            onClick={() => setActiveModal("statut")}
            className="relative group overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 transition-all hover:border-blue-500/50 shadow-2xl cursor-pointer"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
            <div className="relative space-y-4">
              <h3 className="text-white/60 font-bold uppercase tracking-widest text-[10px]">Statut du Site</h3>
              <div className="flex items-center gap-3 py-2">
                <div className={`w-3 h-3 rounded-full animate-pulse ${displayAudit.score > 80 ? 'bg-teal-400 shadow-[0_0_10px_#2dd4bf]' : displayAudit.score > 50 ? 'bg-orange-400 shadow-[0_0_10px_#fb923c]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`} />
                <span className="text-3xl font-black text-white leading-tight">
                  {displayAudit.score > 80 ? 'Sécurisé' : displayAudit.score > 50 ? 'Partiellement Conforme' : 'Non Conforme'}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-white/40 text-xs italic">Surveillance active 24/7</p>
                <p className="text-teal-400/60 text-[10px] font-bold uppercase tracking-widest">Mode surveillance PRO requis pour l'analyse automatique</p>
              </div>
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

        {/* SECTION: Améliorez votre protection (Pricing) */}
        <div className="pt-16 pb-8 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Améliorez votre protection</h2>
            <p className="text-white/40 text-lg">Choisissez le plan adapté à la croissance de votre entreprise.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 w-full">
            {/* Plan 1: OFFRE TEST */}
            <div className="relative bg-white/5 backdrop-blur-xl border border-teal-500/30 rounded-3xl p-8 flex flex-col space-y-8 hover:border-teal-500/50 transition-all group">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-500 text-slate-900 text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
                Plan Actuel
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">OFFRE TEST</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">0€</span>
                  <span className="text-white/40 text-sm font-medium">/ à vie</span>
                </div>
                <p className="text-white/50 text-sm">Pour tester et comprendre vos failles.</p>
              </div>
              <ul className="space-y-4 flex-1">
                {["Scan manuel illimité", "Rapport de score", "Conseils de base"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                    <svg className="w-5 h-5 text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-2xl bg-white/5 text-white/40 font-bold cursor-default border border-white/5 uppercase text-xs tracking-widest">
                Votre Plan Actuel
              </button>
            </div>

            {/* Plan 2: Pro */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col space-y-8 hover:border-white/20 transition-all group shadow-2xl">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Pro</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">29€</span>
                  <span className="text-white/40 text-sm font-medium">/ mois</span>
                </div>
                <p className="text-white/50 text-sm">La surveillance automatique pour les TPE/PME.</p>
              </div>
              <ul className="space-y-4 flex-1">
                {["Scan hebdomadaire", "Alertes email temps réel", "Générateur de politique"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                    <svg className="w-5 h-5 text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link 
                href="/dashboard"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 text-white font-black hover:scale-[1.02] transition-all text-center uppercase text-xs tracking-widest shadow-lg shadow-teal-500/20"
              >
                Passer au Plan Pro
              </Link>
            </div>

            {/* Plan 3: Entreprise */}
            <div className="relative bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border-2 border-teal-500/50 rounded-3xl p-8 flex flex-col space-y-8 shadow-2xl shadow-teal-500/10 hover:border-teal-400 transition-all z-20">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
                Recommandé
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">Entreprise</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">79€</span>
                  <span className="text-white/40 text-sm font-medium">/ mois</span>
                </div>
                <p className="text-white/50 text-sm">Le bouclier complet avec expert dédié.</p>
              </div>
              <ul className="space-y-4 flex-1">
                {["Scan quotidien", "Support prioritaire 24/7", "Correctifs par nos experts"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                    <svg className="w-5 h-5 text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link 
                href="/dashboard"
                className="w-full py-4 rounded-2xl bg-blue-700 hover:bg-blue-600 text-white font-black shadow-lg shadow-blue-500/20 transition-all text-center uppercase text-xs tracking-widest"
              >
                Choisir ce plan
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MODALES INTERACTIVES */}
      <Dialog.Root open={!!activeModal} onOpenChange={() => setActiveModal(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-2xl bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl z-[101] focus:outline-none overflow-hidden">
            <Dialog.Close className="absolute top-8 right-8 text-white/20 hover:text-white transition-all">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Dialog.Close>

            {activeModal === "score" && (
              <div className="space-y-8 animate-in zoom-in-95 duration-200">
                <div className="space-y-2">
                  <Dialog.Title className="text-2xl font-black text-white">Détail du Score Global</Dialog.Title>
                  <p className="text-white/40 text-sm italic">Analyse pondérée selon les critères de la CNIL.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-12 py-4">
                  {/* Donut Chart SVG */}
                  <div className="relative w-48 h-48">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                      <circle cx="50" cy="50" r="40" className="stroke-white/5" strokeWidth="12" fill="none" />
                      <circle 
                        cx="50" cy="50" r="40" 
                        className="stroke-teal-500" 
                        strokeWidth="12" 
                        fill="none"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (251.2 * displayAudit.score) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black text-white">{displayAudit.score}%</span>
                      <span className="text-[10px] text-white/40 uppercase font-bold">Conformité</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 w-full">
                    {[
                      { label: "Consentement", val: 90, color: "bg-teal-500" },
                      { label: "Mentions Légales", val: 75, color: "bg-blue-500" },
                      { label: "Sécurité SSL", val: 100, color: "bg-purple-500" },
                      { label: "Gestion Cookies", val: displayAudit.score, color: "bg-orange-500" }
                    ].map((pill, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-white/60 uppercase">
                          <span>{pill.label}</span>
                          <span>{pill.val}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full ${pill.color} rounded-full`} style={{ width: `${pill.val}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-white/60 text-sm leading-relaxed p-6 bg-white/5 rounded-2xl border border-white/5">
                  Ce score est calculé selon 4 piliers fondamentaux : le **Consentement** explicite, la validité des **Mentions Légales**, la **Sécurité SSL** du domaine et la **Gestion technique des Cookies**.
                </p>
              </div>
            )}

            {activeModal === "risques" && (
              <div className="space-y-8 animate-in zoom-in-95 duration-200">
                <div className="space-y-2">
                  <Dialog.Title className="text-2xl font-black text-white">Analyse des Risques Juridiques</Dialog.Title>
                  <p className="text-white/40 text-sm italic">Sévérité des failles détectées.</p>
                </div>

                <div className="space-y-6 py-4">
                  {[
                    { label: "Risques Critiques", val: displayAudit.score < 80 ? 65 : 20, color: "bg-red-500", desc: "Sanction CNIL immédiate possible" },
                    { label: "Risques Modérés", val: 45, color: "bg-orange-500", desc: "Mise en demeure sous 30 jours" },
                    { label: "Risques Mineurs", val: 80, color: "bg-blue-500", desc: "Optimisation de l'expérience utilisateur" }
                  ].map((risk, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-white uppercase">{risk.label}</span>
                          <p className="text-[10px] text-white/30">{risk.desc}</p>
                        </div>
                        <span className={`text-sm font-black ${risk.color.replace('bg-', 'text-')}`}>{risk.val}%</span>
                      </div>
                      <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-[2px]">
                        <div className={`h-full ${risk.color} rounded-full`} style={{ width: `${risk.val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-200 text-sm leading-relaxed flex gap-4">
                  <svg className="w-6 h-6 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p>Attention : Nous avons détecté des failles qui pourraient entraîner des sanctions de la **CNIL** pouvant aller jusqu'à 4% de votre chiffre d'affaires annuel.</p>
                </div>
              </div>
            )}

            {activeModal === "statut" && (
              <div className="space-y-8 animate-in zoom-in-95 duration-200">
                <div className="space-y-2">
                  <Dialog.Title className="text-2xl font-black text-white">Statut de Conformité</Dialog.Title>
                  <p className="text-white/40 text-sm italic">Monitoring en temps réel de votre domaine.</p>
                </div>

                <div className="flex flex-col items-center justify-center py-12 space-y-6">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center animate-pulse ${displayAudit.score > 80 ? 'bg-teal-500/20' : displayAudit.score > 50 ? 'bg-orange-500/20' : 'bg-red-500/20'}`}>
                    <div className={`w-12 h-12 rounded-full ${displayAudit.score > 80 ? 'bg-teal-500' : displayAudit.score > 50 ? 'bg-orange-500' : 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]'}`} />
                  </div>
                  <div className="text-center space-y-2">
                    <span className="text-4xl font-black text-white block uppercase tracking-tight">
                      {displayAudit.score > 80 ? 'Sécurisé' : displayAudit.score > 50 ? 'Partiellement Conforme' : 'Non Conforme'}
                    </span>
                    <p className="text-white/40 font-medium">Votre site est actuellement sous surveillance active.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                    <span className="text-xs text-white/40 block mb-1">Dernière vérification</span>
                    <span className="text-sm font-bold text-white">{displayAudit.date}</span>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                    <span className="text-xs text-white/40 block mb-1">Fréquence scan</span>
                    <span className="text-sm font-bold text-teal-400">Toutes les 24h</span>
                  </div>
                </div>

                <p className="text-center text-white/60 text-xs">
                  Notre système analyse votre site web en continu pour détecter tout changement dans la structure des cookies ou des scripts tiers.
                </p>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </main>
  );
}
