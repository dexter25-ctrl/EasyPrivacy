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
  ExternalLink, 
  Download, 
  Info, 
  ChevronRight, 
  Search, 
  Mail, 
  Lock,
  ArrowRight,
  FileText
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  const [activeModal, setActiveModal] = useState<"score" | "risques" | "statut" | null>(null);

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

  // Calcul du score dynamique
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
      "Absence de bouton 'Tout Refuser'": "Conformément aux directives de la CNIL, refuser les cookies doit être aussi simple que de les accepter. Ajoutez un bouton explicite au même niveau visuel que le bouton d'acceptation.",
      "Google Analytics activé sans consentement": "Ce traceur collecte des données personnelles. Il doit rester inactif jusqu'à l'obtention du consentement explicite via votre bandeau cookie.",
      "Mentions légales incomplètes": "Votre site doit obligatoirement identifier son éditeur, son hébergeur et ses coordonnées de contact pour être en règle avec la LCEN.",
      "Pixel Facebook détecté avant accord": "Le Pixel Facebook est un traceur tiers hautement intrusif. Son exécution doit être strictement conditionnée à un accord positif de l'utilisateur.",
      "SSL expiré ou mal configuré": "La sécurité SSL est le socle de la protection des données. Un certificat invalide expose les données de vos clients et nuit à votre SEO.",
      "Absence de politique de confidentialité": "Vous devez informer vos utilisateurs sur la manière dont vous traitez leurs données. Créez une page dédiée accessible depuis votre footer."
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
    
    doc.setTextColor(100, 100, 100);
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
      headStyles: { fillStyle: [45, 212, 191], textColor: [255, 255, 255] }
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
                <h3 className="text-emerald-400 font-black uppercase tracking-widest text-xs">Paiement Réussi</h3>
                <p className="text-white font-medium text-sm">Votre abonnement Pro est actif. Accédez maintenant à votre plan d'action personnalisé.</p>
              </div>
            </div>
            <button onClick={() => setShowSuccessBanner(false)} className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl text-xs font-black uppercase transition-all">Masquer</button>
          </div>
        )}

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
              Dashboard <Shield className="text-teal-400" size={32} />
            </h1>
            <div className="flex items-center gap-2">
              <p className="text-white/40 text-sm">Analyse de <span className="text-white font-bold">{displayAudit.url}</span></p>
              {isPro && <span className="px-2 py-0.5 bg-teal-500/10 text-teal-400 border border-teal-500/30 rounded-full text-[10px] font-black uppercase tracking-widest">Plan Pro</span>}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-2xl transition-all text-sm font-bold flex items-center gap-2">
              <ArrowRight size={16} className="rotate-180" /> Accueil
            </Link>
            <button onClick={generatePDF} disabled={!isPro} className={`${isPro ? 'bg-gradient-to-r from-teal-500 to-blue-600 shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:scale-105' : 'bg-white/5 opacity-50 cursor-not-allowed'} text-white font-bold px-8 py-3 rounded-2xl transition-all flex items-center gap-2`}>
              <Download size={18} /> Rapport PDF
            </button>
          </div>
        </div>

        {/* BENTO GRID STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Donut Score */}
          <div onClick={() => setActiveModal("score")} className="relative group overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 transition-all hover:border-teal-500/50 shadow-2xl cursor-pointer">
            <div className="relative space-y-6">
              <h3 className="text-white/60 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                <Shield size={14} className="text-teal-400" /> Score Global
              </h3>
              <div className="flex items-center gap-8">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="48" cy="48" r="44" className="stroke-white/5" strokeWidth="8" fill="none" />
                    <circle 
                      cx="48" cy="48" r="44" 
                      className="stroke-teal-500 transition-all duration-1000 ease-out" 
                      strokeWidth="8" 
                      fill="none"
                      strokeDasharray="276"
                      strokeDashoffset={276 - (276 * currentScore) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-3xl font-black text-white">{currentScore}%</span>
                </div>
                <div>
                  <p className="text-teal-400 font-black text-xs uppercase">Conformité</p>
                  <p className="text-white/40 text-[10px] mt-1 italic">Basé sur 24 points de contrôle</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Risks Severity */}
          <div onClick={() => setActiveModal("risques")} className="relative group overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 transition-all hover:border-red-500/50 shadow-2xl cursor-pointer">
            <div className="relative space-y-6">
              <h3 className="text-white/60 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                <AlertTriangle size={14} className="text-red-400" /> Risques
              </h3>
              <div className="flex items-end justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-6xl font-black text-white">{risksCount}</span>
                  <p className={`text-[10px] font-black uppercase ${risksCount > 0 ? 'text-red-400' : 'text-teal-400'}`}>Failles critiques</p>
                </div>
                <div className="flex gap-1 items-end h-12">
                  <div className={`w-3 rounded-t-sm ${risksCount > 5 ? 'bg-red-500 h-full' : 'bg-red-500/20 h-1/2'}`} />
                  <div className={`w-3 rounded-t-sm ${risksCount > 2 ? 'bg-orange-500 h-2/3' : 'bg-orange-500/20 h-1/3'}`} />
                  <div className={`w-3 rounded-t-sm ${risksCount > 0 ? 'bg-yellow-500 h-1/2' : 'bg-yellow-500/20 h-1/4'}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Realtime Status */}
          <div onClick={() => setActiveModal("statut")} className="relative group overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 transition-all hover:border-blue-500/50 shadow-2xl cursor-pointer">
            <div className="relative space-y-6">
              <h3 className="text-white/60 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                <CheckCircle size={14} className="text-blue-400" /> Surveillance
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full animate-ping ${currentScore > 80 ? 'bg-teal-400' : currentScore > 50 ? 'bg-orange-400' : 'bg-red-500'}`} />
                  <span className="text-2xl font-black text-white">{currentScore > 80 ? 'Site Sécurisé' : 'Non Conforme'}</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-white/40 font-bold uppercase">Fréquence</span>
                  <span className="text-[10px] text-teal-400 font-black uppercase tracking-widest">{isPro ? 'Temps Réel' : '24h'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION PLAN & CONTACT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Interactive Checklist (Plan Pro Value) */}
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 space-y-8 relative overflow-hidden">
            <div className="flex justify-between items-center relative z-10">
              <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                <FileText className="text-blue-400" size={24} /> Plan d'action prioritaire
              </h3>
            </div>

            <div className="space-y-3 relative z-10">
              {isPro ? (
                displayAudit.criticalPoints.map((point, i) => (
                  <div key={i} className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all ${completedTasks.includes(point) ? 'bg-teal-500/10 border-teal-500/30 opacity-60' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                    <button 
                      onClick={() => toggleTask(point)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${completedTasks.includes(point) ? 'bg-teal-500 text-slate-900 shadow-[0_0_15px_rgba(45,212,191,0.4)]' : 'border-2 border-white/20 hover:border-teal-500/50'}`}
                    >
                      {completedTasks.includes(point) && <CheckCircle size={16} strokeWidth={3} />}
                    </button>
                    <span className={`flex-1 text-sm font-bold ${completedTasks.includes(point) ? 'text-teal-400 line-through' : 'text-white'}`}>{point}</span>
                    <button onClick={() => setRepairInfo(point)} className="text-white/20 hover:text-blue-400 transition-all p-1 hover:bg-white/5 rounded-lg">
                      <Info size={20} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white/20">
                    <Lock size={32} />
                  </div>
                  <div className="space-y-2 max-w-xs">
                    <p className="text-white font-bold">Contenu exclusif Pro</p>
                    <p className="text-white/40 text-xs italic">Débloquez votre guide juridique étape par étape pour corriger vos {taskCount} failles.</p>
                  </div>
                  <button onClick={() => handlePlanClick(process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO || "")} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest shadow-xl transition-all">
                    Débloquer le Plan d'action
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 flex flex-col justify-between space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-teal-500/20 rounded-2xl flex items-center justify-center text-teal-400">
                <Mail size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">Conseil Juridique</h3>
                <p className="text-white/40 text-sm">Une question ? Un expert vous répond en 6h.</p>
              </div>
            </div>
            <form onSubmit={handleSendEmail} className="space-y-4">
              <input 
                type="text" required value={contactSubject} onChange={(e) => setContactSubject(e.target.value)}
                placeholder="Objet de la demande"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white text-sm focus:border-teal-500 transition-all outline-none"
              />
              <textarea 
                required value={contactMessage} onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Expliquez-nous votre besoin..." rows={4}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white text-sm focus:border-teal-500 transition-all outline-none resize-none"
              />
              <button type="submit" className="w-full bg-white text-slate-950 font-black py-4 rounded-xl hover:bg-teal-400 transition-all shadow-xl uppercase text-xs tracking-widest">
                Envoyer le message
              </button>
            </form>
          </div>
        </div>

        {/* PRICING SECTION */}
        <div className="pt-20 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Évoluez vers la sérénité</h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto italic">Votre conformité ne devrait pas être un stress. Choisissez le bouclier qui vous correspond.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {/* Plans identical to Home but with "Plan Actuel" logic */}
            {[
              { 
                name: "OFFRE TEST", price: "0", 
                features: ["Scan manuel", "Rapport de base", "Score global"], 
                isPro: false, color: "teal", id: "" 
              },
              { 
                name: "PRO", price: "29", 
                features: ["Plan d'action", "Alertes 24/7", "Rapports PDF", "Surveillance"], 
                isPro: true, color: "blue", id: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO 
              },
              { 
                name: "ENTREPRISE", price: "79", 
                features: ["Expert dédié", "Correctifs automatiques", "Support VIP", "Scan quotidien"], 
                isPro: true, color: "purple", id: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE 
              }
            ].map((plan, i) => (
              <div key={i} className={`relative bg-white/5 backdrop-blur-xl border ${(!isPro && plan.price === "0") || (isPro && plan.price === "29") ? 'border-teal-500/50 scale-105 z-20' : 'border-white/10'} rounded-[2.5rem] p-10 flex flex-col space-y-8 transition-all hover:border-white/20 shadow-2xl`}>
                {((!isPro && plan.price === "0") || (isPro && plan.price === "29")) && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-teal-500 text-slate-900 text-[10px] font-black uppercase px-6 py-1.5 rounded-full shadow-xl">Actuel</div>
                )}
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-white uppercase tracking-widest">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-white">{plan.price}€</span>
                    <span className="text-white/40 text-sm font-bold">/mois</span>
                  </div>
                </div>
                <ul className="space-y-4 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-white/70 font-medium">
                      <CheckCircle size={18} className="text-teal-400 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => plan.id && handlePlanClick(plan.id)}
                  className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${((!isPro && plan.price === "0") || (isPro && plan.price === "29")) ? 'bg-white/10 text-white/40 cursor-default' : 'bg-white text-slate-950 hover:bg-teal-400 hover:scale-[1.02]'}`}
                >
                  {((!isPro && plan.price === "0") || (isPro && plan.price === "29")) ? "Actif" : "Choisir ce plan"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* REPAIR INFO MODAL */}
      <Dialog.Root open={!!repairInfo} onOpenChange={() => setRepairInfo(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[200]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg bg-slate-900 border border-white/10 rounded-[3rem] p-12 shadow-[0_0_100px_rgba(0,0,0,0.5)] z-[201] focus:outline-none">
            <div className="space-y-8 text-center">
              <div className="w-20 h-20 bg-blue-500/20 rounded-3xl flex items-center justify-center text-blue-400 mx-auto">
                <Info size={40} />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Conseil Juridique</h3>
                <p className="text-blue-400 text-sm font-black uppercase tracking-widest">{repairInfo}</p>
              </div>
              <p className="text-white/60 leading-relaxed text-sm bg-white/5 p-8 rounded-3xl border border-white/5">
                {repairInfo && getRepairExplanation(repairInfo)}
              </p>
              <button onClick={() => setRepairInfo(null)} className="w-full bg-white text-slate-950 font-black py-4 rounded-2xl hover:bg-teal-400 transition-all uppercase text-xs tracking-widest">
                J'ai compris
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* OTHER MODALS */}
      <Dialog.Root open={!!activeModal} onOpenChange={() => setActiveModal(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-2xl bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl z-[101] focus:outline-none">
            <div className="space-y-6">
              <Dialog.Title className="text-2xl font-black text-white uppercase">{activeModal === 'score' ? 'Détail du Score' : activeModal === 'risques' ? 'Analyse des Risques' : 'État de la Surveillance'}</Dialog.Title>
              <p className="text-white/40 leading-relaxed">Cette section fournit une analyse approfondie des vecteurs de conformité. En tant qu'expert RGPD, nous évaluons plus de 24 points de contrôle techniques et juridiques pour garantir la sécurité de votre domaine.</p>
              <button onClick={() => setActiveModal(null)} className="w-full bg-white/10 text-white font-bold py-3 rounded-xl uppercase text-xs">Fermer</button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </main>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center text-teal-400 font-black">CHARGEMENT DU DASHBOARD...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
