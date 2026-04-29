"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Search, ShieldCheck } from "lucide-react";
import { translations, Language } from "@/lib/translations";

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [lang, setLang] = useState<Language>('fr');

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Language;
    if (savedLang) setLang(savedLang);
  }, []);

  const t = translations[lang];
  const article = t.blog.articles.find(a => a.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white space-y-4">
        <h1 className="text-4xl font-black">Article non trouvé</h1>
        <Link href="/blog" className="text-teal-400 hover:underline">Retour au blog</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-teal-500/30">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 1.5 }}
          src={article.image} 
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-400 text-[10px] font-black uppercase tracking-widest"
          >
            {article.category}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-7xl font-black max-w-5xl leading-[0.95] tracking-tighter"
          >
            {article.title}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-8 text-white/40 text-xs font-black uppercase tracking-widest"
          >
            <span className="flex items-center gap-2"><Calendar size={14} className="text-teal-400"/> {article.date}</span>
            <span className="flex items-center gap-2"><Clock size={14} className="text-teal-400"/> {article.readTime} {t.blog.readingTime}</span>
          </motion.div>
        </div>

        <Link 
          href="/blog"
          className="absolute top-12 left-12 z-50 flex items-center gap-2 text-white/40 hover:text-teal-400 transition-all text-xs font-black uppercase tracking-widest group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> {lang === 'fr' ? 'Retour au blog' : 'Back to blog'}
        </Link>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-20">
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="prose prose-invert prose-teal max-w-none"
        >
          {article.content.split('\n').map((paragraph, i) => {
            if (paragraph.startsWith('###')) {
              return <h3 key={i} className="text-2xl font-black text-white mt-12 mb-6 uppercase tracking-tight">{paragraph.replace('### ', '')}</h3>;
            }
            if (paragraph.startsWith('-')) {
              return <li key={i} className="text-white/60 mb-2 list-none flex items-center gap-3"><div className="w-1.5 h-1.5 bg-teal-500 rounded-full shrink-0" /> {paragraph.replace('- ', '')}</li>;
            }
            return <p key={i} className="text-white/60 text-lg leading-relaxed mb-6 font-medium italic">{paragraph}</p>;
          })}
        </motion.article>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-24 p-12 bg-gradient-to-br from-teal-500/20 to-blue-500/10 border border-teal-500/20 rounded-[3rem] text-center space-y-8 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-teal-500/10 transition-all" />
          <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center text-slate-950 mx-auto shadow-lg shadow-teal-500/20">
            <ShieldCheck size={32} />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-none">
              {lang === 'fr' ? 'Vérifiez votre propre site maintenant' : 'Check your own site now'}
            </h2>
            <p className="text-white/40 font-medium italic">
              {lang === 'fr' ? 'Découvrez vos failles critiques en 30 secondes.' : 'Discover your critical flaws in 30 seconds.'}
            </p>
          </div>
          <Link 
            href="/"
            className="inline-block bg-white text-slate-950 font-black px-12 py-5 rounded-2xl hover:scale-105 transition-all shadow-xl uppercase text-xs tracking-widest"
          >
            {t.blog.ctaBtn}
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 text-center">
        <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">
          © 2026 EasyPrivacy - La conformité simplifiée.
        </p>
      </footer>
    </main>
  );
}
