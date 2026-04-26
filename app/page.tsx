"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import {
  Globe, Monitor, Smartphone, Layers, Shield, Wrench,
  Zap, Award, MapPin, Lock, ShoppingCart, GraduationCap,
  type LucideIcon
} from "lucide-react";
import { useApp } from "./i18n/AppContext";

const BackgroundFX = dynamic(() => import("./components/BackgroundFX"), { ssr: false });
import Footer from "./components/Footer";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const duration = 2000;
        const start = Date.now();
        const tick = () => {
          const p = Math.min((Date.now() - start) / duration, 1);
          const e = 1 - Math.pow(1 - p, 3);
          setCount(Math.floor(e * target));
          if (p < 1) requestAnimationFrame(tick);
          else setCount(target);
        };
        tick();
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <div ref={ref} className="font-mono">{count}{suffix}</div>;
}

function ScanLine() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div animate={{ y: ["-5%", "105%"] }} transition={{ duration: 8, repeat: Infinity, ease: "linear", repeatDelay: 4 }}
        className="absolute left-0 right-0 h-[2px]"
        style={{ background: "linear-gradient(90deg, transparent, rgba(0,153,255,0.5), rgba(0,198,255,0.8), rgba(0,153,255,0.5), transparent)" }} />
    </div>
  );
}

function IconBox({ icon: Icon, color }: { icon: LucideIcon; color: string }) {
  return (
    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
      style={{ backgroundColor: `${color}15`, border: `1px solid ${color}40`, boxShadow: `0 0 20px ${color}15` }}>
      <Icon className="w-7 h-7" style={{ color }} />
    </div>
  );
}

