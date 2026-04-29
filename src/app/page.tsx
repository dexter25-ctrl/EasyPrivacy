"use client";

import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useUser, useClerk, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Minus, ChevronDown, CheckCircle2, Shield, FileText, Globe } from "lucide-react";
import { translations, faqTranslations, Language } from "@/lib/translations";

export default function Home() {
  const [lang, setLang] = useState<Language>('fr');

  // Charger la langue au démarrage
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
  const faqs = faqTranslations[lang];
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const router = useRouter();
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Pré-remplir l'email si l'utilisateur est connecté
  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      setModalEmail(user.primaryEmailAddress.emailAddress);
    }
  }, [user]);

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
      const auditResult = {
        score: data.score,
        criticalPoints: data.criticalPoints,
        url: url,
        date: new Date().toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric' })
      };

      setResult(auditResult);

      // Sauvegarder dans le localStorage pour le dashboard
      localStorage.setItem("lastAudit", JSON.stringify(auditResult));
    } catch (err: any) {
      setError(err.message || "Impossible d'effectuer l'audit pour le moment.");
    } finally {
      setLoading(false);
    }
  };


  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (email || user) {
      setIsUnlocked(true);
    }
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailToSend = user?.primaryEmailAddress?.emailAddress || modalEmail;
    if (!emailToSend || !result) return;

    try {
      await fetch("https://script.google.com/macros/s/AKfycbwLJQxpc6ggHKHZlRqW9JiSN77CfInyWw4Rqtz7dbKy0_wXtWHIvuwA8FYJpIbNM57-/exec", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailToSend,
          url: url,
          score: result.score
        })
      });
      setModalSuccess(true);
      setTimeout(() => {
        closeItems();
      }, 3000);
    } catch (err) {
      // Fallback: montrer le succès quand même pour l'UX si le webhook bloque sur une erreur réseau
      setModalSuccess(true);
      setTimeout(() => closeItems(), 3000);
    }
  };

  const handlePlanClick = async (priceId: string) => {
    if (!priceId) return;

    if (!isSignedIn) {
      router.push("/sign-up");
      return;
    }

    try {
      setLoading(true);
      const lastAuditStr = localStorage.getItem("lastAudit");
      const lastAudit = lastAuditStr ? JSON.parse(lastAuditStr) : null;
      
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          priceId, 
          auditUrl: lastAudit?.url, 
          auditScore: lastAudit?.score 
        }),
      });
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      // Erreur silencieuse en prod
    } finally {
      setLoading(false);
    }
  };

  const closeItems = () => {
    setIsModalOpen(false);
    setModalSuccess(false);
    setModalEmail("");
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-24 relative overflow-hidden">
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

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl z-10 space-y-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-6"
        >
          <div className="inline-block px-5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-black uppercase tracking-[0.2em] mb-4">
            {t.version}
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-white to-blue-200 leading-[0.9]">
            {t.title.split('?')[0]}? <br className="hidden sm:block" /> <span className="text-teal-400">{t.title.split('?')[1]}</span>
          </h1>
          <p className="text-white/50 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Input Panel */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative group transition-all hover:border-teal-500/30 ring-1 ring-white/5"
        >
          <form onSubmit={handleAudit} className="flex flex-col sm:flex-row gap-5">
            <div className="flex-1 relative">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={t.inputPlaceholder}
                required
                className="w-full bg-black/60 border border-white/10 rounded-2xl px-7 py-5 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all text-lg font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="group relative overflow-hidden bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-slate-950 font-black px-12 py-5 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-teal-500/20 flex items-center justify-center gap-3 min-w-[280px]"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center gap-2 text-sm uppercase tracking-widest">
                {loading ? t.btnAuditLoading : (
                  <>
                    {t.btnAudit}
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Search size={18} strokeWidth={3} />
                    </motion.div>
                  </>
                )}
              </span>
            </button>
          </form>
          {error && <p className="text-red-400 mt-6 text-center font-bold flex items-center justify-center gap-2 bg-red-400/10 py-3 rounded-xl border border-red-400/20">
            <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            {error}
          </p>}
        </motion.div>

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
                <h2 className="text-xl text-white/80 font-bold uppercase tracking-widest">{t.scoreTitle}</h2>
                <div className="relative flex items-center justify-center w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="84" className="stroke-white/5" strokeWidth="16" fill="none" />
                    <circle
                      cx="96"
                      cy="96"
                      r="84"
                      className={`${result.score > 80 ? 'stroke-teal-400' : result.score > 50 ? 'stroke-yellow-400' : 'stroke-red-500'}`}
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={2 * Math.PI * 84}
                      strokeDashoffset={2 * Math.PI * 84 * (1 - result.score / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-6xl font-black text-white">{result.score}%</span>
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
                    {t.criticalTitle}
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
                        {user ? (
                          <p className="text-teal-400 text-sm font-medium">
                            Connecté en tant que <span className="text-white">{user.primaryEmailAddress?.emailAddress}</span>. <br />Le rapport vous sera envoyé directement.
                          </p>
                        ) : (
                          <p className="text-white/60 text-sm">Entrez votre email pour recevoir les détails de votre audit et les solutions correctives.</p>
                        )}
                      </div>

                      {!user ? (
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
                      ) : (
                        <button
                          onClick={() => handleUnlock()}
                          className="w-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-3 rounded-xl transition-all shadow-lg shadow-teal-500/20"
                        >
                          DÉCOUVRIR MES RÉSULTATS
                        </button>
                      )}
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
                    {t.ctaTitle}
                  </h3>
                  <p className="text-teal-100/60 max-w-xl mx-auto">
                    {t.ctaDesc}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                      href="mailto:dextoolstudio@gmail.com?subject=Demande de RDV EasyPrivacy"
                      className="bg-white text-slate-900 font-black px-10 py-4 rounded-2xl hover:scale-105 transition-all shadow-xl text-center uppercase text-xs tracking-widest"
                    >
                      {t.btnContact}
                    </Link>
                    <Link
                      href="/dashboard"
                      className="text-white/60 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer"
                    >
                      {t.btnOffers}
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section Comment ça marche */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="pt-24 pb-8 space-y-16"
        >
          <div className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter">{t.howItWorksTitle}</h2>
            <p className="text-white/40 text-xl font-medium max-w-xl mx-auto italic">{t.howItWorksDesc}</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {/* Étape 1 */}
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 text-center space-y-8 hover:border-teal-500/30 transition-all group relative overflow-hidden">
              <div className="absolute inset-0 bg-teal-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <div className="w-20 h-20 bg-teal-500/10 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform relative z-10">
                <Search className="w-10 h-10 text-teal-400" />
              </div>
              <div className="relative z-10 space-y-4">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">{t.step1Title}</h3>
                <p className="text-white/50 text-sm leading-relaxed font-medium">
                  {t.step1Desc}
                </p>
              </div>
            </div>

            {/* Étape 2 */}
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 text-center space-y-8 hover:border-blue-500/30 transition-all group relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform relative z-10">
                <Shield className="w-10 h-10 text-blue-400" />
              </div>
              <div className="relative z-10 space-y-4">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">{t.step2Title}</h3>
                <p className="text-white/50 text-sm leading-relaxed font-medium">
                  {t.step2Desc}
                </p>
              </div>
            </div>

            {/* Étape 3 */}
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 text-center space-y-8 hover:border-teal-400/30 transition-all group relative overflow-hidden">
              <div className="absolute inset-0 bg-teal-400/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <div className="w-20 h-20 bg-teal-400/10 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform relative z-10">
                <FileText className="w-10 h-10 text-teal-300" />
              </div>
              <div className="relative z-10 space-y-4">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">{t.step3Title}</h3>
                <p className="text-white/50 text-sm leading-relaxed font-medium">
                  {t.step3Desc}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pricing Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="pt-24 pb-8 space-y-16"
        >
          <div className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter">{t.pricingTitle}</h2>
            <p className="text-white/40 text-xl font-medium max-w-xl mx-auto italic">{t.pricingDesc}</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Plan 1: OFFRE TEST */}
            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 flex flex-col space-y-8 hover:border-white/30 transition-all group shadow-2xl relative overflow-hidden">
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-white tracking-widest">{t.planFree}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white">0€</span>
                  <span className="text-white/40 text-sm font-black uppercase">{lang === 'fr' ? '/ à vie' : '/ forever'}</span>
                </div>
                <p className="text-white/40 text-sm font-medium italic">{t.planFreeDesc}</p>
              </div>
              <ul className="space-y-4 flex-1">
                {t.pricing.free.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/70 font-medium">
                    <CheckCircle2 size={18} className="text-teal-400 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link 
                href="/dashboard"
                className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black transition-all text-center uppercase text-xs tracking-widest"
              >
                {t.btnStartFree}
              </Link>
            </div>

            {/* Plan 2: Pro */}
            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 flex flex-col space-y-8 hover:border-teal-500/30 transition-all group shadow-2xl relative overflow-hidden">
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-white tracking-widest">{t.planPro}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white">29€</span>
                  <span className="text-white/40 text-sm font-black uppercase">{lang === 'fr' ? '/ mois' : '/ month'}</span>
                </div>
                <p className="text-white/40 text-sm font-medium italic">{t.planProDesc}</p>
              </div>
              <ul className="space-y-4 flex-1">
                <li className="text-xs font-black italic text-teal-400 mb-2">
                  {t.plusTest}
                </li>
                {t.pricing.pro.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/70 font-medium">
                    <CheckCircle2 size={18} className="text-teal-400 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handlePlanClick(process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO || '')}
                disabled={loading}
                className="w-full py-5 rounded-2xl bg-teal-500/10 border border-teal-500/30 hover:bg-teal-500 hover:text-slate-950 text-teal-400 font-black transition-all text-center disabled:opacity-50 uppercase text-xs tracking-widest shadow-lg shadow-teal-500/5"
              >
                {loading ? (lang === 'fr' ? "Chargement..." : "Loading...") : t.btnStartPro}
              </button>
            </div>

            {/* Plan 3: Entreprise */}
            <div className="relative group">
              <div className="absolute -inset-[2px] bg-gradient-to-r from-teal-500 via-blue-600 to-teal-500 rounded-[2.5rem] blur-md opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>
              <div className="relative bg-[#0a0f1d] backdrop-blur-3xl rounded-[2.5rem] p-10 flex flex-col space-y-8 shadow-2xl h-full border border-white/5">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-teal-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full shadow-xl">
                  {lang === 'fr' ? 'Recommandé' : 'Recommended'}
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-white tracking-widest">{t.planEnterprise}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-white">79€</span>
                    <span className="text-white/40 text-sm font-black uppercase">{lang === 'fr' ? '/ mois' : '/ month'}</span>
                  </div>
                  <p className="text-white/40 text-sm font-medium italic">{t.planEnterpriseDesc}</p>
                </div>
                <ul className="space-y-4 flex-1">
                  <li className="text-xs font-black italic text-blue-400 mb-2">
                    {t.plusPro}
                  </li>
                  {t.pricing.enterprise.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-white/70 font-medium">
                      <CheckCircle2 size={18} className="text-teal-400 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => {
                    const id = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTREPRISE;
                    handlePlanClick(id || '');
                  }}
                  disabled={loading}
                  className="w-full py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 hover:scale-[1.02] active:scale-[0.98] text-white font-black transition-all text-center disabled:opacity-50 uppercase text-xs tracking-widest shadow-2xl shadow-blue-500/20"
                >
                  {loading ? (lang === 'fr' ? "Chargement..." : "Loading...") : t.btnStartEnterprise}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
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

      {/* FAQ Section */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl mx-auto mt-32 space-y-12 px-4 sm:px-0 relative z-10"
      >
        <div className="text-center space-y-4">
          <h2 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter">{t.faqTitle}</h2>
          <p className="text-white/40 text-xl font-medium max-w-xl mx-auto italic">{t.faqDesc}</p>
        </div>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`bg-white/5 backdrop-blur-3xl border ${openFaq === index ? 'border-teal-500/50 shadow-[0_0_30px_rgba(45,212,191,0.1)]' : 'border-white/10'} rounded-3xl overflow-hidden transition-all duration-500 hover:border-teal-500/30`}
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-8 text-left focus:outline-none group"
              >
                <span className={`text-xl font-black transition-colors duration-300 ${openFaq === index ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openFaq === index ? 45 : 0 }}
                  transition={{ duration: 0.3, ease: "backOut" }}
                  className={`flex-shrink-0 ml-4 w-10 h-10 rounded-2xl flex items-center justify-center transition-colors duration-300 ${openFaq === index ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/30' : 'bg-white/5 text-white/40'}`}
                >
                  <Plus size={24} strokeWidth={3} />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                  >
                    <div className="p-8 pt-0 text-white/50 text-lg leading-relaxed font-medium border-t border-white/5 mt-2 bg-gradient-to-b from-white/5 to-transparent">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 bg-black/20 backdrop-blur-md mt-24 py-16 px-6 sm:px-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-24">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="relative">
                <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_8px_rgba(45,212,191,0.4)]">
                  <defs>
                    <linearGradient id="shieldGradFooter" x1="20" y1="20" x2="80" y2="80">
                      <stop offset="0%" stopColor="#2dd4bf" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  <path d="M50 5 L15 20 V50 C15 75 50 95 50 95 C50 95 85 75 85 50 V20 L50 5Z" fill="url(#shieldGradFooter)" />
                  <path d="M50 12 L22 24 V50 C22 70 50 85 50 85 C50 85 78 70 78 50 V24 L50 12Z" fill="black" fillOpacity="0.2" />
                  <path d="M40 50 L47 57 L60 43" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-xl font-black text-white tracking-tighter">EasyPrivacy</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              {t.footerBrand}
            </p>
          </div>

           {/* Produit */}
          <div className="space-y-6">
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs">Produit</h4>
            <ul className="space-y-4">
              <li>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-white/40 hover:text-teal-400 transition-colors text-sm font-medium"
                >
                  Audit en direct
                </button>
              </li>
              <li>
                <Link 
                  href="/dashboard"
                  className="text-white/40 hover:text-teal-400 transition-colors text-sm font-medium"
                >
                  Tarifs & Plans
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog"
                  className="text-white/40 hover:text-teal-400 transition-colors text-sm font-medium"
                >
                  Blog Expert
                </Link>
              </li>
            </ul>
          </div>

           {/* Légal */}
          <div className="space-y-6">
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs">Légal</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/legal" className="text-white/40 hover:text-teal-400 transition-colors text-sm font-medium">Mentions Légales</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/40 hover:text-teal-400 transition-colors text-sm font-medium">Politique de Confidentialité</Link>
              </li>
              <li>
                <button 
                  onClick={() => {
                    localStorage.removeItem("cookie-consent");
                    window.location.reload();
                  }} 
                  className="text-white/40 hover:text-teal-400 transition-colors text-sm font-medium"
                >
                  Gestion des Cookies
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">
            {t.footerCopyright}
          </p>
          
          <div className="flex items-center gap-8">
            <div className="flex gap-4">
              {['Twitter', 'LinkedIn', 'Github'].map((social) => (
                <a key={social} href="#" className="text-white/20 hover:text-teal-400 transition-colors text-[10px] font-black uppercase tracking-widest">{social}</a>
              ))}
            </div>
            <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse shadow-[0_0_10px_rgba(45,212,191,0.5)]" title="Système opérationnel"></div>
          </div>
        </div>
      </footer>
    </main>
  );
}
