"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, Eye } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white p-6 sm:p-24 relative overflow-hidden">
      {/* Background Blurs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto space-y-16 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-teal-400 transition-colors text-xs font-black uppercase tracking-widest">
          <ArrowLeft size={16} /> Retour
        </Link>

        <div className="space-y-4">
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter">POLITIQUE DE <br /><span className="text-teal-400">CONFIDENTIALITÉ</span></h1>
          <p className="text-white/40 text-lg italic">Dernière mise à jour : 29 avril 2026</p>
        </div>

        <div className="grid gap-12 text-white/70 leading-relaxed font-medium">
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-white uppercase flex items-center gap-3">
              <ShieldCheck className="text-teal-400" /> 1. Collecte des données
            </h2>
            <p>
              EasyPrivacy s'engage à ce que la collecte et le traitement de vos données soient conformes au Règlement Général sur la Protection des Données (RGPD). Nous ne collectons que les données strictement nécessaires à la fourniture de nos services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-white uppercase flex items-center gap-3">
              <Lock className="text-teal-400" /> 2. Utilisation des services tiers
            </h2>
            <p>
              Pour assurer le bon fonctionnement de notre plateforme, nous utilisons les services suivants :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Stripe :</strong> Pour la gestion sécurisée des paiements. Aucune coordonnée bancaire ne transite par nos serveurs.</li>
              <li><strong>Resend :</strong> Pour l'envoi d'emails transactionnels (rapports d'audit, confirmations d'achat).</li>
              <li><strong>Clerk :</strong> Pour la gestion de l'authentification et de la sécurité des comptes utilisateurs.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-white uppercase flex items-center gap-3">
              <Eye className="text-teal-400" /> 3. Cookies et Traceurs
            </h2>
            <p>
              Nous utilisons des cookies pour améliorer votre expérience utilisateur. Vous pouvez à tout moment modifier vos préférences via le bouclier de gestion des cookies présent sur chaque page. 
              Les cookies analytiques ne sont déposés qu'avec votre consentement explicite.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-white uppercase">4. Vos droits</h2>
            <p>
              Conformément à la réglementation, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition au traitement de vos données. Pour exercer ces droits, contactez-nous à : <span className="text-teal-400">dextoolstudio@gmail.com</span>.
            </p>
          </section>
        </div>

        <footer className="pt-24 border-t border-white/5 text-center">
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
            © 2026 EasyPrivacy - La conformité simplifiée.
          </p>
        </footer>
      </div>
    </main>
  );
}
