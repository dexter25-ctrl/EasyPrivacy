"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";

function DashboardContent() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [lastAudit, setLastAudit] = useState<{
    score: number;
    date: string;
    url: string;
    criticalPoints: string[];
  } | null>(null);

  // States pour l'abonnement
  const [isPro, setIsPro] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  // States pour la checklist interactive
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [repairInfo, setRepairInfo] = useState<string | null>(null);

  // States pour le formulaire de contact
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // States pour les modales
  const [activeModal, setActiveModal] = useState<"score" | "risques" | "statut" | "report" | null>(null);

  useEffect(() => {
    // Charger l'audit
    const savedAudit = localStorage.getItem("lastAudit");
    if (savedAudit) {
      setLastAudit(JSON.parse(savedAudit));
    }

    // Charger le statut Pro
    const savedIsPro = localStorage.getItem("isPro") === "true";
    setIsPro(savedIsPro);

    // Détecter le succès du paiement
    if (searchParams.get("success") === "true") {
      setIsPro(true);
      localStorage.setItem("isPro", "true");
      setShowSuccessBanner(true);
      window.history.replaceState({}, '', '/dashboard');
    }
  }, [searchParams]);

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:dextoolstudio@gmail.com?subject=${encodeURIComponent(contactSubject)}&body=${encodeURIComponent(contactMessage)}`;
    window.location.href = mailtoUrl;
  };

  const handlePlanClick = async (priceId: string) => {
    try {
      setLoading(true);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } catch (error) {
      console.error("Erreur lors du checkout", error);
    } finally {
      setLoading(false);
    }
  };

  const displayAudit = lastAudit || {
    score: 0,
    date: "N/A",
    url: "Aucun scan récent",
    criticalPoints: [],
  };

  // Calcul du score dynamique en fonction des tâches accomplies
  const baseScore = displayAudit.score;
  const taskCount = displayAudit.criticalPoints.length;
  const scoreIncrement = taskCount > 0 ? (100 - baseScore) / taskCount : 0;
  const currentScore = Math.min(100, Math.round(baseScore + (completedTasks.length * scoreIncrement)));

  const risksCount = Math.max(0, taskCount - completedTasks.length);

  const toggleTask = (point: string) => {
    setCompletedTasks(prev => 
      prev.includes(point) ? prev.filter(t => t !== point) : [...prev, point]
    );
  };

  const getRepairExplanation = (point: string) => {
    const explanations: Record<string, string> = {
      "Absence de bouton 'Tout Refuser'": "Pour être conforme, votre bandeau doit permettre de refuser les cookies aussi facilement que de les accepter. Ajoutez un bouton 'Continuer sans accepter' ou 'Tout refuser' de même taille que le bouton 'Accepter'.",
      "Google Analytics activé sans consentement": "Les traceurs de mesure d'audience nécessitent un consentement préalable sauf s'ils sont strictement anonymisés. Configurez votre script pour ne se charger qu'après le clic sur 'Accepter'.",
      "Mentions légales incomplètes": "Vos mentions légales doivent obligatoirement inclure l'identité de l'éditeur, l'hébergeur, et le délégué à la protection des données (DPO). Utilisez notre modèle Pro pour les mettre à jour.",
      "Pixel Facebook détecté avant accord": "Le Pixel Facebook est un traceur publicitaire intrusif. Il doit être bloqué par défaut jusqu'à ce que l'utilisateur donne son accord explicite via votre CMP.",
      "SSL expiré ou mal configuré": "Le certificat SSL garantit le chiffrement des données de vos utilisateurs. Un certificat expiré est une faille de sécurité majeure sanctionnée par le RGPD."
    };
    return explanations[point] || "Ce point nécessite une attention technique pour garantir la protection des données de vos utilisateurs. Suivez nos recommandations pour corriger cette faille.";
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-24 relative overflow-hidden bg-[#020617]">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse delay-700" />

      <div className="w-full max-w-6xl z-10 space-y-10">
        
        {showSuccessBanner && (
          <div className="animate-in slide-in-from-top-4 duration-500 bg-emerald-500/10 border-2 border-emerald-500/50 backdrop-blur-xl p-6 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">🎉</div>
              <div>
                <h3 className="text-emerald-400 font-black uppercase tracking-widest text-xs">Paiement Réussi</h3>
                <p className="text-white font-medium text-sm">Félicitations ! Votre abonnement EasyPrivacy a été activé avec succès. Votre site est désormais sous haute protection.</p>
              </div>
            </div>
            <button onClick={() => setShowSuccessBanner(false)} className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl text-xs font-black uppercase transition-all">Fermer</button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Bienvenue, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">{user?.firstName || "Utilisateur"}</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-white/40 text-sm font-medium">Votre centre de contrôle de conformité RGPD.</p>
              {isPro && <span className="px-2 py-0.5 bg-teal-500/10 text-teal-400 border border-teal-500/30 rounded-full text-[10px] font-black uppercase">Plan Pro</span>}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-2xl transition-all text-sm font-bold">Retour accueil</Link>
            <Link href="/" className="bg-gradient-to-r from-teal-500 to-blue-600 hover:scale-105 text-white font-bold px-8 py-3 rounded-2xl transition-all shadow-[0_0_20px_rgba(45,212,191,0.3)] flex items-center gap-2">Nouveau Scan</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Score */}
          <div onClick={() => setActiveModal("score")} className="relative group overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 transition-all hover:border-teal-500/50 shadow-2xl cursor-pointer">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-all" />
            <div className="relative space-y-4">
              <h3 className="text-white/60 font-bold uppercase tracking-widest text-[10px]">Score de Conformité</h3>
              <div className="flex items-center gap-6">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full transition-all duration-1000" style={{ background: `conic-gradient(#2dd4bf ${currentScore}%, rgba(255,255,255,0.05) 0)` }} />
                  <div className="absolute inset-[3px] bg-slate-900 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-black text-white">{currentScore}%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">Analyse Active</span>
                  <p className="text-white/40 text-[10px]">Dernier scan : {displayAudit.date}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Risques */}
          <div onClick={() => setActiveModal("risques")} className="relative group overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 transition-all hover:border-red-500/50 shadow-2xl cursor-pointer">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all" />
            <div className="relative space-y-4">
              <h3 className="text-white/60 font-bold uppercase tracking-widest text-[10px]">Risques Détectés</h3>
              <div className="flex items-end gap-3">
                <span className={`text-6xl font-black text-transparent bg-clip-text ${risksCount > 0 ? 'bg-gradient-to-r from-red-400 to-orange-400' : 'bg-gradient-to-r from-teal-400 to-blue-400'}`}>
                  {risksCount}
                </span>
                <span className={`mb-2 px-2 py-1 ${risksCount > 0 ? 'bg-red-500/10 text-red-400' : 'bg-teal-500/10 text-teal-400'} rounded-lg text-[10px] font-black uppercase`}>
                  {risksCount > 2 ? "Critique" : risksCount > 0 ? "Moyen" : "Sécurisé"}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Statut */}
          <div onClick={() => setActiveModal("statut")} className="relative group overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 transition-all hover:border-blue-500/50 shadow-2xl cursor-pointer">
            <div className="relative space-y-4">
              <h3 className="text-white/60 font-bold uppercase tracking-widest text-[10px]">Statut du Site</h3>
              <div className="flex items-center gap-3 py-2">
                <div className={`w-3 h-3 rounded-full animate-pulse ${currentScore > 80 ? 'bg-teal-400 shadow-[0_0_10px_#2dd4bf]' : currentScore > 50 ? 'bg-orange-400 shadow-[0_0_10px_#fb923c]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`} />
                <span className="text-3xl font-black text-white leading-tight">
                  {currentScore > 80 ? 'Sécurisé' : currentScore > 50 ? 'Partiellement Conforme' : 'Non Conforme'}
                </span>
              </div>
              {isPro && <p className="text-teal-400/60 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">Mode Surveillance PRO Actif</p>}
            </div>
          </div>
        </div>

        {/* SECTION: Graphique & Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 space-y-8 flex flex-col">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white tracking-tight">Analyse Détaillée</h3>
              {isPro && (
                <button onClick={() => setActiveModal("report")} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Télécharger le Rapport PDF
                </button>
              )}
            </div>
            
            <div className="space-y-6 flex-1">
              {[
                { label: "Cookies & Traceurs", val: Math.min(100, currentScore), color: "bg-teal-500" },
                { label: "Mentions Légales", val: Math.min(100, currentScore + 5), color: "bg-blue-500" },
                { label: "Sécurité des données", val: Math.min(100, currentScore + 10), color: "bg-purple-500" }
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/60">
                    <span>{item.label}</span>
                    <span>{item.val}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden p-[2px]">
                    <div className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${item.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CHECKLIST INTERACTIVE PRO */}
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 space-y-6 flex flex-col">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Plan d'action personnalisé</h3>
                <p className="text-white/40 text-xs">Suivez ces étapes pour atteindre 100% de conformité.</p>
              </div>
            </div>

            {isPro ? (
              <div className="space-y-3 flex-1">
                {displayAudit.criticalPoints.length > 0 ? displayAudit.criticalPoints.map((point, i) => (
                  <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${completedTasks.includes(point) ? 'bg-teal-500/10 border-teal-500/30 opacity-60' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                    <button 
                      onClick={() => toggleTask(point)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${completedTasks.includes(point) ? 'bg-teal-500 text-slate-900' : 'border-2 border-white/20 hover:border-teal-500/50'}`}
                    >
                      {completedTasks.includes(point) && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </button>
                    <span className={`flex-1 text-sm font-bold ${completedTasks.includes(point) ? 'text-teal-400 line-through' : 'text-white'}`}>{point}</span>
                    <button 
                      onClick={() => setRepairInfo(point)}
                      className="text-white/20 hover:text-blue-400 transition-colors"
                      title="Comment réparer ?"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </button>
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center py-10 space-y-4 opacity-40">
                    <svg className="w-12 h-12 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p className="text-xs italic">Aucun point critique détecté.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center space-y-6 p-8 bg-black/40 rounded-3xl border border-white/5">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white/20">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-white font-bold text-sm">Contenu verrouillé</p>
                  <p className="text-white/40 text-xs px-4">Passez au plan PRO pour accéder à votre guide de mise en conformité étape par étape.</p>
                </div>
                <button 
                  onClick={() => handlePlanClick(process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO || "")}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Débloquer maintenant
                </button>
              </div>
            )}
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
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
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
                    <td className="px-8 py-6 text-right"><button className="text-white/60 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-all">Rapport →</button></td>
                  </tr>
                ) : (
                  <tr><td colSpan={4} className="px-8 py-20 text-center text-white/20 text-xs italic tracking-widest">AUCUN AUDIT DÉTECTÉ DANS LA BASE DE DONNÉES.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PRICING SECTION */}
        <div className="pt-16 pb-8 space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Votre Protection</h2>
            <p className="text-white/40 text-lg">Gérez votre abonnement et améliorez votre conformité.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 w-full">
            <div className={`relative bg-white/5 backdrop-blur-xl border ${!isPro ? 'border-teal-500/30' : 'border-white/10'} rounded-3xl p-8 flex flex-col space-y-8 hover:border-teal-500/50 transition-all`}>
              {!isPro && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-500 text-slate-900 text-[10px] font-black uppercase px-4 py-1 rounded-full">Plan Actuel</div>}
              <h3 className="text-xl font-bold text-white">OFFRE TEST</h3>
              <p className="text-4xl font-black text-white">0€</p>
              <ul className="space-y-4 flex-1">
                {["Scan manuel", "Rapport de score"].map((f, i) => <li key={i} className="flex items-center gap-3 text-sm text-white/80"><svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>{f}</li>)}
              </ul>
              <button className="w-full py-4 rounded-2xl bg-white/5 text-white/40 font-bold uppercase text-xs">Plan Actuel</button>
            </div>
            <div className={`relative bg-white/5 backdrop-blur-xl border ${isPro ? 'border-emerald-500/50' : 'border-white/10'} rounded-3xl p-8 flex flex-col space-y-8 shadow-2xl`}>
              {isPro && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-black uppercase px-4 py-1 rounded-full animate-pulse">Plan Actuel Pro</div>}
              <h3 className="text-xl font-bold text-white">Pro</h3>
              <p className="text-4xl font-black text-white">29€</p>
              <ul className="space-y-4 flex-1">
                {["Guide correctif", "Alertes email", "Rapports PDF"].map((f, i) => <li key={i} className="flex items-center gap-3 text-sm text-white/80"><svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>{f}</li>)}
              </ul>
              <button onClick={() => !isPro && handlePlanClick(process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO || "")} className={`w-full py-4 rounded-2xl ${isPro ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gradient-to-r from-teal-500 to-blue-500 text-white font-black'} font-bold uppercase text-xs`}>{isPro ? "Plan Actuel" : "Passer au Plan Pro"}</button>
            </div>
            <div className="relative bg-gradient-to-b from-white/10 to-white/5 border-2 border-teal-500/50 rounded-3xl p-8 flex flex-col space-y-8 shadow-2xl shadow-teal-500/10">
              <h3 className="text-xl font-bold text-white">Entreprise</h3>
              <p className="text-4xl font-black text-white">79€</p>
              <ul className="space-y-4 flex-1">
                {["Scan quotidien", "Expert dédié", "Correctifs automatiques"].map((f, i) => <li key={i} className="flex items-center gap-3 text-sm text-white/80"><svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>{f}</li>)}
              </ul>
              <button onClick={() => handlePlanClick(process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE || "")} className="w-full py-4 rounded-2xl bg-blue-700 hover:bg-blue-600 text-white font-black uppercase text-xs">Choisir ce plan</button>
            </div>
          </div>
        </div>
      </div>

      {/* MODALES & TOOLTIPS */}
      <Dialog.Root open={!!repairInfo} onOpenChange={() => setRepairInfo(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg bg-slate-900 border border-white/10 rounded-[2rem] p-10 shadow-2xl z-[201] focus:outline-none">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">Comment réparer ?</h3>
                  <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">{repairInfo}</p>
                </div>
              </div>
              <p className="text-white/70 leading-relaxed text-sm bg-white/5 p-6 rounded-2xl border border-white/5">
                {repairInfo && getRepairExplanation(repairInfo)}
              </p>
              <button 
                onClick={() => setRepairInfo(null)}
                className="w-full bg-white text-slate-950 font-black py-3 rounded-xl hover:bg-teal-400 transition-all uppercase text-xs tracking-widest"
              >
                J'ai compris
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* MODALE RAPPORT PDF */}
      <Dialog.Root open={activeModal === "report"} onOpenChange={() => setActiveModal(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-2xl bg-white text-slate-900 rounded-[2rem] p-12 shadow-2xl z-[201] focus:outline-none overflow-y-auto max-h-[90vh]">
            <div className="space-y-10">
              <div className="flex justify-between items-start border-b-2 border-slate-100 pb-8">
                <div className="space-y-2">
                  <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Rapport de Conformité</h1>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">EasyPrivacy Professional • {displayAudit.date}</p>
                </div>
                <div className="bg-slate-900 text-white px-4 py-2 rounded-lg font-black text-xs uppercase tracking-widest">Confidentiel</div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Domaine audité</p>
                  <p className="text-lg font-bold text-slate-900">{displayAudit.url}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score initial</p>
                  <p className="text-4xl font-black text-slate-900">{baseScore}%</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">Plan d'action de correction</h3>
                <div className="space-y-3">
                  {displayAudit.criticalPoints.map((point, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                      <div className="w-5 h-5 rounded-full border-2 border-slate-200 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900">{point}</p>
                        <p className="text-[10px] text-slate-500 leading-relaxed">{getRepairExplanation(point)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 flex gap-4">
                <button onClick={() => window.print()} className="flex-1 bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-slate-800 transition-all uppercase text-xs tracking-widest">
                  Imprimer le rapport
                </button>
                <button onClick={() => setActiveModal(null)} className="px-8 border-2 border-slate-100 text-slate-400 font-bold rounded-2xl hover:bg-slate-50 transition-all uppercase text-xs tracking-widest">
                  Fermer
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* MODALES CLASSIQUES (SCORE, RISQUES, STATUT) */}
      <Dialog.Root open={!!activeModal && activeModal !== "report"} onOpenChange={() => setActiveModal(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-2xl bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl z-[101] focus:outline-none">
            <Dialog.Close className="absolute top-8 right-8 text-white/20 hover:text-white transition-all"><svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></Dialog.Close>
            {activeModal === "score" && <div className="space-y-8 animate-in zoom-in-95 duration-200"><h2 className="text-2xl font-black text-white">Détail du Score</h2><p className="text-white/60">Analyse pondérée basée sur les standards RGPD.</p></div>}
            {/* ... Autres modales simplifiées pour la lisibilité ... */}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </main>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div>Chargement du Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
