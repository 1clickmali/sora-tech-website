"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import MobileMenu from "./components/MobileMenu";
import {
  Globe, Monitor, Smartphone, Layers, Shield, Wrench,
  Zap, Award, MapPin, Lock, ShoppingCart, GraduationCap,
  type LucideIcon
} from "lucide-react";

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
      <motion.div
        animate={{ y: ["-5%", "105%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear", repeatDelay: 4 }}
        className="absolute left-0 right-0 h-[2px]"
        style={{ background: "linear-gradient(90deg, transparent, rgba(0,153,255,0.5), rgba(0,198,255,0.8), rgba(0,153,255,0.5), transparent)" }}
      />
    </div>
  );
}

function IconBox({ icon: Icon, color }: { icon: LucideIcon; color: string }) {
  return (
    <div
      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
      style={{
        backgroundColor: `${color}15`,
        border: `1px solid ${color}40`,
        boxShadow: `0 0 20px ${color}15`,
      }}
    >
      <Icon className="w-7 h-7" style={{ color }} />
    </div>
  );
}

export default function Home() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 120]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const services: { icon: LucideIcon; title: string; desc: string; color: string; link: string }[] = [
    { icon: Globe,      title: "Sites web",            desc: "Sites vitrines et e-commerce premium sur mesure",       color: "#0099FF", link: "/services" },
    { icon: Monitor,    title: "Logiciels de gestion", desc: "Caisse, stock, CRM pour commerces et PME",              color: "#FF6B00", link: "/services" },
    { icon: Smartphone, title: "Applications mobiles", desc: "Apps Android & iOS natives pour votre business",        color: "#00C48C", link: "/services" },
    { icon: Layers,     title: "ERP complet",           desc: "RH, comptabilité, ventes, stock intégrés",             color: "#9B93FF", link: "/services" },
    { icon: Shield,     title: "Cybersécurité",         desc: "Audit, protection et formation anti-piratage",         color: "#FF4757", link: "/services" },
    { icon: Wrench,     title: "Maintenance IT",        desc: "Support 24/7, préventive et corrective",               color: "#0066FF", link: "/services" },
  ];

  const whyUs: { icon: LucideIcon; title: string; desc: string }[] = [
    { icon: Zap,   title: "Rapidité",   desc: "Livraison dans les délais garantie"   },
    { icon: Award, title: "Qualité",    desc: "Standards internationaux premium"      },
    { icon: MapPin,title: "Proximité",  desc: "Équipe locale à Abidjan"               },
    { icon: Lock,  title: "Sécurité",   desc: "Vos données sont protégées"            },
  ];

  const products: { icon: LucideIcon; tag: string; title: string; desc: string; price: string; color: string }[] = [
    { icon: Monitor,         tag: "LOGICIEL",    title: "Logiciel caisse alimentation", desc: "Gestion stocks, ventes, rapports",    price: "150 000", color: "#0099FF" },
    { icon: Globe,           tag: "TEMPLATE",    title: "Template site restaurant",      desc: "Design premium prêt à l'emploi",      price: "45 000",  color: "#FF6B00" },
    { icon: GraduationCap,   tag: "FORMATION",   title: "Formation création site web",   desc: "10h de formation en ligne",           price: "75 000",  color: "#00C48C" },
    { icon: Wrench,          tag: "MAINTENANCE", title: "Pack maintenance annuel",        desc: "Suivi, mises à jour, support",        price: "120 000", color: "#9B93FF" },
    { icon: Smartphone,      tag: "TEMPLATE",    title: "Template app mobile",            desc: "UI/UX React Native prêt",            price: "80 000",  color: "#0066FF" },
    { icon: Shield,          tag: "SERVICE",     title: "Audit cybersécurité",            desc: "Rapport complet + recommandations",  price: "200 000", color: "#FF4757" },
  ];

  const articles = [
    { tag: "DIGITALISATION", title: "Comment digitaliser votre boutique en 2025", desc: "Guide complet pour les commerçants d'Abidjan" },
    { tag: "CYBERSÉCURITÉ",  title: "5 erreurs fatales pour la sécurité de votre PME", desc: "Protégez vos données dès maintenant" },
    { tag: "ERP",            title: "Pourquoi votre entreprise a besoin d'un ERP", desc: "Gagnez en efficacité avec un système intégré" },
    { tag: "WEB",            title: "Site vitrine ou e-commerce : que choisir ?", desc: "On vous aide à faire le bon choix" },
    { tag: "MOBILE",         title: "L'avenir des apps en Côte d'Ivoire", desc: "Pourquoi investir dans le mobile maintenant" },
  ];

  const testimonials = [
    { name: "Konan Kouassi",  company: "Supermarché Abidjan",         text: "SORA TECH a révolutionné notre gestion. Nos ventes ont augmenté de 30% en 3 mois !", rating: 5, initials: "KK" },
    { name: "Aminata Traoré", company: "Boutique Fashion",            text: "Le site e-commerce est magnifique. Service client au top, je recommande à 100% !", rating: 5, initials: "AT" },
    { name: "Dr. Coulibaly",  company: "Cabinet Médical",             text: "L'ERP médical nous fait gagner des heures chaque jour. Équipe très professionnelle.", rating: 5, initials: "DC" },
  ];

  const tagColors: Record<string, string> = {
    DIGITALISATION: "#0099FF", CYBERSÉCURITÉ: "#FF4757",
    ERP: "#9B93FF", WEB: "#0099FF", MOBILE: "#00C48C",
  };

  return (
    <div className="min-h-screen bg-[#060D1F] text-white overflow-x-hidden">
      {/* FOND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(#0099FF 1px, transparent 1px), linear-gradient(90deg, #0099FF 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#0066FF] rounded-full blur-[150px] opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#0099FF] rounded-full blur-[150px] opacity-15 animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-[#FF6B00] rounded-full blur-[180px] opacity-10 animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* NAV */}
      <nav className="relative border-b border-[#1a2540] px-6 md:px-12 py-4 flex items-center justify-between sticky top-0 bg-[#060D1F]/85 backdrop-blur-xl z-50" style={{ boxShadow: "0 1px 0 rgba(0,153,255,0.1)" }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-xl font-black tracking-[3px]">
          SORA<span className="text-[#0099FF]">TECH</span>
        </motion.div>
        <div className="hidden lg:flex items-center gap-6">
          <Link href="/"         className="text-xs uppercase tracking-widest text-[#0099FF] font-bold">Accueil</Link>
          <Link href="/services" className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Services</Link>
          <Link href="/about"    className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">À propos</Link>
          <Link href="/blog"     className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Blog</Link>
          <Link href="/projets"  className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Projets</Link>
          <Link href="/boutique" className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Boutique</Link>
          <Link href="/devis"    className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Devis & RDV</Link>
          <Link href="/contact"  className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Contact</Link>
        </div>
        <div className="flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0,102,255,0.5)" }} whileTap={{ scale: 0.95 }} className="hidden sm:block bg-[#0066FF] hover:bg-[#0099FF] transition px-4 py-2 rounded-md text-xs font-bold tracking-wide">
            +225 07 00 00 00
          </motion.button>
          <MobileMenu active="home" />
        </div>
      </nav>

      {/* HERO */}
      <motion.section style={{ y: heroY, opacity: heroOpacity }} className="relative py-24 md:py-36 px-6 text-center z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(#1a2540 1px, transparent 1px), linear-gradient(90deg, #1a2540 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <ScanLine />
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 bg-[#0A1A3A] border border-[#0066FF] text-[#0099FF] text-xs tracking-[2px] px-4 py-1.5 rounded-full mb-6" style={{ boxShadow: "0 0 20px rgba(0,102,255,0.2)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />
            ABIDJAN · CÔTE D&apos;IVOIRE
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-5xl md:text-7xl font-black leading-tight mb-6 tracking-tight">
            Nous{" "}
            <motion.span animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 5, repeat: Infinity }} className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] via-[#0099FF] to-[#00C6FF]" style={{ backgroundSize: "200% 200%" }}>
              digitalisons
            </motion.span>
            <br />votre entreprise
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }} className="text-[#8899BB] text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Sites web, logiciels de gestion, applications mobiles, ERP et cybersécurité. SORA TECH transforme vos idées en solutions digitales premium.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="flex gap-4 justify-center flex-wrap">
            <Link href="/devis">
              <motion.button whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(0,102,255,0.5)" }} whileTap={{ scale: 0.95 }} className="bg-[#0066FF] px-8 py-3.5 rounded-xl font-bold text-sm">
                Obtenir un devis →
              </motion.button>
            </Link>
            <Link href="/services">
              <motion.button whileHover={{ scale: 1.05, borderColor: "#0066FF", boxShadow: "0 0 20px rgba(0,102,255,0.2)" }} whileTap={{ scale: 0.95 }} className="border border-[#1a2540] px-8 py-3.5 rounded-xl font-medium text-sm transition-all">
                Nos services
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* STATS */}
      <section className="relative border-y border-[#1a2540] bg-[#080F20]/80 backdrop-blur py-10 px-6 z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { num: 50, suffix: "+", label: "PROJETS LIVRÉS",    color: "#0099FF" },
            { num: 30, suffix: "+", label: "CLIENTS SATISFAITS", color: "#FF6B00" },
            { num: 7,  suffix: "",  label: "EXPERTISES TECH",    color: "#00C48C" },
            { num: 24, suffix: "/7",label: "SUPPORT CLIENT",     color: "#9B93FF" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="text-4xl md:text-5xl font-black" style={{ color: s.color }}>
                <AnimatedCounter target={s.num} suffix={s.suffix} />
              </div>
              <div className="text-[10px] text-[#8899BB] tracking-widest mt-1 font-mono">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="relative py-20 px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="text-[10px] tracking-[4px] text-[#0099FF] mb-2 font-mono">// NOS_EXPERTISES</div>
            <h2 className="text-3xl md:text-5xl font-black">Ce que nous faisons</h2>
            <p className="text-[#8899BB] mt-3 text-sm">Des solutions digitales complètes pour transformer votre entreprise</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-4">
            {services.map((s, i) => (
              <Link href={s.link} key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -8, boxShadow: `0 20px 40px ${s.color}25` }}
                  className="bg-[#0A1525]/80 backdrop-blur border border-[#1a2540] hover:border-[#0066FF] rounded-2xl p-6 cursor-pointer transition-all duration-300 h-full group"
                >
                  <IconBox icon={s.icon} color={s.color} />
                  <h3 className="text-base font-bold mb-2">{s.title}</h3>
                  <p className="text-xs text-[#8899BB] leading-relaxed">{s.desc}</p>
                  <div className="text-xs mt-4 font-bold transition-all" style={{ color: s.color }}>En savoir plus →</div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section id="blog" className="relative py-16 px-6 bg-[#080F20]/80 backdrop-blur z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="text-[10px] tracking-[4px] text-[#0099FF] mb-2 font-mono">// DERNIERS_ARTICLES</div>
              <h2 className="text-2xl md:text-4xl font-black">Du blog SORA TECH</h2>
            </motion.div>
            <Link href="/blog" className="text-sm text-[#0099FF] hover:underline font-bold">Voir tous →</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
            {articles.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -5, borderColor: tagColors[a.tag] || "#0066FF" }}
                className="bg-[#0A1525]/80 backdrop-blur border border-[#1a2540] rounded-2xl overflow-hidden min-w-[270px] max-w-[270px] flex-shrink-0 cursor-pointer transition-all duration-300"
              >
                <div className="h-28 flex items-center justify-center text-3xl font-mono font-black" style={{ background: `linear-gradient(135deg, ${tagColors[a.tag] || "#0066FF"}25, ${tagColors[a.tag] || "#0066FF"}05)`, color: tagColors[a.tag] || "#0099FF" }}>
                  [{a.tag}]
                </div>
                <div className="p-5">
                  <div className="text-[10px] tracking-widest font-mono mb-2" style={{ color: tagColors[a.tag] || "#0099FF" }}>{a.tag}</div>
                  <h3 className="text-sm font-bold mb-2 leading-snug">{a.title}</h3>
                  <p className="text-xs text-[#8899BB] leading-relaxed">{a.desc}</p>
                  <div className="text-xs text-[#0099FF] mt-3 font-bold">Lire →</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BOUTIQUE */}
      <section id="boutique" className="relative py-16 px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="text-[10px] tracking-[4px] text-[#FF6B00] mb-2 font-mono">// NOS_PRODUITS</div>
              <h2 className="text-2xl md:text-4xl font-black">Boutique SORA TECH</h2>
            </motion.div>
            <Link href="/boutique" className="text-sm text-[#0099FF] hover:underline font-bold">Toute la boutique →</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
            {products.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -8 }}
                className="bg-[#0A1525]/80 backdrop-blur border border-[#1a2540] hover:border-[#0066FF] rounded-2xl overflow-hidden min-w-[250px] max-w-[250px] flex-shrink-0 cursor-pointer transition-all duration-300 group"
              >
                <div className="h-28 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${p.color}25, ${p.color}05)` }}>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: `${p.color}15`, border: `1px solid ${p.color}30` }}>
                    <p.icon className="w-8 h-8" style={{ color: p.color }} />
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-[10px] tracking-wider font-mono mb-1" style={{ color: p.color }}>{p.tag}</div>
                  <h3 className="text-sm font-bold mb-1">{p.title}</h3>
                  <p className="text-xs text-[#8899BB] mb-3">{p.desc}</p>
                  <div className="text-lg font-black mb-3" style={{ color: p.color }}>{p.price} FCFA</div>
                  <Link href="/boutique">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2" style={{ backgroundColor: p.color }}>
                      <ShoppingCart className="w-3 h-3" />
                      Commander
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* POURQUOI NOUS */}
      <section className="relative py-20 px-6 bg-[#080F20]/80 backdrop-blur z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="text-[10px] tracking-[4px] text-[#0099FF] mb-2 font-mono">// POURQUOI_NOUS</div>
            <h2 className="text-3xl md:text-5xl font-black">Votre partenaire tech en Côte d&apos;Ivoire</h2>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-4">
            {whyUs.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, boxShadow: "0 10px 30px rgba(0,153,255,0.15)" }}
                className="bg-[#0A1525]/80 backdrop-blur border border-[#1a2540] hover:border-[#0066FF] rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 group"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 bg-[#0066FF]/10 border border-[#0066FF]/30 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(0,102,255,0.3)]">
                  <p.icon className="w-7 h-7 text-[#0099FF]" />
                </div>
                <h3 className="text-sm font-bold mb-2">{p.title}</h3>
                <p className="text-xs text-[#8899BB]">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="relative py-20 px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="text-[10px] tracking-[4px] text-[#00C48C] mb-2 font-mono">// CLIENTS_SATISFAITS</div>
            <h2 className="text-3xl md:text-5xl font-black">Ils nous ont fait confiance</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,196,140,0.15)" }}
                className="bg-[#0A1525]/80 backdrop-blur border border-[#1a2540] hover:border-[#00C48C] transition-all duration-300 rounded-2xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, k) => <span key={k} className="text-[#FFD700] text-sm">★</span>)}
                </div>
                <p className="text-sm text-white italic mb-5 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-[#1a2540]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0066FF] to-[#0099FF] flex items-center justify-center text-xs font-black">{t.initials}</div>
                  <div>
                    <div className="text-sm font-bold">{t.name}</div>
                    <div className="text-xs text-[#8899BB]">{t.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 px-6 text-center z-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-3xl mx-auto bg-gradient-to-br from-[#0066FF]/20 via-[#0099FF]/10 to-[#FF6B00]/10 border border-[#0066FF] rounded-3xl p-10 md:p-14 backdrop-blur relative overflow-hidden" style={{ boxShadow: "0 0 60px rgba(0,102,255,0.15)" }}>
          <ScanLine />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-4">Prêt à digitaliser votre entreprise ?</h2>
            <p className="text-[#8899BB] mb-8">Obtenez un devis gratuit et personnalisé en moins de 2 minutes</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/devis">
                <motion.button whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,102,255,0.5)" }} whileTap={{ scale: 0.95 }} className="bg-[#0066FF] px-8 py-3.5 rounded-xl font-bold text-sm">
                  Demander un devis
                </motion.button>
              </Link>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-[#25D366] px-8 py-3.5 rounded-xl font-bold text-sm">
                💬 WhatsApp direct
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="relative bg-[#040A14] border-t border-[#1a2540] py-12 px-6 z-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-lg font-black tracking-widest mb-3">SORA<span className="text-[#0099FF]">TECH</span></div>
            <p className="text-xs text-[#8899BB] leading-relaxed mb-4">Entreprise tech panafricaine qui digitalise les entreprises d&apos;Abidjan et de toute l&apos;Afrique de l&apos;Ouest.</p>
            <div className="flex gap-3">
              {["f","in","ig","wa"].map((s, i) => (
                <div key={i} className={`w-8 h-8 ${i === 3 ? "hover:bg-[#25D366]" : "hover:bg-[#0066FF]"} bg-[#1a2540] rounded-lg flex items-center justify-center cursor-pointer transition text-xs`}>{s}</div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs tracking-wider text-white mb-3 font-bold">SERVICES</h4>
            <ul className="space-y-2 text-xs text-[#8899BB]">
              {["Sites web","Logiciels de gestion","Applications mobiles","ERP entreprise","Cybersécurité","Maintenance"].map((s) => (
                <li key={s} className="hover:text-[#0099FF] cursor-pointer transition">{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs tracking-wider text-white mb-3 font-bold">ENTREPRISE</h4>
            <ul className="space-y-2 text-xs text-[#8899BB]">
              {["À propos de nous","Blog SORA TECH","Nos réalisations","Boutique digitale","Devis & RDV","Contact"].map((s) => (
                <li key={s} className="hover:text-[#0099FF] cursor-pointer transition">{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs tracking-wider text-white mb-3 font-bold">CONTACT</h4>
            <ul className="space-y-2 text-xs text-[#8899BB]">
              <li>📍 Abidjan, Côte d&apos;Ivoire</li>
              <li>📞 +225 07 04 92 80 68</li>
              <li>✉️ contact@soratech.ci</li>
              <li>💬 WhatsApp Business</li>
              <li>🕐 Lun-Ven : 8h-18h</li>
              <li>🕐 Sam : 9h-14h</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#1a2540] pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="text-xs text-[#8899BB]">© 2025 SORA TECH COMPANY — Tous droits réservés</div>
          <div className="text-xs text-[#8899BB]">Fait avec ❤️ à Abidjan par Sissoko Abdoulaye</div>
        </div>
      </footer>
    </div>
  );
}
