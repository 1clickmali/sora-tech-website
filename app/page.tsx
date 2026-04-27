"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import {
  Globe, Monitor, Smartphone, Layers, Shield, Wrench,
  Zap, Award, MapPin, Lock, ShoppingCart, CheckCircle,
  type LucideIcon
} from "lucide-react";
import { useApp } from "./i18n/AppContext";
import { resolveMediaUrl } from "@/lib/media";
import { blogLabel, productLabel, projectLabel } from "@/lib/i18nLabels";

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

type HomeProduct = { _id: string; category: string; title: string; description: string; price: number; image?: string; active?: boolean };
type HomeArticle = { _id: string; slug?: string; category: string; title: string; excerpt: string };
type HomeProject = { _id: string; category: string; title: string; client?: string; results?: string[]; tech?: string[]; image?: string; createdAt?: string };

const CAT_COLORS: Record<string, string> = {
  Logiciel: "#0099FF", Matériel: "#FF6B00", Service: "#00C48C", Formation: "#9B93FF",
  "Site web": "#0099FF", Application: "#00C48C", ERP: "#9B93FF", Cybersécurité: "#FF4757",
  Digitalisation: "#0099FF", Web: "#0066FF", Mobile: "#00C48C", Business: "#FF6B00",
};

const CAT_ICONS: Record<string, LucideIcon> = {
  Logiciel: Monitor, Matériel: Wrench, Service: Globe, Formation: Layers,
  "Site web": Globe, Application: Smartphone, ERP: Layers, Cybersécurité: Shield,
};

