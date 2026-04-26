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
  const { t } = useApp();
  const s = t.services;
  const services: {
    icon: LucideIcon; title: string; subtitle: string;
    price: string; delay: string; features: string[];
    tech: string[]; color: string; gradient: string;
  }[] = [
    {
      icon: Globe, title: "Création de sites web", subtitle: "Design premium & responsive",
      price: "Dès 200 000 FCFA", delay: "15-30 jours",
      features: ["Sites vitrines professionnels","Sites e-commerce complets","Applications web sur mesure","Design responsive (mobile, tablette, PC)","Optimisation SEO incluse","Hébergement et domaine 1ère année offerts"],
      tech: ["Next.js","React","Tailwind"], color: "#0099FF", gradient: "from-[#0066FF]/20 to-[#0099FF]/5",
    },
    {
      icon: Monitor, title: "Logiciels de gestion", subtitle: "Pour commerces et PME",
      price: "Dès 400 000 FCFA", delay: "30-45 jours",
      features: ["Logiciel de caisse pour alimentation","Gestion de stock pour boutique/magasin","CRM pour gérer vos clients","Rapports journaliers automatiques","Multi-utilisateurs avec rôles","Formation complète de votre équipe"],
      tech: ["Electron","Node.js","MongoDB"], color: "#FF6B00", gradient: "from-[#FF6B00]/20 to-[#FF9A3C]/5",
    },
    {
      icon: Smartphone, title: "Applications mobiles", subtitle: "Android & iOS natives",
      price: "Dès 600 000 FCFA", delay: "45-60 jours",
      features: ["Applications Android & iOS","App de livraison et commande","App de gestion client","Paiement Mobile Money intégré","Notifications push","Publication Play Store & App Store"],
      tech: ["React Native","Firebase","Stripe"], color: "#00C48C", gradient: "from-[#00C48C]/20 to-[#00E0A0]/5",
    },
    {
      icon: Layers, title: "ERP pour entreprises", subtitle: "Système de gestion intégré",
      price: "Dès 1 000 000 FCFA", delay: "60-90 jours",
      features: ["RH — Gestion du personnel complète","Comptabilité intégrée et automatisée","Gestion des stocks et ventes","Facturation automatique","Tableau de bord décisionnel","Accès multi-succursales"],
      tech: ["Next.js","PostgreSQL","Docker"], color: "#9B93FF", gradient: "from-[#9B93FF]/20 to-[#BDB5FF]/5",
    },
    {
      icon: Shield, title: "Cybersécurité", subtitle: "Protection de vos données",
      price: "Dès 150 000 FCFA", delay: "7-14 jours",
      features: ["Audit de sécurité complet","Protection contre les cyberattaques","Antivirus entreprise premium","Sauvegarde automatique des données","Formation anti-phishing","Plan de reprise après sinistre"],
      tech: ["Bitdefender","CrowdStrike","Cisco"], color: "#FF4757", gradient: "from-[#FF4757]/20 to-[#FF6B7A]/5",
    },
    {
      icon: Wrench, title: "Maintenance informatique", subtitle: "Préventive & corrective",
      price: "Dès 80 000 FCFA / mois", delay: "Intervention sous 24h",
      features: ["Maintenance préventive mensuelle","Maintenance corrective 24/7","Dépannage ordinateurs et réseaux","Optimisation des performances","Gestion des sauvegardes","Support technique illimité"],
      tech: ["TeamViewer","AnyDesk","Remote"], color: "#0066FF", gradient: "from-[#0066FF]/20 to-[#0099FF]/5",
    },
  ];

  const process = [
    { num: "01", title: "Consultation",   desc: "Échange gratuit pour comprendre vos besoins et objectifs" },
    { num: "02", title: "Devis détaillé", desc: "Proposition personnalisée avec planning et budget clair" },
    { num: "03", title: "Développement",  desc: "Réalisation de votre projet avec points d'avancement réguliers" },
    { num: "04", title: "Livraison",      desc: "Tests, formation et mise en production complète" },
    { num: "05", title: "Support",        desc: "Accompagnement continu et maintenance selon vos besoins" },
  ];

  const testimonials = [
    { name: "Konan Kouassi", company: "Supermarché Abidjan", text: "SORA TECH a révolutionné notre gestion. Nos ventes ont augmenté de 30% en 3 mois !", rating: 5 },
    { name: "Aminata Traoré", company: "Boutique Aminata Fashion", text: "Le site e-commerce est magnifique. Service client au top !", rating: 5 },
    { name: "Dr. Coulibaly", company: "Cabinet Médical Cocody", text: "L'ERP médical nous fait gagner des heures chaque jour. Équipe très professionnelle.", rating: 5 },
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
            NOS 6 EXPERTISES PREMIUM
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-4xl md:text-7xl font-black leading-tight mb-6 tracking-tight">
            Solutions{" "}
            <motion.span animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 5, repeat: Infinity }} className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] via-[#0099FF] to-[#FF6B00]" style={{ backgroundSize: "200% 200%" }}>
              digitales
            </motion.span>
            <br />sur-mesure
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-[var(--muted)] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            De la création de votre site web à la mise en place d&apos;un ERP complet, nous accompagnons chaque étape de votre transformation digitale.
          </motion.p>
        </div>
      </section>

      {/* STATS */}
      <section className="relative border-y border-[#1a2540] backdrop-blur py-8 px-6 z-10" style={{ background: "var(--bg2)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[{ num: "6", label: "EXPERTISES", color: "#0099FF" },{ num: "100%", label: "SUR MESURE", color: "#FF6B00" },{ num: "24/7", label: "SUPPORT", color: "#00C48C" },{ num: "1 AN", label: "GARANTIE", color: "#9B93FF" }].map((s, i) => (
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
            <div className="text-[10px] tracking-[4px] text-[#0099FF] mb-2 font-mono">// CATALOGUE_COMPLET</div>
            <h2 className="text-3xl md:text-5xl font-black">Choisissez votre solution</h2>
            <p className="text-[var(--muted)] mt-3 text-sm max-w-xl mx-auto">Cliquez sur un service pour obtenir un devis personnalisé gratuit</p>
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
                      Demander un devis gratuit →
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESSUS */}
      <section className="relative py-20 px-6 backdrop-blur" style={{ background: "var(--bg2)" }} z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="text-[10px] tracking-[4px] text-[#FF6B00] mb-2 font-mono">// COMMENT_ÇA_MARCHE</div>
            <h2 className="text-3xl md:text-5xl font-black">Notre processus en 5 étapes</h2>
          </motion.div>
          <div className="grid md:grid-cols-5 gap-4">
            {process.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative bg-[#0A1525]/80 border border-[#1a2540] rounded-xl p-5 hover:border-[#0066FF] hover:shadow-[0_0_20px_rgba(0,102,255,0.15)] transition-all duration-300">
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
            <div className="text-[10px] tracking-[4px] text-[#00C48C] mb-2 font-mono">// AVIS_CLIENTS</div>
            <h2 className="text-3xl md:text-5xl font-black">Ils nous font confiance</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }} className="backdrop-blur border" style={{ background: "var(--card)", borderColor: "var(--border)" }} hover:border-[#00C48C] transition-all duration-300 rounded-2xl p-6">
                <div className="flex gap-1 mb-4">{Array.from({ length: t.rating }).map((_, k) => <span key={k} className="text-[#FFD700]">★</span>)}</div>
                <p className="text-sm text-white italic mb-5 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
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
      <section className="relative py-20 px-6 backdrop-blur" style={{ background: "var(--bg2)" }} z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="text-[10px] tracking-[4px] text-[#9B93FF] mb-2 font-mono">// FAQ</div>
            <h2 className="text-3xl md:text-5xl font-black">Tout ce qu&apos;il faut savoir</h2>
          </motion.div>
          <div className="space-y-3">
            {[
              { q: "Combien de temps prend un projet en moyenne ?",     a: "Cela dépend de la complexité. Un site vitrine prend 15-30 jours, un ERP complet 60-90 jours. Nous donnons toujours un planning précis dans le devis." },
              { q: "Est-ce que vous faites des paiements échelonnés ?", a: "Oui ! Nous acceptons un acompte de 50% au démarrage puis le solde à la livraison. Pour les gros projets, nous proposons des paiements en 3 ou 4 fois." },
              { q: "Le support après livraison est-il inclus ?",        a: "Oui, nous offrons 1 an de garantie gratuit sur tous nos projets. Après cette période, vous pouvez souscrire un contrat de maintenance annuel." },
              { q: "Travaillez-vous avec des clients hors Abidjan ?",   a: "Absolument ! Nous servons toute la Côte d'Ivoire et la sous-région. Les réunions se font en visio, et nous nous déplaçons pour les gros projets." },
              { q: "Comment se passe la première consultation ?",       a: "Prenez RDV via notre page Devis & RDV. La consultation est gratuite (30-60 min), en ligne ou en présentiel à Abidjan, et vous repartez avec un devis personnalisé." },
            ].map((f, i) => (
              <motion.details key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="bg-[#0A1525]/80 border border-[#1a2540] hover:border-[#0066FF] rounded-xl overflow-hidden transition-all duration-300 group">
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
            <h2 className="text-3xl md:text-5xl font-black mb-4">Prêt à commencer ?</h2>
            <p className="text-[var(--muted)] mb-8">Obtenez votre devis personnalisé en moins de 2 minutes — gratuit et sans engagement</p>
            <div className="flex gap-4 justify-center flex-wrap">
<Link href="/devis"><motion.button whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,102,255,0.5)" }} whileTap={{ scale: 0.95 }} className="bg-[#0066FF] px-8 py-3.5 rounded-xl font-bold text-sm">Demander un devis</motion.button></Link>
<motion.a href="https://wa.me/2250704928068" target="_blank" rel="noopener" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-[#25D366] px-8 py-3.5 rounded-xl font-bold text-sm">💬 WhatsApp direct</motion.a>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
