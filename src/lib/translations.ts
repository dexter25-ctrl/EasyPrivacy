export type Language = 'fr' | 'en';

export const translations = {
  fr: {
    title: "VOTRE SITE EST-IL EN RÈGLE ?",
    subtitle: "Identifiez les failles juridiques de votre plateforme avant qu'il ne soit trop tard. Gratuit, instantané et précis.",
    version: "Analyseur de Conformité RGPD v2.0",
    inputPlaceholder: "votre-site.com",
    btnAudit: "LANCER L'AUDIT GRATUIT",
    btnAuditLoading: "ANALYSE EN COURS...",
    scoreTitle: "Score de Conformité",
    criticalTitle: "Points critiques détectés",
    unlockTitle: "Débloquer votre rapport",
    unlockDesc: "Entrez votre email pour recevoir les détails de votre audit et les solutions correctives.",
    btnUnlock: "VOIR LES RÉSULTATS",
    ctaTitle: "NE LAISSEZ PAS VOTRE SITE DANS L'ILLÉGALITÉ",
    ctaDesc: "Nos experts peuvent corriger tous ces points critiques en moins de 48h. Réservez une consultation gratuite pour faire le point.",
    btnContact: "CONTACTER NOTRE ÉQUIPE",
    btnOffers: "Voir nos offres de mise en conformité",
    howItWorksTitle: "Comment ça marche ?",
    howItWorksDesc: "Une conformité simplifiée en 3 étapes clés.",
    step1Title: "Scan en temps réel",
    step1Desc: "Nous analysons instantanément les scripts et cookies actifs sur votre page.",
    step2Title: "Vérification Juridique",
    step2Desc: "Nous contrôlons la présence du bandeau de consentement et des pages légales obligatoires.",
    step3Title: "Plan d'Action",
    step3Desc: "Vous recevez un score précis et la liste des correctifs à appliquer pour éviter les amendes de la CNIL.",
    pricingTitle: "Passez aux normes dès aujourd'hui",
    pricingDesc: "Choisissez la protection adaptée à votre entreprise.",
    planFree: "OFFRE TEST",
    planPro: "PRO",
    planEnterprise: "ENTREPRISE",
    planFreeDesc: "Pour tester et comprendre vos failles.",
    planProDesc: "La surveillance automatique pour les TPE/PME.",
    planEnterpriseDesc: "Le bouclier complet avec expert dédié.",
    btnStartFree: "Débuter gratuitement",
    btnStartPro: "Démarrer ce plan",
    btnStartEnterprise: "Démarrer avec l'entreprise",
    plusTest: "Tout du plan Test, plus :",
    plusPro: "Tout du plan Pro, plus :",
    faqTitle: "Foire aux questions",
    faqDesc: "Tout ce que vous devez savoir sur la conformité RGPD automatique.",
    footerBrand: "La solution automatisée pour la conformité RGPD de votre entreprise. Sécurisez votre avenir numérique.",
    footerCopyright: "© 2026 EasyPrivacy - La conformité simplifiée.",
    pricing: {
      free: ["Scan manuel illimité", "Rapport de score", "Conseils de base"],
      pro: ["Scan hebdomadaire", "Alertes email temps réel", "Générateur de politique"],
      enterprise: ["Scan quotidien", "Support prioritaire 24/7", "Expert DPO dédié", "Audit trimestriel"],
    },
    dashboard: {
      title: "Dashboard",
      subtitle: "Analyse de",
      backHome: "Accueil",
      downloadReport: "Télécharger le rapport",
      scoreTitle: "Score Global",
      risksTitle: "Risques",
      monitoringTitle: "Surveillance",
      actionPlanTitle: "Plan d'action prioritaire",
      actionPlanDesc: "Suivez ces étapes pour atteindre les 100%.",
      supportTitle: "Support Expert",
      supportDesc: "Posez vos questions techniques à un DPO.",
      subjectPlaceholder: "Objet de votre demande",
      messagePlaceholder: "Décrivez votre problématique...",
      btnSend: "Envoyer au support Pro",
      choosePlanTitle: "Choisissez votre protection",
      choosePlanDesc: "Passez au niveau supérieur pour une conformité totale et automatisée.",
      btnActive: "Plan Actif",
      btnChoose: "Choisir ce plan",
      paymentSuccess: "Paiement Réussi",
      paymentSuccessDesc: "Votre abonnement est actif. Accédez maintenant à votre plan d'action personnalisé.",
      btnClose: "Fermer",
      repairTitle: "Conseil Juridique",
      repairBtn: "J'ai compris",
      statusSecured: "Site Sécurisé",
      statusPartial: "Audit Partiel",
      statusUncompliant: "Non Conforme",
      monitoringActive: "Actif",
      monitoringLimited: "Limité",
    },
    blog: {
      title: "DOSSIERS RGPD & PRIVACY",
      subtitle: "Le Blog Expert",
      ctaTitle: "Votre site est-il conforme ?",
      ctaDesc: "Scannez-le gratuitement en 30 secondes",
      ctaBtn: "Lancer le scan gratuit",
      readingTime: "min de lecture",
      articles: [
        {
          id: 1,
          slug: "rgpd-2026-pme-amende",
          title: "RGPD en 2026 : Pourquoi 85% des PME risquent une amende (et comment l'éviter)",
          excerpt: "Les contrôles automatisés de la CNIL s'intensifient. Découvrez comment protéger votre entreprise des sanctions liées à la conformité web.",
          content: `Le paysage de la protection des données a radicalement changé. En 2026, la CNIL a déployé de nouveaux algorithmes de scan automatique capables d'auditer des milliers de sites par heure. 

### Le constat est alarmant
Selon nos dernières études, 85% des sites web de PME présentent au moins une faille critique : 
- Absence de bouton "Refuser tout" au premier niveau.
- Dépôt de traceurs publicitaires sans consentement préalable.
- Mentions légales obsolètes ou incomplètes.

### Comment éviter la sanction ?
La conformité n'est plus une option, c'est une nécessité technique. Un **audit RGPD** régulier permet d'identifier ces failles avant les autorités. La **conformité web** repose désormais sur une transparence totale vis-à-vis de l'utilisateur.

En utilisant des outils de surveillance automatisée, vous pouvez corriger ces erreurs en temps réel et éviter des **amendes CNIL** qui peuvent paralyser votre activité.`,
          category: "Légal",
          date: "29 Avril 2026",
          readTime: "5",
          image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
        },
        {
          id: 2,
          slug: "audit-rgpd-points-critiques",
          title: "Audit RGPD : Les 5 points critiques que vous ignorez sûrement",
          excerpt: "Un simple bandeau cookie ne suffit plus. Voici les failles techniques que les outils d'audit détectent en premier.",
          content: `Faire un audit ne se limite pas à regarder si un bandeau s'affiche. Voici les 5 points que nous vérifions systématiquement :
1. La durée de vie des cookies.
2. Le blocage effectif des scripts tiers.
3. L'accessibilité de la politique de confidentialité.
4. La présence d'un bouton de refus clair.
5. Le chiffrement des données de formulaires.`,
          category: "Expertise",
          date: "25 Avril 2026",
          readTime: "4",
          image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
        }
      ]
    }
  },
  en: {
    title: "IS YOUR SITE COMPLIANT?",
    subtitle: "Identify legal flaws in your platform before it's too late. Free, instant, and accurate.",
    version: "GDPR Compliance Analyzer v2.0",
    inputPlaceholder: "your-site.com",
    btnAudit: "LAUNCH FREE AUDIT",
    btnAuditLoading: "ANALYZING...",
    scoreTitle: "Compliance Score",
    criticalTitle: "Critical Points Detected",
    unlockTitle: "Unlock Your Report",
    unlockDesc: "Enter your email to receive your audit details and corrective solutions.",
    btnUnlock: "SEE RESULTS",
    ctaTitle: "DON'T LEAVE YOUR SITE IN ILLEGALITY",
    ctaDesc: "Our experts can fix all these critical points in less than 48 hours. Book a free consultation to check.",
    btnContact: "CONTACT OUR TEAM",
    btnOffers: "See our compliance offers",
    howItWorksTitle: "How it works?",
    howItWorksDesc: "Simplified compliance in 3 key steps.",
    step1Title: "Real-time Scan",
    step1Desc: "We instantly analyze active scripts and cookies on your page.",
    step2Title: "Legal Verification",
    step2Desc: "We check for the presence of the consent banner and mandatory legal pages.",
    step3Title: "Action Plan",
    step3Desc: "You receive an accurate score and a list of fixes to apply to avoid fines.",
    pricingTitle: "Get compliant today",
    pricingDesc: "Choose the protection adapted to your company.",
    planFree: "TEST OFFER",
    planPro: "PRO",
    planEnterprise: "ENTERPRISE",
    planFreeDesc: "To test and understand your flaws.",
    planProDesc: "Automatic monitoring for SMEs.",
    planEnterpriseDesc: "Complete shield with dedicated expert.",
    btnStartFree: "Start for free",
    btnStartPro: "Start this plan",
    btnStartEnterprise: "Start with Enterprise",
    plusTest: "Everything in Test plan, plus:",
    plusPro: "Everything in Pro plan, plus:",
    faqTitle: "Frequently Asked Questions",
    faqDesc: "Everything you need to know about automatic GDPR compliance.",
    footerBrand: "The automated solution for your company's GDPR compliance. Secure your digital future.",
    footerCopyright: "© 2026 EasyPrivacy - Compliance simplified.",
    pricing: {
      free: ["Unlimited manual scans", "Score report", "Basic advice"],
      pro: ["Weekly scan", "Real-time email alerts", "Policy generator"],
      enterprise: ["Daily scan", "24/7 priority support", "Dedicated DPO expert", "Quarterly audit"],
    },
    dashboard: {
      title: "Dashboard",
      subtitle: "Analysis of",
      backHome: "Home",
      downloadReport: "Download Report",
      scoreTitle: "Global Score",
      risksTitle: "Risks",
      monitoringTitle: "Monitoring",
      actionPlanTitle: "Priority Action Plan",
      actionPlanDesc: "Follow these steps to reach 100%.",
      supportTitle: "Expert Support",
      supportDesc: "Ask your technical questions to a DPO.",
      subjectPlaceholder: "Subject of your request",
      messagePlaceholder: "Describe your issue...",
      btnSend: "Send to Pro support",
      choosePlanTitle: "Choose your protection",
      choosePlanDesc: "Upgrade for total and automated compliance.",
      btnActive: "Active Plan",
      btnChoose: "Choose this plan",
      paymentSuccess: "Payment Successful",
      paymentSuccessDesc: "Your subscription is active. Access your personalized action plan now.",
      btnClose: "Close",
      repairTitle: "Legal Advice",
      repairBtn: "I understand",
      statusSecured: "Site Secured",
      statusPartial: "Partial Audit",
      statusUncompliant: "Non-Compliant",
      monitoringActive: "Active",
      monitoringLimited: "Limited",
    },
    blog: {
      title: "GDPR & PRIVACY DOSSIERS",
      subtitle: "The Expert Blog",
      ctaTitle: "Is your site compliant?",
      ctaDesc: "Scan it for free in 30 seconds",
      ctaBtn: "Launch free scan",
      readingTime: "min read",
      articles: [
        {
          id: 1,
          slug: "gdpr-2026-sme-fine",
          title: "GDPR in 2026: Why 85% of SMEs risk a fine (and how to avoid it)",
          excerpt: "Automated checks are intensifying. Discover how to protect your business from web compliance sanctions.",
          content: `The data protection landscape has radically changed. In 2026, the authorities deployed new automated scanning algorithms capable of auditing thousands of sites per hour.

### The situation is alarming
According to our latest studies, 85% of SME websites have at least one critical flaw:
- Absence of a "Decline all" button at the first level.
- Placing advertising trackers without prior consent.
- Obsolete or incomplete legal notices.

### How to avoid sanctions?
Compliance is no longer an option, it is a technical necessity. A regular **GDPR audit** helps identify these flaws before the authorities do. **Web compliance** is now based on total transparency towards the user.

By using automated monitoring tools, you can correct these errors in real-time and avoid fines that can paralyze your business.`,
          category: "Legal",
          date: "April 29, 2026",
          readTime: "5",
          image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
        },
        {
          id: 2,
          slug: "gdpr-audit-critical-points",
          title: "GDPR Audit: The 5 critical points you probably ignore",
          excerpt: "A simple cookie banner is no longer enough. Here are the technical flaws that audit tools detect first.",
          content: `Doing an audit is not just about seeing if a banner appears. Here are the 5 points we systematically check:
1. Cookie lifespan.
2. Effective blocking of third-party scripts.
3. Accessibility of the privacy policy.
4. Presence of a clear decline button.
5. Encryption of form data.`,
          category: "Expertise",
          date: "April 25, 2026",
          readTime: "4",
          image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
        }
      ]
    }
  }
};