export default function Home() {
  const { t, lang } = useApp();
  const h = t.home;
  const [trackCode, setTrackCode] = useState('');
  const [apiProducts, setApiProducts] = useState<HomeProduct[]>([]);
  const [apiArticles, setApiArticles] = useState<HomeArticle[]>([]);
  const [apiProjects, setApiProjects] = useState<HomeProject[]>([]);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${base}/api/produits?limit=8`)
      .then(r => r.json()).then(r => setApiProducts((r.data || []).filter((p: HomeProduct) => p.active !== false)))
      .catch(() => {});
    fetch(`${base}/api/articles?limit=6`)
      .then(r => r.json()).then(r => setApiArticles(r.data || []))
      .catch(() => {});
    fetch(`${base}/api/projets?limit=6`)
      .then(r => r.json()).then(r => setApiProjects(r.data || []))
      .catch(() => {});
  }, []);

  const statColors = ["#0099FF", "#FF6B00", "#00C48C", "#9B93FF"];

  const services: { icon: LucideIcon; title: string; desc: string; color: string }[] = [
    { icon: Globe,      title: lang === "fr" ? "Sites web" : "Web sites",             desc: lang === "fr" ? "Sites vitrines et e-commerce premium sur mesure"  : "Premium showcase and e-commerce sites", color: "#0099FF" },
    { icon: Monitor,    title: lang === "fr" ? "Logiciels de gestion" : "Management software", desc: lang === "fr" ? "Caisse, stock, CRM pour commerces et PME" : "POS, stock, CRM for businesses",        color: "#FF6B00" },
    { icon: Smartphone, title: lang === "fr" ? "Applications mobiles" : "Mobile apps", desc: lang === "fr" ? "Apps Android & iOS natives pour votre business"  : "Native Android & iOS apps for your business", color: "#00C48C" },
    { icon: Layers,     title: "ERP",                                                    desc: lang === "fr" ? "RH, comptabilité, ventes, stock intégrés"         : "HR, accounting, sales, stock integrated", color: "#9B93FF" },
    { icon: Shield,     title: lang === "fr" ? "Cybersécurité" : "Cybersecurity",    desc: lang === "fr" ? "Audit, protection et formation anti-piratage"       : "Audit, protection and anti-piracy training", color: "#FF4757" },
    { icon: Wrench,     title: lang === "fr" ? "Maintenance IT" : "IT Maintenance",  desc: lang === "fr" ? "Support 24/7, préventive et corrective"             : "24/7 support, preventive and corrective", color: "#0066FF" },
  ];

  const whyUs: { icon: LucideIcon; title: string; desc: string; link: string }[] = [
    { icon: Zap,   title: lang === "fr" ? "Rapidité"  : "Speed",    desc: lang === "fr" ? "Livraison dans les délais garantie"   : "On-time delivery guaranteed", link: "/about" },
    { icon: Award, title: lang === "fr" ? "Qualité"   : "Quality",  desc: lang === "fr" ? "Standards internationaux premium"      : "Premium international standards", link: "/projets" },
    { icon: MapPin,title: lang === "fr" ? "Proximité" : "Proximity",desc: lang === "fr" ? "Équipe locale à Abidjan"               : "Local team in Abidjan", link: "/about" },
    { icon: Lock,  title: lang === "fr" ? "Sécurité"  : "Security", desc: lang === "fr" ? "Vos données sont protégées"            : "Your data is protected", link: "/services" },
  ];


  const testimonials = [
    { name: "Konan Kouassi",  company: "Supermarché Abidjan",  text: lang === "fr" ? "SORA TECH a révolutionné notre gestion. Nos ventes ont augmenté de 30% en 3 mois !" : "SORA TECH revolutionized our management. Sales increased by 30% in 3 months!", rating: 5, initials: "KK" },
    { name: "Aminata Traoré", company: "Boutique Fashion",     text: lang === "fr" ? "Le site e-commerce est magnifique. Service client au top, je recommande à 100% !"    : "The e-commerce site is beautiful. Top client service, 100% recommended!",          rating: 5, initials: "AT" },
    { name: "Dr. Coulibaly",  company: "Cabinet Médical",      text: lang === "fr" ? "L'ERP médical nous fait gagner des heures chaque jour. Équipe très professionnelle."  : "The medical ERP saves us hours every day. Very professional team.",                   rating: 5, initials: "DC" },
  ];


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
            <div className="text-[10px] tracking-[4px] text-[#0099FF] mb-2 font-mono">{lang === "fr" ? "// NOS_EXPERTISES" : "// OUR_EXPERTISES"}</div>
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
      {apiArticles.length > 0 && (
        <section className="relative py-16 px-6 z-10" style={{ background: "var(--bg2)" }}>
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <div className="text-[10px] tracking-[4px] text-[#0099FF] mb-2 font-mono">{lang === "fr" ? "// DERNIERS_ARTICLES" : "// LATEST_ARTICLES"}</div>
                <h2 className="text-2xl md:text-4xl font-black" style={{ color: "var(--text)" }}>{h.blogTitle}</h2>
              </motion.div>
              <Link href="/blog" className="text-sm text-[#0099FF] hover:underline font-bold">{h.blogAll}</Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {apiArticles.map((a, i) => {
                const color = CAT_COLORS[a.category] || "#0099FF";
                return (
                  <Link href={`/blog/${a.slug || a._id}`} key={a._id} className="flex-shrink-0">
                    <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }} whileHover={{ y: -5 }}
                      className="border rounded-2xl overflow-hidden min-w-[270px] max-w-[270px] cursor-pointer transition-all duration-300"
                      style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                      <div className="h-28 flex items-center justify-center text-2xl font-mono font-black"
                        style={{ background: `linear-gradient(135deg, ${color}25, ${color}05)`, color }}>
                        [{blogLabel(a.category, lang).toUpperCase()}]
                      </div>
                      <div className="p-5">
                        <div className="text-[10px] tracking-widest font-mono mb-2" style={{ color }}>{blogLabel(a.category, lang).toUpperCase()}</div>
                        <h3 className="text-sm font-bold mb-2 leading-snug" style={{ color: "var(--text)" }}>{a.title}</h3>
                        <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--muted)" }}>{a.excerpt}</p>
                        <div className="text-xs text-[#0099FF] mt-3 font-bold">{h.blogRead}</div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* BOUTIQUE */}
      {apiProducts.length > 0 && (
        <section className="relative py-16 px-6 z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <div className="text-[10px] tracking-[4px] text-[#FF6B00] mb-2 font-mono">{lang === "fr" ? "// NOUVEAUX_PRODUITS" : "// NEW_PRODUCTS"}</div>
                <h2 className="text-2xl md:text-4xl font-black" style={{ color: "var(--text)" }}>{h.boutiqueTitle}</h2>
              </motion.div>
              <Link href="/boutique" className="text-sm text-[#0099FF] hover:underline font-bold">{h.boutiqueAll}</Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {apiProducts.map((p, i) => {
                const color = CAT_COLORS[p.category] || "#0099FF";
                const Icon = CAT_ICONS[p.category] || Monitor;
                return (
                  <Link href="/boutique" key={p._id} className="flex-shrink-0">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }} whileHover={{ y: -8, boxShadow: `0 20px 40px ${color}25` }}
                      className="border hover:border-[#0066FF] rounded-2xl overflow-hidden min-w-[250px] max-w-[250px] cursor-pointer transition-all duration-300 group"
                      style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                      <div className="h-28 flex items-center justify-center overflow-hidden" style={{ background: `linear-gradient(135deg, ${color}25, ${color}05)` }}>
                        {p.image
                          ? <img src={resolveMediaUrl(p.image)} alt={p.title} className="w-full h-full object-cover" />
                          : <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                              style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}>
                              <Icon className="w-8 h-8" style={{ color }} />
                            </div>
                        }
                      </div>
                      <div className="p-4">
                        <div className="text-[10px] tracking-wider font-mono mb-1" style={{ color }}>{productLabel(p.category, lang).toUpperCase()}</div>
                        <h3 className="text-sm font-bold mb-1 line-clamp-1" style={{ color: "var(--text)" }}>{p.title}</h3>
                        <p className="text-xs mb-3 line-clamp-2" style={{ color: "var(--muted)" }}>{p.description}</p>
                        <div className="text-lg font-black mb-3" style={{ color }}>{p.price.toLocaleString("fr-FR")} FCFA</div>
                        <div className="w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 text-white"
                          style={{ backgroundColor: color }}>
                          <ShoppingCart className="w-3 h-3" />
                          {h.boutiqueOrder}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* PROJETS */}
      {apiProjects.length > 0 && (
        <section className="relative py-16 px-6 z-10" style={{ background: "var(--bg2)" }}>
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <div className="text-[10px] tracking-[4px] text-[#00C48C] mb-2 font-mono">{lang === "fr" ? "// DERNIERS_PROJETS" : "// LATEST_PROJECTS"}</div>
                <h2 className="text-2xl md:text-4xl font-black" style={{ color: "var(--text)" }}>
                  {lang === "fr" ? "Nos derniers projets" : "Our latest projects"}
                </h2>
              </motion.div>
              <Link href="/projets" className="text-sm text-[#0099FF] hover:underline font-bold">
                {lang === "fr" ? "Voir tous les projets →" : "See all projects →"}
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {apiProjects.map((p, i) => {
                const color = CAT_COLORS[p.category] || "#0099FF";
                const Icon = CAT_ICONS[p.category] || Globe;
                return (
                  <Link href="/projets" key={p._id} className="flex-shrink-0">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }} whileHover={{ y: -8, boxShadow: `0 20px 40px ${color}20` }}
                      className="border rounded-2xl overflow-hidden min-w-[260px] max-w-[260px] cursor-pointer transition-all duration-300 group"
                      style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                      <div className="h-32 flex items-center justify-center overflow-hidden relative" style={{ background: `linear-gradient(135deg, ${color}30, ${color}08)` }}>
                        {p.image
                          ? <img src={resolveMediaUrl(p.image)} alt={p.title} className="w-full h-full object-cover" />
                          : <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                              style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40` }}>
                              <Icon className="w-8 h-8" style={{ color }} />
                            </div>
                        }
                        <div className="absolute top-3 left-3 px-2 py-1 rounded text-[10px] tracking-widest font-mono" style={{ background: "var(--card)", color }}>{projectLabel(p.category, lang)}</div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-bold mb-1 line-clamp-1 group-hover:text-[#0099FF] transition-colors" style={{ color: "var(--text)" }}>{p.title}</h3>
                        {p.client && <div className="text-[10px] font-bold font-mono mb-2" style={{ color }}>{p.client}</div>}
                        {p.results && p.results.length > 0 && (
                          <div className="space-y-1">
                            {p.results.slice(0, 2).map((r, k) => (
                              <div key={k} className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--muted)" }}>
                                <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color }} />{r}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* POURQUOI NOUS */}
      <section className="relative py-20 px-6 z-10" style={{ background: "var(--bg2)" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="text-[10px] tracking-[4px] text-[#0099FF] mb-2 font-mono">{lang === "fr" ? "// POURQUOI_NOUS" : "// WHY_US"}</div>
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
            <div className="text-[10px] tracking-[4px] text-[#00C48C] mb-2 font-mono">{lang === "fr" ? "// CLIENTS_SATISFAITS" : "// HAPPY_CLIENTS"}</div>
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
