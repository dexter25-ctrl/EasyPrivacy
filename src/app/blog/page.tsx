"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar, User, Tag } from "lucide-react";

const articles = [
  {
    id: 1,
    title: "RGPD 2026 : Pourquoi votre site risque une amende dès demain",
    excerpt: "Les contrôles automatisés s'intensifient. Découvrez les 3 points critiques que la CNIL surveille en priorité cette année.",
    date: "29 Avril 2026",
    author: "Expert EasyPrivacy",
    category: "Légal",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "Cookies tiers : La fin d'une ère et comment s'y préparer",
    excerpt: "Le passage au 'Cookieless' change la donne. Voici comment maintenir vos analytics sans enfreindre la loi.",
    date: "25 Avril 2026",
    author: "Équipe Technique",
    category: "Technique",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "5 erreurs classiques sur votre page Mentions Légales",
    excerpt: "Une page bâclée est une porte ouverte aux sanctions. Vérifiez ces 5 points essentiels dès maintenant.",
    date: "20 Avril 2026",
    author: "DPO Conseil",
    category: "Conformité",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800",
  }
];

export default function BlogPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-24 relative overflow-hidden bg-[#020617]">
      {/* Background Blurs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-6xl z-10 space-y-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-end gap-8">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-block px-4 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-black uppercase tracking-widest"
            >
              Le Blog Expert
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-7xl font-black text-white tracking-tighter"
            >
              DOSSIERS <br /> <span className="text-teal-400">RGPD & PRIVACY</span>
            </motion.h1>
          </div>
          <Link href="/" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-2xl transition-all text-sm font-bold flex items-center gap-2">
            Retour à l'accueil
          </Link>
        </div>

        {/* Featured Article */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative aspect-[21/9] rounded-[3rem] overflow-hidden border border-white/10 group cursor-pointer"
        >
          <img 
            src={articles[0].image} 
            alt={articles[0].title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent p-12 flex flex-col justify-end space-y-4">
            <span className="bg-teal-500 text-slate-950 text-[10px] font-black uppercase px-3 py-1 rounded-full w-fit">À LA UNE</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white max-w-3xl leading-tight group-hover:text-teal-400 transition-colors">
              {articles[0].title}
            </h2>
            <p className="text-white/60 text-lg max-w-2xl line-clamp-2">
              {articles[0].excerpt}
            </p>
            <div className="flex items-center gap-6 pt-4 text-white/40 text-sm font-medium">
              <span className="flex items-center gap-2"><Calendar size={14}/> {articles[0].date}</span>
              <span className="flex items-center gap-2"><User size={14}/> {articles[0].author}</span>
            </div>
          </div>
        </motion.div>

        {/* Article Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.slice(1).map((article, i) => (
            <motion.div 
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden group hover:border-teal-500/30 transition-all flex flex-col"
            >
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full">
                  {article.category}
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col space-y-4">
                <h3 className="text-xl font-black text-white group-hover:text-teal-400 transition-colors leading-tight">
                  {article.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed flex-1">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-[10px] text-white/30 font-bold">{article.date}</span>
                  <button className="text-teal-400 text-xs font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                    Lire <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Empty Placeholders */}
          {[1, 2].map((n) => (
            <div key={n} className="bg-white/[0.02] border border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center p-12 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/10">
                <Tag size={24} />
              </div>
              <p className="text-white/10 font-black text-xs uppercase tracking-widest">Article à venir</p>
            </div>
          ))}
        </div>

        {/* Footer phrase */}
        <footer className="pt-24 pb-12 text-center">
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
            © 2026 EasyPrivacy - La conformité simplifiée.
          </p>
        </footer>
      </div>
    </main>
  );
}
