"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "../components/Navbar";
import {
  Globe, Monitor, Smartphone, Layers, Shield, Wrench,
  CheckCircle, DollarSign, Clock, type LucideIcon
} from "lucide-react";
import Footer from "../components/Footer";
import { useApp } from "../i18n/AppContext";

function ScanLine() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{ y: ["-5%", "105%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear", repeatDelay: 4 }}
        className="absolute left-0 right-0 h-[2px]"
        style={{ background: "linear-gradient(90deg, transparent, rgba(0,153,255,0.5), rgba(0,198,255,0.8), rgba(0,153,255,0.5), transparent)" }}
      />
    </div>
  );
}


export default function ServicesPage() {
  const { lang } = useApp();
  const isFr = lang === "fr";
  const services: {
    icon: LucideIcon; title: string; subtitle: string;
    price: string; delay: string; features: string[];
    tech: string[]; color: string; gradient: string;
  }[] = [
    {
      icon: Globe,
      title: isFr ? "Création de sites web" : "Website creation",
      subtitle: isFr ? "Design premium & responsive" : "Premium responsive design",
      price: isFr ? "Dès 200 000 FCFA" : "From 200,000 XOF",
      delay: isFr ? "15-30 jours" : "15-30 days",
      features: isFr
        ? ["Sites vitrines professionnels","Sites e-commerce complets","Applications web sur mesure","Design responsive (mobile, tablette, PC)","Optimisation SEO incluse","Hébergement et domaine 1ère année offerts"]
        : ["Professional showcase websites","Complete e-commerce websites","Custom web applications","Responsive design for mobile, tablet and desktop","SEO optimization included","Hosting and domain included for the 1st year"],
      tech: ["Next.js","React","Tailwind"], color: "#0099FF", gradient: "from-[#0066FF]/20 to-[#0099FF]/5",
    },
    {
      icon: Monitor,
      title: isFr ? "Logiciels de gestion" : "Management software",
      subtitle: isFr ? "Pour commerces et PME" : "For shops and SMEs",
      price: isFr ? "Dès 400 000 FCFA" : "From 400,000 XOF",
      delay: isFr ? "30-45 jours" : "30-45 days",
      features: isFr
        ? ["Logiciel de caisse pour alimentation","Gestion de stock pour boutique/magasin","CRM pour gérer vos clients","Rapports journaliers automatiques","Multi-utilisateurs avec rôles","Formation complète de votre équipe"]
        : ["POS software for food stores","Inventory management for shops and stores","CRM to manage your customers","Automatic daily reports","Multi-user roles and permissions","Complete team training"],
      tech: ["Electron","Node.js","MongoDB"], color: "#FF6B00", gradient: "from-[#FF6B00]/20 to-[#FF9A3C]/5",
    },
    {
      icon: Smartphone,
      title: isFr ? "Applications mobiles" : "Mobile applications",
      subtitle: isFr ? "Android & iOS natives" : "Native Android & iOS",
      price: isFr ? "Dès 600 000 FCFA" : "From 600,000 XOF",
      delay: isFr ? "45-60 jours" : "45-60 days",
      features: isFr
        ? ["Applications Android & iOS","App de livraison et commande","App de gestion client","Paiement Mobile Money intégré","Notifications push","Publication Play Store & App Store"]
        : ["Android and iOS applications","Delivery and ordering apps","Customer management apps","Integrated Mobile Money payment","Push notifications","Play Store and App Store publication"],
      tech: ["React Native","Firebase","Stripe"], color: "#00C48C", gradient: "from-[#00C48C]/20 to-[#00E0A0]/5",
    },
    {
      icon: Layers,
      title: isFr ? "ERP pour entreprises" : "Enterprise ERP",
      subtitle: isFr ? "Système de gestion intégré" : "Integrated management system",
      price: isFr ? "Dès 1 000 000 FCFA" : "From 1,000,000 XOF",
      delay: isFr ? "60-90 jours" : "60-90 days",
      features: isFr
        ? ["RH — Gestion du personnel complète","Comptabilité intégrée et automatisée","Gestion des stocks et ventes","Facturation automatique","Tableau de bord décisionnel","Accès multi-succursales"]
        : ["HR — complete staff management","Integrated and automated accounting","Inventory and sales management","Automatic invoicing","Decision dashboard","Multi-branch access"],
      tech: ["Next.js","PostgreSQL","Docker"], color: "#9B93FF", gradient: "from-[#9B93FF]/20 to-[#BDB5FF]/5",
    },
    {
      icon: Shield,
      title: isFr ? "Cybersécurité" : "Cybersecurity",
      subtitle: isFr ? "Protection de vos données" : "Protect your data",
      price: isFr ? "Dès 150 000 FCFA" : "From 150,000 XOF",
      delay: isFr ? "7-14 jours" : "7-14 days",
      features: isFr
        ? ["Audit de sécurité complet","Protection contre les cyberattaques","Antivirus entreprise premium","Sauvegarde automatique des données","Formation anti-phishing","Plan de reprise après sinistre"]
        : ["Full security audit","Protection against cyberattacks","Premium enterprise antivirus","Automatic data backup","Anti-phishing training","Disaster recovery plan"],
      tech: ["Bitdefender","CrowdStrike","Cisco"], color: "#FF4757", gradient: "from-[#FF4757]/20 to-[#FF6B7A]/5",
    },
    {
      icon: Wrench,
      title: isFr ? "Maintenance informatique" : "IT maintenance",
      subtitle: isFr ? "Préventive & corrective" : "Preventive & corrective",
      price: isFr ? "Dès 80 000 FCFA / mois" : "From 80,000 XOF / month",
      delay: isFr ? "Intervention sous 24h" : "Response within 24h",
      features: isFr
        ? ["Maintenance préventive mensuelle","Maintenance corrective 24/7","Dépannage ordinateurs et réseaux","Optimisation des performances","Gestion des sauvegardes","Support technique illimité"]
        : ["Monthly preventive maintenance","24/7 corrective maintenance","Computer and network troubleshooting","Performance optimization","Backup management","Unlimited technical support"],
      tech: ["TeamViewer","AnyDesk","Remote"], color: "#0066FF", gradient: "from-[#0066FF]/20 to-[#0099FF]/5",
    },
  ];

  const process = [
    { num: "01", title: isFr ? "Consultation" : "Consultation", desc: isFr ? "Échange gratuit pour comprendre vos besoins et objectifs" : "Free discussion to understand your needs and goals" },
    { num: "02", title: isFr ? "Devis détaillé" : "Detailed quote", desc: isFr ? "Proposition personnalisée avec planning et budget clair" : "Personalized proposal with clear timeline and budget" },
    { num: "03", title: isFr ? "Développement" : "Development", desc: isFr ? "Réalisation de votre projet avec points d'avancement réguliers" : "Project build with regular progress reviews" },
    { num: "04", title: isFr ? "Livraison" : "Delivery", desc: isFr ? "Tests, formation et mise en production complète" : "Testing, training and full production launch" },
    { num: "05", title: "Support", desc: isFr ? "Accompagnement continu et maintenance selon vos besoins" : "Continuous support and maintenance based on your needs" },
  ];

  const testimonials = [
    { name: "Konan Kouassi", company: "Supermarché Abidjan", text: isFr ? "SORA TECH a révolutionné notre gestion. Nos ventes ont augmenté de 30% en 3 mois !" : "SORA TECH revolutionized our management. Sales increased by 30% in 3 months!", rating: 5 },
    { name: "Aminata Traoré", company: "Boutique Aminata Fashion", text: isFr ? "Le site e-commerce est magnifique. Service client au top !" : "The e-commerce website is beautiful. Excellent client service!", rating: 5 },
    { name: "Dr. Coulibaly", company: "Cabinet Médical Cocody", text: isFr ? "L'ERP médical nous fait gagner des heures chaque jour. Équipe très professionnelle." : "The medical ERP saves us hours every day. Very professional team.", rating: 5 },
  ];

  const faqs = isFr ? [
    { q: "Combien de temps prend un projet en moyenne ?", a: "Cela dépend de la complexité. Un site vitrine prend 15-30 jours, un ERP complet 60-90 jours. Nous donnons toujours un planning précis dans le devis." },
    { q: "Est-ce que vous faites des paiements échelonnés ?", a: "Oui ! Nous acceptons un acompte de 50% au démarrage puis le solde à la livraison. Pour les gros projets, nous proposons des paiements en 3 ou 4 fois." },
    { q: "Le support après livraison est-il inclus ?", a: "Oui, nous offrons 1 an de garantie gratuit sur tous nos projets. Après cette période, vous pouvez souscrire un contrat de maintenance annuel." },
    { q: "Travaillez-vous avec des clients hors Abidjan ?", a: "Absolument ! Nous servons toute la Côte d'Ivoire et la sous-région. Les réunions se font en visio, et nous nous déplaçons pour les gros projets." },
    { q: "Comment se passe la première consultation ?", a: "Prenez RDV via notre page Devis & RDV. La consultation est gratuite (30-60 min), en ligne ou en présentiel à Abidjan, et vous repartez avec un devis personnalisé." },
  ] : [
    { q: "How long does a project usually take?", a: "It depends on complexity. A showcase website takes 15-30 days, while a full ERP takes 60-90 days. We always provide a precise timeline in the quote." },
    { q: "Do you offer installment payments?", a: "Yes. We accept a 50% deposit at launch and the balance at delivery. For larger projects, we can split payments into 3 or 4 installments." },
    { q: "Is post-delivery support included?", a: "Yes, every project includes a free one-year warranty. After that, you can choose an annual maintenance contract." },
    { q: "Do you work with clients outside Abidjan?", a: "Absolutely. We serve all of Côte d'Ivoire and the sub-region. Meetings can be remote, and we travel for major projects." },
    { q: "How does the first consultation work?", a: "Book through the Quote & Meeting page. The consultation is free, lasts 30-60 minutes, online or in Abidjan, and ends with a personalized quote." },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#0066FF] rounded-full blur-[150px] opacity-10 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#0099FF] rounded-full blur-[150px] opacity-10 animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <Navbar active="services" />

      {/* HERO */}
      <section className="relative py-24 md:py-32 px-6 text-center z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(#1a2540 1px, transparent 1px), linear-gradient(90deg, #1a2540 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <ScanLine />
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-[#0A1A3A] border border-[#0066FF] text-[#0099FF] text-xs tracking-[2px] px-4 py-1.5 rounded-full mb-6" style={{ boxShadow: "0 0 20px rgba(0,102,255,0.2)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />
            {isFr ? "NOS 6 EXPERTISES PREMIUM" : "OUR 6 PREMIUM EXPERTISES"}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-4xl md:text-7xl font-black leading-tight mb-6 tracking-tight">
            {isFr ? "Solutions" : "Custom"}{" "}
            <motion.span animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 5, repeat: Infinity }} className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] via-[#0099FF] to-[#FF6B00]" style={{ backgroundSize: "200% 200%" }}>
              {isFr ? "digitales" : "digital"}
            </motion.span>
            <br />{isFr ? "sur-mesure" : "solutions"}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-[var(--muted)] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {isFr
              ? "De la création de votre site web à la mise en place d'un ERP complet, nous accompagnons chaque étape de votre transformation digitale."
              : "From website creation to full ERP deployment, we support every step of your digital transformation."}
          </motion.p>
        </div>
      </section>

      {/* STATS */}
      <section className="relative border-y border-[#1a2540] backdrop-blur py-8 px-6 z-10" style={{ background: "var(--bg2)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { num: "6", label: isFr ? "EXPERTISES" : "EXPERTISES", color: "#0099FF" },
            { num: "100%", label: isFr ? "SUR MESURE" : "CUSTOM", color: "#FF6B00" },
            { num: "24/7", label: "SUPPORT", color: "#00C48C" },
            { num: isFr ? "1 AN" : "1 YEAR", label: isFr ? "GARANTIE" : "WARRANTY", color: "#9B93FF" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="text-3xl font-black font-mono" style={{ color: s.color }}>{s.num}</div>
              <div className="text-[10px] text-[var(--muted)] tracking-widest mt-1 font-mono">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SERVICES CARDS */}
      <section className="relative py-20 px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <div className="text-[10px] tracking-[4px] text-[#0099FF] mb-2 font-mono">{isFr ? "// CATALOGUE_COMPLET" : "// FULL_CATALOG"}</div>
            <h2 className="text-3xl md:text-5xl font-black">{isFr ? "Choisissez votre solution" : "Choose your solution"}</h2>
            <p className="text-[var(--muted)] mt-3 text-sm max-w-xl mx-auto">
              {isFr ? "Cliquez sur un service pour obtenir un devis personnalisé gratuit" : "Click a service to get a free personalized quote"}
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -8, boxShadow: `0 20px 60px ${service.color}30` }}
                className={`relative bg-gradient-to-br ${service.gradient} backdrop-blur border border-[#1a2540] rounded-2xl p-8 transition-all duration-300 cursor-pointer overflow-hidden group`}
              >
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition" style={{ backgroundColor: service.color }} />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                        style={{ backgroundColor: `${service.color}15`, border: `1px solid ${service.color}40`, boxShadow: `0 0 20px ${service.color}20` }}
                      >
                        <service.icon className="w-8 h-8" style={{ color: service.color }} />
                      </div>
                      <h3 className="text-2xl font-black mb-1">{service.title}</h3>
                      <p className="text-xs text-[var(--muted)] mb-4 font-mono">{service.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 mb-5 flex-wrap">
                    <div className="bg-[#080F20]/80 border border-[#1a2540] px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5" style={{ color: service.color }}>
                      <DollarSign className="w-3 h-3" /> {service.price}
                    </div>
                    <div className="bg-[#080F20]/80 border border-[#1a2540] px-3 py-1.5 rounded-xl text-xs font-bold text-[var(--muted)] flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> {service.delay}
                    </div>
                  </div>
                  <ul className="space-y-2 mb-5">
                    {service.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: service.color }} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2 flex-wrap mb-5">
                    {service.tech.map((t, k) => (
                      <span key={k} className="text-[10px] bg-[#080F20] border border-[#1a2540] px-2 py-1 rounded font-mono text-[var(--muted)]">{t}</span>
                    ))}
                  </div>
                  <Link href="/devis">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3 rounded-xl font-bold text-sm transition" style={{ backgroundColor: service.color, color: "#fff" }}>
                      {isFr ? "Demander un devis gratuit →" : "Request a free quote →"}
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESSUS */}
      <section className="relative py-20 px-6 backdrop-blur z-10" style={{ background: "var(--bg2)" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="text-[10px] tracking-[4px] text-[#FF6B00] mb-2 font-mono">{isFr ? "// COMMENT_ÇA_MARCHE" : "// HOW_IT_WORKS"}</div>
            <h2 className="text-3xl md:text-5xl font-black">{isFr ? "Notre processus en 5 étapes" : "Our 5-step process"}</h2>
          </motion.div>
          <div className="grid md:grid-cols-5 gap-4">
            {process.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative rounded-xl p-5 hover:border-[#0066FF] hover:shadow-[0_0_20px_rgba(0,102,255,0.15)] transition-all duration-300 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <div className="text-3xl font-black font-mono mb-2" style={{ color: "rgba(0,153,255,0.3)" }}>{p.num}</div>
                <h3 className="text-sm font-bold mb-2">{p.title}</h3>
                <p className="text-xs text-[var(--muted)] leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="relative py-20 px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="text-[10px] tracking-[4px] text-[#00C48C] mb-2 font-mono">{isFr ? "// AVIS_CLIENTS" : "// CLIENT_REVIEWS"}</div>
            <h2 className="text-3xl md:text-5xl font-black">{isFr ? "Ils nous font confiance" : "They trust us"}</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }} className="backdrop-blur border hover:border-[#00C48C] transition-all duration-300 rounded-2xl p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <div className="flex gap-1 mb-4">{Array.from({ length: t.rating }).map((_, k) => <span key={k} className="text-[#FFD700]">★</span>)}</div>
                <p className="text-sm italic mb-5 leading-relaxed" style={{ color: "var(--text)" }}>&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-[#1a2540]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0066FF] to-[#0099FF] flex items-center justify-center text-xs font-black">{t.name.split(' ').map(n => n[0]).join('')}</div>
                  <div><div className="text-sm font-bold">{t.name}</div><div className="text-xs text-[var(--muted)]">{t.company}</div></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-20 px-6 backdrop-blur z-10" style={{ background: "var(--bg2)" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="text-[10px] tracking-[4px] text-[#9B93FF] mb-2 font-mono">{"// FAQ"}</div>
            <h2 className="text-3xl md:text-5xl font-black">{isFr ? "Tout ce qu'il faut savoir" : "Everything you need to know"}</h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <motion.details key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="border hover:border-[#0066FF] rounded-xl overflow-hidden transition-all duration-300 group" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <summary className="cursor-pointer p-5 flex justify-between items-center font-bold text-sm list-none">
                  <span>{f.q}</span>
                  <span className="text-[#0099FF] group-open:rotate-45 transition-transform text-xl ml-4 flex-shrink-0">+</span>
                </summary>
                <div className="px-5 pb-5 text-sm text-[var(--muted)] leading-relaxed">{f.a}</div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 px-6 text-center z-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-3xl mx-auto bg-gradient-to-br from-[#0066FF]/20 via-[#0099FF]/10 to-[#FF6B00]/10 border border-[#0066FF] rounded-3xl p-10 md:p-14 backdrop-blur relative overflow-hidden" style={{ boxShadow: "0 0 60px rgba(0,102,255,0.15)" }}>
          <ScanLine />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-4">{isFr ? "Prêt à commencer ?" : "Ready to get started?"}</h2>
            <p className="text-[var(--muted)] mb-8">
              {isFr ? "Obtenez votre devis personnalisé en moins de 2 minutes — gratuit et sans engagement" : "Get your personalized quote in under 2 minutes, free and no obligation"}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
<Link href="/devis"><motion.button whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,102,255,0.5)" }} whileTap={{ scale: 0.95 }} className="bg-[#0066FF] px-8 py-3.5 rounded-xl font-bold text-sm">{isFr ? "Demander un devis" : "Request a quote"}</motion.button></Link>
<motion.a href="https://wa.me/2250704928068" target="_blank" rel="noopener" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-[#25D366] px-8 py-3.5 rounded-xl font-bold text-sm">💬 WhatsApp direct</motion.a>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