export default function Home() {
  const { t } = useApp();
  const h = t.home;
  const [trackCode, setTrackCode] = useState('');

  const statColors = ["#0099FF", "#FF6B00", "#00C48C", "#9B93FF"];

  const services: { icon: LucideIcon; title: string; desc: string; color: string }[] = [
    { icon: Globe,      title: t.lang === "fr" ? "Sites web" : "Web sites",             desc: t.lang === "fr" ? "Sites vitrines et e-commerce premium sur mesure"  : "Premium showcase and e-commerce sites", color: "#0099FF" },
    { icon: Monitor,    title: t.lang === "fr" ? "Logiciels de gestion" : "Management software", desc: t.lang === "fr" ? "Caisse, stock, CRM pour commerces et PME" : "POS, stock, CRM for businesses",        color: "#FF6B00" },
    { icon: Smartphone, title: t.lang === "fr" ? "Applications mobiles" : "Mobile apps", desc: t.lang === "fr" ? "Apps Android & iOS natives pour votre business"  : "Native Android & iOS apps for your business", color: "#00C48C" },
    { icon: Layers,     title: "ERP",                                                    desc: t.lang === "fr" ? "RH, comptabilité, ventes, stock intégrés"         : "HR, accounting, sales, stock integrated", color: "#9B93FF" },
    { icon: Shield,     title: t.lang === "fr" ? "Cybersécurité" : "Cybersecurity",    desc: t.lang === "fr" ? "Audit, protection et formation anti-piratage"       : "Audit, protection and anti-piracy training", color: "#FF4757" },
    { icon: Wrench,     title: t.lang === "fr" ? "Maintenance IT" : "IT Maintenance",  desc: t.lang === "fr" ? "Support 24/7, préventive et corrective"             : "24/7 support, preventive and corrective", color: "#0066FF" },
  ];

  const whyUs: { icon: LucideIcon; title: string; desc: string; link: string }[] = [
    { icon: Zap,   title: t.lang === "fr" ? "Rapidité"  : "Speed",    desc: t.lang === "fr" ? "Livraison dans les délais garantie"   : "On-time delivery guaranteed", link: "/about" },
    { icon: Award, title: t.lang === "fr" ? "Qualité"   : "Quality",  desc: t.lang === "fr" ? "Standards internationaux premium"      : "Premium international standards", link: "/projets" },
    { icon: MapPin,title: t.lang === "fr" ? "Proximité" : "Proximity",desc: t.lang === "fr" ? "Équipe locale à Abidjan"               : "Local team in Abidjan", link: "/about" },
    { icon: Lock,  title: t.lang === "fr" ? "Sécurité"  : "Security", desc: t.lang === "fr" ? "Vos données sont protégées"            : "Your data is protected", link: "/services" },
  ];

  const products: { icon: LucideIcon; tag: string; title: string; desc: string; price: string; color: string }[] = [
    { icon: Monitor,       tag: t.lang === "fr" ? "LOGICIEL"    : "SOFTWARE",    title: t.lang === "fr" ? "Logiciel caisse alimentation" : "Food store POS software",     desc: t.lang === "fr" ? "Gestion stocks, ventes, rapports"  : "Stock, sales, reports",   price: "150 000", color: "#0099FF" },
    { icon: Globe,         tag: "TEMPLATE",                                       title: t.lang === "fr" ? "Template site restaurant"      : "Restaurant website template", desc: t.lang === "fr" ? "Design premium prêt à l'emploi"    : "Ready-to-use premium design", price: "45 000",  color: "#FF6B00" },
    { icon: GraduationCap, tag: t.lang === "fr" ? "FORMATION"   : "TRAINING",    title: t.lang === "fr" ? "Formation création site web"   : "Web design training",         desc: t.lang === "fr" ? "10h de formation en ligne"          : "10h of online training",  price: "75 000",  color: "#00C48C" },
    { icon: Wrench,        tag: "MAINTENANCE",                                    title: t.lang === "fr" ? "Pack maintenance annuel"        : "Annual maintenance pack",     desc: t.lang === "fr" ? "Suivi, mises à jour, support"       : "Monitoring, updates, support", price: "120 000", color: "#9B93FF" },
    { icon: Smartphone,    tag: "TEMPLATE",                                       title: t.lang === "fr" ? "Template app mobile"            : "Mobile app template",         desc: t.lang === "fr" ? "UI/UX React Native prêt"            : "Ready React Native UI/UX", price: "80 000",  color: "#0066FF" },
    { icon: Shield,        tag: t.lang === "fr" ? "SERVICE"     : "SERVICE",     title: t.lang === "fr" ? "Audit cybersécurité"            : "Cybersecurity audit",         desc: t.lang === "fr" ? "Rapport complet + recommandations"  : "Full report + recommendations", price: "200 000", color: "#FF4757" },
  ];

  const articles = t.lang === "fr"
    ? [
        { tag: "DIGITALISATION", title: "Comment digitaliser votre boutique en 2025",       desc: "Guide complet pour les commerçants d'Abidjan" },
        { tag: "CYBERSÉCURITÉ",  title: "5 erreurs fatales pour la sécurité de votre PME",  desc: "Protégez vos données dès maintenant" },
        { tag: "ERP",            title: "Pourquoi votre entreprise a besoin d'un ERP",       desc: "Gagnez en efficacité avec un système intégré" },
        { tag: "WEB",            title: "Site vitrine ou e-commerce : que choisir ?",        desc: "On vous aide à faire le bon choix" },
        { tag: "MOBILE",         title: "L'avenir des apps en Côte d'Ivoire",                desc: "Pourquoi investir dans le mobile maintenant" },
      ]
    : [
        { tag: "DIGITALIZATION", title: "How to digitalize your store in 2025",              desc: "Complete guide for Abidjan merchants" },
        { tag: "CYBERSECURITY",  title: "5 fatal mistakes for your SME's security",          desc: "Protect your data right now" },
        { tag: "ERP",            title: "Why your business needs an ERP",                    desc: "Gain efficiency with an integrated system" },
        { tag: "WEB",            title: "Showcase vs e-commerce: which to choose?",          desc: "We help you make the right choice" },
        { tag: "MOBILE",         title: "The future of apps in Côte d'Ivoire",               desc: "Why invest in mobile now" },
      ];

  const testimonials = [
    { name: "Konan Kouassi",  company: "Supermarché Abidjan",  text: t.lang === "fr" ? "SORA TECH a révolutionné notre gestion. Nos ventes ont augmenté de 30% en 3 mois !" : "SORA TECH revolutionized our management. Sales increased by 30% in 3 months!", rating: 5, initials: "KK" },
    { name: "Aminata Traoré", company: "Boutique Fashion",     text: t.lang === "fr" ? "Le site e-commerce est magnifique. Service client au top, je recommande à 100% !"    : "The e-commerce site is beautiful. Top client service, 100% recommended!",          rating: 5, initials: "AT" },
    { name: "Dr. Coulibaly",  company: "Cabinet Médical",      text: t.lang === "fr" ? "L'ERP médical nous fait gagner des heures chaque jour. Équipe très professionnelle."  : "The medical ERP saves us hours every day. Very professional team.",                   rating: 5, initials: "DC" },
  ];

  const tagColors: Record<string, string> = {
    DIGITALISATION: "#0099FF", DIGITALIZATION: "#0099FF",
    CYBERSÉCURITÉ: "#FF4757", CYBERSECURITY: "#FF4757",
    ERP: "#9B93FF", WEB: "#0099FF", MOBILE: "#00C48C",
  };

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <BackgroundFX />
      <Navbar active="home" />

      {/* HERO */}
      <section className="relative py-24 md:py-36 px-6 text-center z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <ScanLine />
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 text-[#0099FF] text-xs tracking-[2px] px-4 py-1.5 rounded-full mb-6 border border-[#0066FF]"
            style={{ background: "var(--card)", boxShadow: "0 0 20px rgba(0,102,255,0.2)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />
            {h.badge}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-black leading-tight mb-6 tracking-tight" style={{ color: "var(--text)" }}>
            {h.hero1}{" "}
            <motion.span animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 5, repeat: Infinity }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] via-[#0099FF] to-[#00C6FF]" style={{ backgroundSize: "200% 200%" }}>
              {h.hero2}
            </motion.span>
            <br />{h.hero3}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
            className="text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed" style={{ color: "var(--muted)" }}>
            {h.heroDesc}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }}
            className="flex gap-4 justify-center flex-wrap">
            <Link href="/devis">
              <motion.button whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(0,102,255,0.5)" }} whileTap={{ scale: 0.95 }}
                className="bg-[#0066FF] px-8 py-3.5 rounded-xl font-bold text-sm text-white">{h.ctaDevis}</motion.button>
            </Link>
            <Link href="/services">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="px-8 py-3.5 rounded-xl font-medium text-sm transition-all border"
                style={{ borderColor: "var(--border)", color: "var(--text)" }}>
                {h.ctaServices}
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* TRACKING */}
      <section className="relative z-10 px-6 pb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-2xl mx-auto rounded-2xl p-5 flex flex-col sm:flex-row gap-3 items-center border"
          style={{ background: "var(--card)", borderColor: "var(--border2)" }}>
          <div className="flex-shrink-0 text-left">
            <div className="text-xs font-bold text-[#00C48C] uppercase tracking-widest mb-0.5">{h.trackLabel}</div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>{h.trackHint}</div>
          </div>
          <form onSubmit={e => { e.preventDefault(); const c = trackCode.trim().toUpperCase(); if (c) window.location.href = `/suivi/${c}`; }}
            className="flex gap-2 flex-1 w-full">
            <input value={trackCode} onChange={e => setTrackCode(e.target.value)}
              placeholder={h.trackPlaceholder}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none font-mono uppercase tracking-widest min-w-0 border"
              style={{ background: "var(--input-bg)", borderColor: "var(--border2)", color: "var(--text)" }} />
            <motion.button type="submit" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="px-4 py-2.5 rounded-xl text-sm font-bold flex-shrink-0 text-white" style={{ background: "#00C48C" }}>
              {h.trackBtn}
            </motion.button>
          </form>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="relative border-y py-10 px-6 z-10" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {h.stats.map((s, i) => (
            <Link href={s.link} key={i}>
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.05 }} className="text-center cursor-pointer">
                <div className="text-4xl md:text-5xl font-black" style={{ color: statColors[i] }}>
                  <AnimatedCounter target={s.num} suffix={s.suffix} />
                </div>
                <div className="text-[10px] tracking-widest mt-1 font-mono" style={{ color: "var(--muted)" }}>{s.label}</div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="relative py-20 px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="text-[10px] tracking-[4px] text-[#0099FF] mb-2 font-mono">// NOS_EXPERTISES</div>
            <h2 className="text-3xl md:text-5xl font-black" style={{ color: "var(--text)" }}>{h.servicesTitle}</h2>
            <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>{h.servicesDesc}</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-4">
            {services.map((s, i) => (
              <Link href="/services" key={i}>
                <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }} whileHover={{ y: -8, boxShadow: `0 20px 40px ${s.color}25` }}
                  className="backdrop-blur border hover:border-[#0066FF] rounded-2xl p-6 cursor-pointer transition-all duration-300 h-full group"
                  style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  <IconBox icon={s.icon} color={s.color} />
                  <h3 className="text-base font-bold mb-2" style={{ color: "var(--text)" }}>{s.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{s.desc}</p>
                  <div className="text-xs mt-4 font-bold" style={{ color: s.color }}>{h.servicesMore}</div>
                </motion.div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/services">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="border border-[#0066FF] text-[#0099FF] px-8 py-3 rounded-xl text-sm font-bold hover:bg-[#0066FF] hover:text-white transition-all">
                {h.servicesBtn}
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section className="relative py-16 px-6 z-10" style={{ background: "var(--bg2)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="text-[10px] tracking-[4px] text-[#0099FF] mb-2 font-mono">// DERNIERS_ARTICLES</div>
              <h2 className="text-2xl md:text-4xl font-black" style={{ color: "var(--text)" }}>{h.blogTitle}</h2>
            </motion.div>
            <Link href="/blog" className="text-sm text-[#0099FF] hover:underline font-bold">{h.blogAll}</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {articles.map((a, i) => (
              <Link href="/blog" key={i} className="flex-shrink-0">
                <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }} whileHover={{ y: -5 }}
                  className="border rounded-2xl overflow-hidden min-w-[270px] max-w-[270px] cursor-pointer transition-all duration-300"
                  style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  <div className="h-28 flex items-center justify-center text-3xl font-mono font-black"
                    style={{ background: `linear-gradient(135deg, ${tagColors[a.tag] || "#0066FF"}25, ${tagColors[a.tag] || "#0066FF"}05)`, color: tagColors[a.tag] || "#0099FF" }}>
                    [{a.tag}]
                  </div>
                  <div className="p-5">
                    <div className="text-[10px] tracking-widest font-mono mb-2" style={{ color: tagColors[a.tag] || "#0099FF" }}>{a.tag}</div>
                    <h3 className="text-sm font-bold mb-2 leading-snug" style={{ color: "var(--text)" }}>{a.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{a.desc}</p>
                    <div className="text-xs text-[#0099FF] mt-3 font-bold">{h.blogRead}</div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BOUTIQUE */}
      <section className="relative py-16 px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="text-[10px] tracking-[4px] text-[#FF6B00] mb-2 font-mono">// NOS_PRODUITS</div>
              <h2 className="text-2xl md:text-4xl font-black" style={{ color: "var(--text)" }}>{h.boutiqueTitle}</h2>
            </motion.div>
            <Link href="/boutique" className="text-sm text-[#0099FF] hover:underline font-bold">{h.boutiqueAll}</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {products.map((p, i) => (
              <Link href="/boutique" key={i} className="flex-shrink-0">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }} whileHover={{ y: -8, boxShadow: `0 20px 40px ${p.color}25` }}
                  className="border hover:border-[#0066FF] rounded-2xl overflow-hidden min-w-[250px] max-w-[250px] cursor-pointer transition-all duration-300 group"
                  style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  <div className="h-28 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${p.color}25, ${p.color}05)` }}>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${p.color}15`, border: `1px solid ${p.color}30` }}>
                      <p.icon className="w-8 h-8" style={{ color: p.color }} />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-[10px] tracking-wider font-mono mb-1" style={{ color: p.color }}>{p.tag}</div>
                    <h3 className="text-sm font-bold mb-1" style={{ color: "var(--text)" }}>{p.title}</h3>
                    <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>{p.desc}</p>
                    <div className="text-lg font-black mb-3" style={{ color: p.color }}>{p.price} FCFA</div>
                    <div className="w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 text-white"
                      style={{ backgroundColor: p.color }}>
                      <ShoppingCart className="w-3 h-3" />
                      {h.boutiqueOrder}
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* POURQUOI NOUS */}
      <section className="relative py-20 px-6 z-10" style={{ background: "var(--bg2)" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="text-[10px] tracking-[4px] text-[#0099FF] mb-2 font-mono">// POURQUOI_NOUS</div>
            <h2 className="text-3xl md:text-5xl font-black" style={{ color: "var(--text)" }}>{h.whyTitle}</h2>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-4">
            {whyUs.map((p, i) => (
              <Link href={p.link} key={i}>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }} whileHover={{ y: -6, boxShadow: "0 10px 30px rgba(0,153,255,0.15)" }}
                  className="border hover:border-[#0066FF] rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 group"
                  style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 bg-[#0066FF]/10 border border-[#0066FF]/30 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(0,102,255,0.3)]">
                    <p.icon className="w-7 h-7 text-[#0099FF]" />
                  </div>
                  <h3 className="text-sm font-bold mb-2" style={{ color: "var(--text)" }}>{p.title}</h3>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>{p.desc}</p>
                  <div className="text-xs text-[#0099FF] mt-3 font-bold opacity-0 group-hover:opacity-100 transition-opacity">{h.whyMore}</div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="relative py-20 px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="text-[10px] tracking-[4px] text-[#00C48C] mb-2 font-mono">// CLIENTS_SATISFAITS</div>
            <h2 className="text-3xl md:text-5xl font-black" style={{ color: "var(--text)" }}>{h.testimTitle}</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <Link href="/contact" key={i}>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }}
                  className="border hover:border-[#00C48C] transition-all duration-300 rounded-2xl p-6 cursor-pointer group h-full"
                  style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  <div className="flex gap-1 mb-4">{Array.from({ length: t.rating }).map((_, k) => <span key={k} className="text-[#FFD700] text-sm">★</span>)}</div>
                  <p className="text-sm italic mb-5 leading-relaxed" style={{ color: "var(--text)" }}>&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0066FF] to-[#0099FF] flex items-center justify-center text-xs font-black text-white">{t.initials}</div>
                      <div>
                        <div className="text-sm font-bold" style={{ color: "var(--text)" }}>{t.name}</div>
                        <div className="text-xs" style={{ color: "var(--muted)" }}>{t.company}</div>
                      </div>
                    </div>
                    <div className="text-xs text-[#00C48C] font-bold opacity-0 group-hover:opacity-100 transition-opacity">{h.testimContact}</div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/projets">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="border border-[#00C48C] text-[#00C48C] px-8 py-3 rounded-xl text-sm font-bold hover:bg-[#00C48C] hover:text-white transition-all">
                {h.testimBtn}
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 px-6 text-center z-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="max-w-3xl mx-auto border border-[#0066FF] rounded-3xl p-10 md:p-14 backdrop-blur relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(0,102,255,0.1), rgba(255,107,0,0.05))", boxShadow: "0 0 60px rgba(0,102,255,0.15)" }}>
          <ScanLine />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-4" style={{ color: "var(--text)" }}>{h.ctaTitle}</h2>
            <p className="mb-8" style={{ color: "var(--muted)" }}>{h.ctaDesc}</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/devis">
                <motion.button whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,102,255,0.5)" }} whileTap={{ scale: 0.95 }}
                  className="bg-[#0066FF] px-8 py-3.5 rounded-xl font-bold text-sm text-white">{h.ctaDevis2}</motion.button>
              </Link>
              <motion.a href="https://wa.me/2250704928068" target="_blank" rel="noopener"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="bg-[#25D366] px-8 py-3.5 rounded-xl font-bold text-sm text-white">{h.ctaWa}</motion.a>
              <Link href="/boutique">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="border border-[#FF6B00] text-[#FF6B00] px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-[#FF6B00] hover:text-white transition-all">
                  {h.ctaBoutique}
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
