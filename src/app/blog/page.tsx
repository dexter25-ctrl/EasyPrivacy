"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar, User, Tag, Clock, Globe, Search } from "lucide-react";
import { translations, Language } from "@/lib/translations";

export default function BlogPage() {
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
  const tb = t.blog;

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-24 relative overflow-hidden bg-[#020617]">
      {/* Background Blurs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

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

      <div className="w-full max-w-6xl z-10 space-y-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-end gap-8">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-block px-4 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-black uppercase tracking-widest"
            >
              {tb.subtitle}
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-7xl font-black text-white tracking-tighter"
            >
              {tb.title.split('&')[0]} <br /> <span className="text-teal-400">& {tb.title.split('&')[1]}</span>
            </motion.h1>
          </div>
          <Link href="/" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-2xl transition-all text-sm font-bold flex items-center gap-2">
            {lang === 'fr' ? 'Retour à l\'accueil' : 'Back to Home'}
          </Link>
        </div>

        {/* Featured Article (Magazine Style) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative aspect-[21/10] rounded-[3.5rem] overflow-hidden border border-white/10 group cursor-pointer"
        >
          <img 
            src={tb.articles[0].image} 
            alt={tb.articles[0].title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent p-12 flex flex-col justify-end space-y-6">
            <div className="flex items-center gap-3">
              <span className="bg-teal-500 text-slate-950 text-[10px] font-black uppercase px-4 py-1.5 rounded-full w-fit">Featured</span>
              <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full w-fit">{tb.articles[0].category}</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-white max-w-4xl leading-[0.95] group-hover:text-teal-400 transition-colors tracking-tighter">
              {tb.articles[0].title}
            </h2>
            <p className="text-white/60 text-xl max-w-2xl line-clamp-2 font-medium italic">
              {tb.articles[0].excerpt}
            </p>
            <div className="flex items-center gap-8 pt-4 text-white/40 text-sm font-black uppercase tracking-widest">
              <span className="flex items-center gap-2"><Calendar size={16} className="text-teal-400"/> {tb.articles[0].date}</span>
              <span className="flex items-center gap-2"><Clock size={16} className="text-teal-400"/> {tb.articles[0].readTime} {tb.readingTime}</span>
            </div>
          </div>
        </motion.div>

        {/* Article Grid (Magazine Layout) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {tb.articles.slice(1).map((article, i) => (
            <motion.div 
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-[3rem] overflow-hidden group hover:border-teal-500/30 transition-all flex flex-col"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70"
                />
                <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-full border border-white/10 uppercase tracking-widest">
                  {article.category}
                </div>
              </div>
              <div className="p-10 flex-1 flex flex-col space-y-6">
                <h3 className="text-2xl font-black text-white group-hover:text-teal-400 transition-colors leading-tight tracking-tight">
                  {article.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed flex-1 font-medium italic">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <span className="text-[10px] text-white/30 font-black uppercase tracking-widest flex items-center gap-2">
                    <Clock size={12} /> {article.readTime} min
                  </span>
                  <button className="text-teal-400 text-xs font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                    {lang === 'fr' ? 'Lire' : 'Read'} <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Magazine Style Newsletter/CTA Card */}
          <div className="bg-teal-500 rounded-[3rem] p-10 flex flex-col justify-center space-y-6 group cursor-pointer transition-transform hover:scale-[1.02]">
            <div className="w-16 h-16 bg-slate-950 rounded-[1.5rem] flex items-center justify-center text-teal-400">
              <Search size={32} />
            </div>
            <h3 className="text-3xl font-black text-slate-950 leading-none tracking-tighter">
              {tb.ctaTitle}
            </h3>
            <p className="text-slate-900/60 font-bold text-sm">
              {tb.ctaDesc}
            </p>
            <Link href="/" className="bg-slate-950 text-white font-black py-4 rounded-2xl text-center uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
              {tb.ctaBtn} <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Footer phrase */}
        <footer className="pt-24 pb-12 text-center">
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">
            © 2026 EasyPrivacy - La conformité simplifiée.
          </p>
        </footer>
      </div>
    </main>
  );
}
