"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Building, Server, Mail } from "lucide-react";

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white p-6 sm:p-24 relative overflow-hidden">
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto space-y-16 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-teal-400 transition-colors text-xs font-black uppercase tracking-widest">
          <ArrowLeft size={16} /> Retour
        </Link>

        <div className="space-y-4">
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-blue-400 uppercase">Mentions <br /><span className="text-white">Légales</span></h1>
          <p className="text-white/40 text-lg italic">EasyPrivacy - Transparence & Conformité</p>
        </div>

        <div className="grid gap-12 text-white/70 leading-relaxed font-medium">
          <section className="space-y-4 bg-white/5 p-8 rounded-[2rem] border border-white/5">
            <h2 className="text-2xl font-black text-white uppercase flex items-center gap-3">
              <Building className="text-blue-400" /> Éditeur du site
            </h2>
            <div className="space-y-1 text-sm">
              <p className="text-white font-bold">EasyPrivacy SaaS</p>
              <p>Auto-entreprise DexStudio</p>
              <p>SIRET : En cours d'immatriculation</p>
              <p>Siège social : Paris, France</p>
              <p>Directeur de la publication : Jamy L.</p>
            </div>
          </section>

          <section className="space-y-4 bg-white/5 p-8 rounded-[2rem] border border-white/5">
            <h2 className="text-2xl font-black text-white uppercase flex items-center gap-3">
              <Server className="text-blue-400" /> Hébergement
            </h2>
            <div className="space-y-1 text-sm">
              <p className="text-white font-bold">Vercel Inc.</p>
              <p>440 N Barranca Ave #4133</p>
              <p>Covina, CA 91723</p>
              <p>États-Unis</p>
              <p><Link href="https://vercel.com" className="text-blue-400">https://vercel.com</Link></p>
            </div>
          </section>

          <section className="space-y-4 bg-white/5 p-8 rounded-[2rem] border border-white/5">
            <h2 className="text-2xl font-black text-white uppercase flex items-center gap-3">
              <Mail className="text-blue-400" /> Contact
            </h2>
            <p className="text-sm">
              Pour toute question concernant le site ou nos services, vous pouvez nous contacter par email à l'adresse suivante : <br />
              <span className="text-blue-400 font-bold">dextoolstudio@gmail.com</span>
            </p>
          </section> section 
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