export const faqTranslations = {
  fr: [
    {
      question: "Pourquoi la conformité RGPD est-elle obligatoire ?",
      answer: "Depuis 2018, tout site web collectant des données (cookies, formulaires, analytics) doit respecter le RGPD. C'est une obligation légale pour protéger la vie privée de vos visiteurs."
    },
    {
      question: "Quels sont les risques d'amendes avec la CNIL ?",
      answer: "Les sanctions peuvent atteindre jusqu'à 4% de votre chiffre d'affaires mondial ou 20 millions d'euros. De plus en plus de contrôles automatisés sont effectués."
    },
    {
      question: "Comment EasyPrivacy rend mon site conforme automatiquement ?",
      answer: "Notre algorithme scanne vos pages pour détecter les trackers non déclarés, vérifie vos mentions légales, et vous fournit un plan d'action immédiat."
    },
    {
      question: "Mon agence web a déjà fait le site, suis-je en règle ?",
      answer: "Pas forcément. La majorité des agences se concentrent sur le design et oublient les paramètres de consentement stricts. Un audit indépendant est recommandé."
    },
    {
      question: "Dois-je payer pour faire le test de conformité ?",
      answer: "Non, notre audit de base est 100% gratuit. Il vous permet de connaître immédiatement votre score et d'identifier vos principales failles."
    }
  ],
  en: [
    {
      question: "Why is GDPR compliance mandatory?",
      answer: "Since 2018, any website collecting data (cookies, forms, analytics) must comply with GDPR. It is a legal obligation to protect your visitors' privacy."
    },
    {
      question: "What are the risks of fines?",
      answer: "Sanctions can reach up to 4% of your global turnover or 20 million euros. More and more automated checks are being carried out."
    },
    {
      question: "How does EasyPrivacy make my site compliant automatically?",
      answer: "Our algorithm scans your pages to detect undeclared trackers, checks your legal notices, and provides you with an immediate action plan."
    },
    {
      question: "My web agency already made the site, am I in order?",
      answer: "Not necessarily. Most agencies focus on design and forget strict consent settings. An independent audit is recommended."
    },
    {
      question: "Do I have to pay for the compliance test?",
      answer: "No, our basic audit is 100% free. It allows you to immediately know your score and identify your main flaws."
    }
  ]
};
