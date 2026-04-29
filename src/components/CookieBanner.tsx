"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, X, Check, Cookie } from "lucide-react";
import Link from "next/link";

export type ConsentSettings = {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
};

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState<ConsentSettings>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const savedConsent = localStorage.getItem("cookie-consent");
    if (!savedConsent) {
      setShowBanner(true);
    } else {
      setConsent(JSON.parse(savedConsent));
    }
  }, []);

  const saveConsent = (newConsent: ConsentSettings) => {
    localStorage.setItem("cookie-consent", JSON.stringify(newConsent));
    setConsent(newConsent);
    setShowBanner(false);
    setShowSettings(false);
    // Ici on pourrait déclencher le chargement des scripts (GTM, Pixel, etc.)
    console.log("Consentement enregistré :", newConsent);
  };

  const acceptAll = () => {
    saveConsent({ essential: true, analytics: true, marketing: true });
  };

  const declineAll = () => {
    saveConsent({ essential: true, analytics: false, marketing: false });
  };

  return (
    <>
      {/* Bouton flottant pour rouvrir les réglages */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setShowSettings(true)}
        className="fixed bottom-6 left-6 z-[100] w-12 h-12 bg-slate-900 border border-white/10 rounded-full flex items-center justify-center text-teal-400 shadow-2xl hover:bg-slate-800 transition-all"
        title="Réglages des cookies"
      >
        <Shield size={20} />
      </motion.button>

      <AnimatePresence>
        {showBanner && !showSettings && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 right-6 left-6 sm:left-auto sm:max-w-md z-[101]"
          >
            <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-2xl space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-teal-500/20 rounded-2xl flex items-center justify-center text-teal-400 shrink-0">
                  <Cookie size={24} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-white font-black uppercase tracking-widest text-xs">Gestion des Cookies</h3>
                  <p className="text-white/50 text-xs leading-relaxed font-medium">
                    Nous utilisons des cookies pour améliorer votre expérience et analyser notre trafic. En cliquant sur "Tout accepter", vous consentez à l'utilisation de tous nos cookies.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={acceptAll}
                  className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl transition-all text-[10px] uppercase tracking-widest"
                >
                  Tout accepter
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={declineAll}
                    className="py-3 bg-white/5 hover:bg-white/10 text-white font-black rounded-xl transition-all text-[10px] uppercase tracking-widest border border-white/10"
                  >
                    Tout refuser
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="py-3 bg-white/5 hover:bg-white/10 text-white font-black rounded-xl transition-all text-[10px] uppercase tracking-widest border border-white/10"
                  >
                    Personnaliser
                  </button>
                </div>
              </div>
              
              <p className="text-center">
                <Link href="/privacy" className="text-[10px] text-white/30 hover:text-teal-400 transition-colors uppercase font-black tracking-widest">
                  Politique de confidentialité
                </Link>
              </p>
            </div>
          </motion.div>
        )}

        {showSettings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[102] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
          >
            <div className="bg-slate-900 border border-white/10 rounded-[3rem] p-10 max-w-lg w-full shadow-2xl space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Réglages des cookies</h2>
                <button onClick={() => setShowSettings(false)} className="text-white/20 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Essential */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">Cookies Essentiels</p>
                    <p className="text-xs text-white/40">Nécessaires au fonctionnement du site.</p>
                  </div>
                  <div className="w-10 h-6 bg-teal-500/50 rounded-full flex items-center px-1">
                    <div className="w-4 h-4 bg-teal-400 rounded-full" />
                  </div>
                </div>

                {/* Analytics */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">Analyse d'audience</p>
                    <p className="text-xs text-white/40">Nous aide à comprendre l'utilisation du site.</p>
                  </div>
                  <button 
                    onClick={() => setConsent(prev => ({ ...prev, analytics: !prev.analytics }))}
                    className={`w-10 h-6 rounded-full flex items-center px-1 transition-all ${consent.analytics ? 'bg-teal-500' : 'bg-white/10'}`}
                  >
                    <motion.div 
                      animate={{ x: consent.analytics ? 16 : 0 }}
                      className="w-4 h-4 bg-white rounded-full shadow-md" 
                    />
                  </button>
                </div>

                {/* Marketing */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">Marketing & Publicité</p>
                    <p className="text-xs text-white/40">Utilisé pour des publicités ciblées.</p>
                  </div>
                  <button 
                    onClick={() => setConsent(prev => ({ ...prev, marketing: !prev.marketing }))}
                    className={`w-10 h-6 rounded-full flex items-center px-1 transition-all ${consent.marketing ? 'bg-teal-500' : 'bg-white/10'}`}
                  >
                    <motion.div 
                      animate={{ x: consent.marketing ? 16 : 0 }}
                      className="w-4 h-4 bg-white rounded-full shadow-md" 
                    />
                  </button>
                </div>
              </div>

              <button
                onClick={() => saveConsent(consent)}
                className="w-full py-4 bg-white text-slate-950 font-black rounded-2xl transition-all text-[10px] uppercase tracking-widest hover:bg-teal-400"
              >
                Enregistrer mes choix
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
