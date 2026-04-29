"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Download, 
  Info, 
  ChevronRight, 
  Mail, 
  Lock,
  ArrowRight,
  FileText,
  X,
  Globe
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { translations, Language } from "@/lib/translations";

function DashboardContent() {
  const [lang, setLang] = useState<Language>('fr');

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Language;
    if (savedLang) setLang(savedLang);
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'fr' ? 'en' : 'fr';
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  const t = translations[lang];
  const td = t.dashboard;
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
  const [currentPlan, setCurrentPlan] = useState<'free' | 'pro' | 'enterprise'>('free');
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  // States pour la checklist interactive
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [repairInfo, setRepairInfo] = useState<string | null>(null);

  // States pour le formulaire de contact
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // States pour les modales
  const [activeModal, setActiveModal] = useState<"score" | "risques" | "statut" | null>(null);

  useEffect(() => {
    // Charger l'audit
    const savedAudit = localStorage.getItem("lastAudit");
    if (savedAudit) {
      setLastAudit(JSON.parse(savedAudit));
    }

    // Charger le plan
    const savedPlan = localStorage.getItem("currentPlan") as any;
    if (savedPlan) {
      setCurrentPlan(savedPlan);
    }

    // Détecter le succès du paiement
    if (searchParams.get("success") === "true") {
      const planFromUrl = searchParams.get("plan");
      const newPlan = planFromUrl === 'enterprise' ? 'enterprise' : 'pro';
      setCurrentPlan(newPlan);
      localStorage.setItem("currentPlan", newPlan);
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
    // 1. Vérification de la clé publique (Debug)
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      alert("Erreur : La clé NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY est manquante sur Vercel.");
    }

    // 2. Vérification de l'ID
    if (!priceId || !priceId.startsWith('price_')) {
      alert(`Erreur : ID de plan invalide ou manquant (${priceId}). Il doit commencer par 'price_'.`);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erreur Serveur : Impossible de créer la session Stripe.");
      }
    } catch (error) {
      alert("Erreur de connexion au serveur de paiement.");
    } finally {
      setLoading(false);
    }
  };

  const displayAudit = lastAudit || {
    score: 0,
    date: "N/A",
    url: "Aucun scan récent",
    criticalPoints: [
      "Absence de bouton 'Refuser tout' sur le bandeau cookie",
      "Politique de confidentialité non accessible en un clic",
      "Scripts tiers (Google/FB) activés avant le consentement"
    ],
  };

  // Calcul du score dynamique
  const baseScore = displayAudit.score > 0 ? displayAudit.score : 20;
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
      "Absence de bouton 'Refuser tout' sur le bandeau cookie": "La CNIL impose que refuser les cookies soit aussi simple que de les accepter. Ajoutez un bouton 'Tout refuser' de même taille et couleur que le bouton d'acceptation.",
      "Politique de confidentialité non accessible en un clic": "L'utilisateur doit pouvoir consulter votre politique de traitement des données à tout moment. Ajoutez un lien permanent dans votre pied de page (footer).",
      "Scripts tiers (Google/FB) activés avant le consentement": "Les traceurs publicitaires ou analytiques ne doivent pas s'exécuter avant que l'utilisateur ait cliqué sur 'Accepter'. Bloquez-les via votre gestionnaire de tags (GTM).",
      "Absence de bouton 'Tout Refuser'": "Conformément aux directives de la CNIL, refuser les cookies doit être aussi simple que de les accepter. Ajoutez un bouton explicite au même niveau visuel que le bouton d'acceptation.",
      "Google Analytics activé sans consentement": "Ce traceur collecte des données personnelles. Il doit rester inactif jusqu'à l'obtention du consentement explicite via votre bandeau cookie.",
      "Mentions légales incomplètes": "Votre site doit obligatoirement identifier son éditeur, son hébergeur et ses coordonnées de contact pour être en règle avec la LCEN.",
      "Pixel Facebook détecté avant accord": "Le Pixel Facebook est un traceur tiers hautement intrusif. Son exécution doit être strictement conditionnée à un accord positif de l'utilisateur."
    };
    return explanations[point] || "Ce point critique nécessite une correction technique pour assurer la conformité RGPD de votre domaine.";
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(2, 6, 23);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("EASYPRIVACY PROFESSIONAL", 20, 25);
    
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(10);
    doc.text(`Rapport généré le ${new Date().toLocaleDateString()}`, 140, 25);

    // Infos Audit
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text("Résultats de l'Audit de Conformité", 20, 55);
    
    autoTable(doc, {
      startY: 65,
      head: [['Domaine Audité', 'Score Global', 'Statut']],
      body: [[displayAudit.url, `${currentScore}%`, currentScore > 80 ? 'Sécurisé' : 'Non Conforme']],
      theme: 'grid',
      headStyles: { fillColor: [45, 212, 191], textColor: [255, 255, 255] }
    });

    // Risques
    doc.setFontSize(14);
    doc.text("Liste des Risques et Solutions", 20, (doc as any).lastAutoTable.finalY + 20);

    const riskBody = displayAudit.criticalPoints.map(point => [
      point,
      completedTasks.includes(point) ? "Corrigé" : "À corriger",
      getRepairExplanation(point)
    ]);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 25,
      head: [['Risque Détecté', 'État', 'Solution Recommandée']],
      body: riskBody,
      theme: 'striped',
      columnStyles: { 2: { cellWidth: 100 } }
    });

    doc.save(`EasyPrivacy_Report_${displayAudit.url.replace(/\./g, '_')}.pdf`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-24 relative overflow-hidden bg-[#020617]">
      {/* Language Selector */}
      <div className="absolute top-8 right-8 z-50">
        <button 
          onClick={toggleLang}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-xl px-4 py-2 rounded-xl text-white text-xs font-black uppercase tracking-widest transition-all"
        >
          <Globe size={14} className="text-teal-400" />
          {lang === 'fr' ? 'EN' : 'FR'}
        </button>
      </div>
      {/* Background Blurs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-6xl z-10 space-y-10">
        
        {/* SUCCESS BANNER */}
        {showSuccessBanner && (
          <div className="animate-in slide-in-from-top-4 duration-500 bg-emerald-500/10 border-2 border-emerald-500/50 backdrop-blur-xl p-6 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-emerald-400 font-black uppercase tracking-widest text-xs">{td.paymentSuccess}</h3>
                <p className="text-white font-medium text-sm">{td.paymentSuccessDesc}</p>
              </div>
            </div>
            <button onClick={() => setShowSuccessBanner(false)} className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl text-xs font-black uppercase transition-all">{td.btnClose}</button>
          </div>
        )}

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
              {td.title} <Shield className="text-teal-400" size={32} />
            </h1>
            <div className="flex items-center gap-2">
              <p className="text-white/40 text-sm">{td.subtitle} <span className="text-white font-bold">{displayAudit.url}</span></p>
              {currentPlan !== 'free' && (
                <span className={`px-2 py-0.5 ${currentPlan === 'enterprise' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-teal-500/10 text-teal-400 border-teal-500/30'} border rounded-full text-[10px] font-black uppercase tracking-widest`}>
                  Plan {currentPlan === 'enterprise' ? t.planEnterprise : t.planPro}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-2xl transition-all text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-[10px]">
              <ArrowRight size={16} className="rotate-180" /> {td.backHome}
            </Link>
            <button 
              onClick={generatePDF} 
              disabled={currentPlan === 'free'} 
              className={`${currentPlan !== 'free' ? 'bg-gradient-to-r from-teal-500 to-blue-600 shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:scale-105' : 'bg-white/5 opacity-50 cursor-not-allowed'} text-white font-black px-8 py-3 rounded-2xl transition-all flex items-center gap-3 uppercase tracking-widest text-[10px]`}
            >
              <Download size={18} /> {td.downloadReport}
            </button>
          </div>
        </div>

        {/* BENTO GRID STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Donut Score */}
          <div onClick={() => setActiveModal("score")} className="relative group overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 transition-all hover:border-teal-500/50 shadow-2xl cursor-pointer">
            <div className="relative space-y-6">
              <div className="flex justify-between items-start">
                <h3 className="text-white/60 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                  <Shield size={14} className="text-teal-400" /> {td.scoreTitle}
                </h3>
                <ChevronRight size={14} className="text-white/20 group-hover:text-teal-400 transition-colors" />
              </div>
              <div className="flex items-center gap-8">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="48" cy="48" r="40" className="stroke-white/5" strokeWidth="10" fill="none" />
                    <circle 
                      cx="48" cy="48" r="40" 
                      className="stroke-teal-500 transition-all duration-1000 ease-out" 
                      strokeWidth="10" 
                      fill="none"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * currentScore) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-3xl font-black text-white">{currentScore}%</span>
                </div>
                <div>
                  <p className="text-teal-400 font-black text-xs uppercase">Conformité</p>
                  <p className="text-white/40 text-[10px] mt-1 italic">Détail analytique disponible</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Risks Severity */}
          <div onClick={() => setActiveModal("risques")} className="relative group overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 transition-all hover:border-red-500/50 shadow-2xl cursor-pointer">
            <div className="relative space-y-6">
              <div className="flex justify-between items-start">
                <h3 className="text-white/60 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                  <AlertTriangle size={14} className="text-red-400" /> {td.risksTitle}
                </h3>
                <ChevronRight size={14} className="text-white/20 group-hover:text-red-400 transition-colors" />
              </div>
              <div className="flex items-end justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-6xl font-black text-white">{risksCount}</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${risksCount > 0 ? 'bg-red-500/20 text-red-400' : 'bg-teal-500/20 text-teal-400'}`}>
                      {risksCount > 0 ? 'Critique' : 'Sécurisé'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1.5 items-end h-12">
                  <div className={`w-3 rounded-t-lg transition-all duration-500 ${risksCount >= 3 ? 'bg-red-500 h-full' : 'bg-red-500/10 h-1/3'}`} />
                  <div className={`w-3 rounded-t-lg transition-all duration-500 ${risksCount >= 2 ? 'bg-orange-500 h-3/4' : 'bg-orange-500/10 h-1/4'}`} />
                  <div className={`w-3 rounded-t-lg transition-all duration-500 ${risksCount >= 1 ? 'bg-yellow-500 h-1/2' : 'bg-yellow-500/10 h-1/5'}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Realtime Status */}
          <div onClick={() => setActiveModal("statut")} className="relative group overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 transition-all hover:border-blue-500/50 shadow-2xl cursor-pointer">
            <div className="relative space-y-6">
              <div className="flex justify-between items-start">
                <h3 className="text-white/60 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                  <CheckCircle size={14} className="text-blue-400" /> Surveillance
                </h3>
                <ChevronRight size={14} className="text-white/20 group-hover:text-blue-400 transition-colors" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full animate-pulse ${currentScore > 80 ? 'bg-teal-400 shadow-[0_0_15px_#2dd4bf]' : currentScore > 50 ? 'bg-orange-400 shadow-[0_0_15px_#fb923c]' : 'bg-red-500 shadow-[0_0_15px_#ef4444]'}`} />
                  <span className="text-2xl font-black text-white">{currentScore > 80 ? td.statusSecured : currentScore > 50 ? td.statusPartial : td.statusUncompliant}</span>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-white/40 font-black uppercase">{td.monitoringTitle} Status</span>
                  <span className="text-[10px] text-teal-400 font-black uppercase tracking-widest">{currentPlan !== 'free' ? td.monitoringActive : td.monitoringLimited}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ANALYSE DÉTAILLÉE & PLAN D'ACTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plan d'action prioritaire (Checklist) */}
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 space-y-8 flex flex-col">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">{td.actionPlanTitle}</h3>
                <p className="text-white/40 text-xs">{td.actionPlanDesc}</p>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              {currentPlan !== 'free' ? (
                displayAudit.criticalPoints.map((point, i) => (
                  <div key={i} className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${completedTasks.includes(point) ? 'bg-teal-500/10 border-teal-500/30' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                    <button 
                      onClick={() => toggleTask(point)}
                      className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${completedTasks.includes(point) ? 'bg-teal-500 text-slate-900 shadow-lg shadow-teal-500/30' : 'border-2 border-white/10 hover:border-teal-500/50'}`}
                    >
                      {completedTasks.includes(point) && <CheckCircle size={18} strokeWidth={3} />}
                    </button>
                    <div className="flex-1">
                      <span className={`text-sm font-bold ${completedTasks.includes(point) ? 'text-teal-400/60 line-through' : 'text-white'}`}>{point}</span>
                    </div>
                    <button 
                      onClick={() => setRepairInfo(point)}
                      className="text-white/20 hover:text-blue-400 transition-colors p-2 hover:bg-white/5 rounded-xl"
                      title="Comment réparer ?"
                    >
                      <Info size={20} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-white/20">
                    <Lock size={32} />
                  </div>
                  <div className="space-y-2 max-w-xs">
                    <p className="text-white font-bold">Guide de correction verrouillé</p>
                    <p className="text-white/40 text-xs italic">Les {displayAudit.criticalPoints.length} points critiques ne peuvent être corrigés qu'avec le Plan Pro.</p>
                  </div>
                  <button onClick={() => handlePlanClick(process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO || "")} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest transition-all">
                    Débloquer le Guide Pro
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Formulaire de Contact Expert */}
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 flex flex-col space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-500/20 rounded-2xl flex items-center justify-center text-teal-400">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">{td.supportTitle}</h3>
                <p className="text-white/40 text-sm">{td.supportDesc}</p>
              </div>
            </div>
            <form onSubmit={handleSendEmail} className="space-y-4">
              <input 
                type="text" required value={contactSubject} onChange={(e) => setContactSubject(e.target.value)}
                placeholder={td.subjectPlaceholder}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:border-teal-500 transition-all outline-none"
              />
              <textarea 
                required value={contactMessage} onChange={(e) => setContactMessage(e.target.value)}
                placeholder={td.messagePlaceholder} rows={4}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:border-teal-500 transition-all outline-none resize-none"
              />
              <button type="submit" className="w-full bg-white text-slate-950 font-black py-4 rounded-2xl hover:bg-teal-400 transition-all shadow-xl uppercase text-xs tracking-widest">
                {td.btnSend}
              </button>
            </form>
          </div>
        </div>

        {/* PRICING PLANS */}
        <div className="pt-20 space-y-12 pb-20">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">{td.choosePlanTitle}</h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto italic">{td.choosePlanDesc}</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { name: t.planFree, price: "0", features: t.pricing.free, active: currentPlan === 'free', id: "", plus: null },
              { name: t.planPro, price: "29", features: t.pricing.pro, active: currentPlan === 'pro', id: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO || '', plus: t.plusTest },
              { name: t.planEnterprise, price: "79", features: t.pricing.enterprise, active: currentPlan === 'enterprise', id: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTREPRISE || '', plus: t.plusPro }
            ].map((plan, i) => (
              <div key={i} className={`relative bg-white/5 backdrop-blur-xl border ${plan.active ? 'border-teal-500/50 shadow-2xl' : 'border-white/10'} rounded-[2.5rem] p-10 flex flex-col space-y-8 transition-all hover:border-white/20`}>
                {plan.active && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-teal-500 text-slate-900 text-[10px] font-black uppercase px-6 py-1.5 rounded-full">{lang === 'fr' ? 'Actuel' : 'Current'}</div>
                )}
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-white tracking-widest">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-white">{plan.price}€</span>
                    <span className="text-white/40 text-sm font-bold">/mois</span>
                  </div>
                </div>
                <ul className="space-y-4 flex-1">
                  {plan.plus && (
                    <li className="text-xs font-black italic text-teal-400 mb-2">
                      {plan.plus}
                    </li>
                  )}
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-white/70">
                      <CheckCircle size={16} className="text-teal-400 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => !plan.active && handlePlanClick(plan.id || "")}
                  className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${plan.active ? 'bg-white/10 text-white/40 cursor-default' : 'bg-white text-slate-950 hover:bg-teal-400 hover:scale-[1.02]'}`}
                >
                  {plan.active ? td.btnActive : td.btnChoose}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODALE REPAIR INFO */}
      <Dialog.Root open={!!repairInfo} onOpenChange={() => setRepairInfo(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[200]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg bg-slate-900 border border-white/10 rounded-[3rem] p-12 shadow-2xl z-[201] focus:outline-none">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-500/20 rounded-3xl flex items-center justify-center text-blue-400">
                  <Info size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">{td.repairTitle}</h3>
                  <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mt-1">{repairInfo}</p>
                </div>
              </div>
              <p className="text-white/60 leading-relaxed text-sm bg-white/5 p-8 rounded-3xl border border-white/5">
                {repairInfo && getRepairExplanation(repairInfo)}
              </p>
              <button onClick={() => setRepairInfo(null)} className="w-full bg-white text-slate-950 font-black py-4 rounded-2xl hover:bg-teal-400 transition-all uppercase text-xs tracking-widest">
                {td.repairBtn}
              </button>
            </div>
            <button onClick={() => setRepairInfo(null)} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* MODALES DÉTAILS (SCORE, RISQUES, STATUT) */}
      <Dialog.Root open={!!activeModal} onOpenChange={() => setActiveModal(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-2xl bg-slate-900 border border-white/10 rounded-[3rem] p-12 shadow-2xl z-[101] focus:outline-none">
            <div className="space-y-8">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                    {activeModal === 'score' ? 'Pilier de Conformité' : activeModal === 'risques' ? 'Analyse de Sévérité' : 'Monitoring Actif'}
                  </h2>
                  <p className="text-white/40 text-sm">Rapport détaillé de notre expert RGPD.</p>
                </div>
                <button onClick={() => setActiveModal(null)} className="text-white/20 hover:text-white transition-colors p-2 bg-white/5 rounded-xl"><X size={20} /></button>
              </div>

              {activeModal === 'score' && (
                <div className="space-y-6">
                  {[
                    { label: "Consentement Explicite", val: Math.min(100, currentScore + 10), color: "bg-teal-500" },
                    { label: "Mentions Légales", val: Math.min(100, currentScore + 5), color: "bg-blue-500" },
                    { label: "Sécurité SSL", val: 100, color: "bg-purple-500" },
                    { label: "Gestion Cookies", val: currentScore, color: "bg-orange-500" }
                  ].map((p, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black text-white/60 uppercase tracking-widest">
                        <span>{p.label}</span>
                        <span>{p.val}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${p.color} rounded-full transition-all duration-1000`} style={{ width: `${p.val}%` }} />
                      </div>
                    </div>
                  ))}
                  <p className="text-sm text-white/60 p-6 bg-white/5 rounded-2xl border border-white/5 leading-relaxed">
                    Notre algorithme évalue 4 piliers fondamentaux. Une note sous les 80% expose votre entreprise à des risques de mise en demeure par les autorités de contrôle.
                  </p>
                </div>
              )}

              {activeModal === 'risques' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-6 p-8 bg-red-500/10 border border-red-500/20 rounded-3xl">
                    <AlertTriangle size={48} className="text-red-400" />
                    <div className="space-y-1">
                      <p className="text-white font-black uppercase text-xl">Vulnérabilités critiques</p>
                      <p className="text-red-400/60 text-xs font-bold uppercase tracking-widest">Action immédiate requise</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {displayAudit.criticalPoints.map((p, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl text-xs text-white/80 font-medium border border-white/5">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeModal === 'statut' && (
                <div className="space-y-8 text-center py-12">
                  <div className="w-32 h-32 rounded-full border-2 border-teal-500/20 flex items-center justify-center mx-auto relative">
                    <div className="w-20 h-20 bg-teal-500/20 rounded-full animate-pulse" />
                    <Shield size={48} className="absolute text-teal-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-black text-white uppercase tracking-tighter">Surveillance Temps Réel</p>
                    <p className="text-white/40 text-sm max-w-sm mx-auto">Votre domaine est scanné périodiquement pour détecter toute régression de conformité lors de vos mises à jour.</p>
                  </div>
                </div>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </main>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center text-teal-400 font-black tracking-widest">CHARGEMENT DE VOTRE ESPACE EXPERT...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
