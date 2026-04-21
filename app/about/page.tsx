"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import MobileMenu from "../components/MobileMenu";
import {
  Target, Telescope, Zap, Lightbulb, Users, Lock, Globe2,
  type LucideIcon
} from "lucide-react";

function ScanLine() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div animate={{ y: ["-5%", "105%"] }} transition={{ duration: 8, repeat: Infinity, ease: "linear", repeatDelay: 4 }} className="absolute left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, rgba(0,153,255,0.5), rgba(0,198,255,0.8), rgba(0,153,255,0.5), transparent)" }} />
    </div>
  );
}

const NAV_LINKS = [
  { href: "/", label: "Accueil" }, { href: "/services", label: "Services" },
  { href: "/about", label: "À propos", active: true }, { href: "/blog", label: "Blog" },
  { href: "/projets", label: "Projets" }, { href: "/boutique", label: "Boutique" },
  { href: "/devis", label: "Devis & RDV" }, { href: "/contact", label: "Contact" },
];

export default function AboutPage() {
  const values: { icon: LucideIcon; title: string; desc: string; color: string }[] = [
    { icon: Target,     title: "Excellence",     desc: "Chaque projet est livré avec les plus hauts standards de qualité internationale.", color: "#0099FF" },
    { icon: Lightbulb,  title: "Innovation",     desc: "Nous utilisons les technologies les plus récentes pour garder votre entreprise en avance.", color: "#FF6B00" },
    { icon: Users,      title: "Proximité",      desc: "Équipe locale à Abidjan, disponible, à l'écoute et qui parle votre langue.", color: "#00C48C" },
    { icon: Lock,       title: "Fiabilité",      desc: "Support 24/7 garanti et une garantie d'un an sur tous nos livrables.", color: "#FF4757" },
    { icon: Zap,        title: "Rapidité",       desc: "Livraison dans les délais promis, avec un suivi transparent à chaque étape.", color: "#9B93FF" },
    { icon: Globe2,     title: "Impact local",   desc: "Notre mission : faire de la Côte d'Ivoire un hub technologique africain.", color: "#00FF88" },
  ];

  const team = [
    { name: "Sissoko Abdoulaye", role: "Fondateur & CEO",    desc: "Expert en cybersécurité et digitalisation des entreprises", initials: "SA", color: "#0099FF" },
    { name: "Lead Developer",    role: "Développeur Senior", desc: "Architecture logicielle & backend",                          initials: "LD", color: "#FF6B00" },
    { name: "UI/UX Designer",    role: "Design Lead",        desc: "Expérience utilisateur premium",                            initials: "UX", color: "#00C48C" },
    { name: "Security Expert",   role: "Cybersécurité",      desc: "Protection & audit des systèmes",                           initials: "SE", color: "#FF4757" },
  ];

  const timeline = [
    { year: "2024", title: "Création de SORA TECH",  desc: "Fondation de l'entreprise à Abidjan par Sissoko Abdoulaye avec une vision claire : digitaliser l'Afrique.", color: "#0099FF" },
    { year: "2025", title: "Premiers clients",        desc: "Lancement officiel des services et signature des premiers contrats à Abidjan.", color: "#FF6B00" },
    { year: "2026", title: "Expansion nationale",     desc: "Objectif : servir toute la Côte d'Ivoire avec 100+ clients actifs.", color: "#00C48C" },
    { year: "2027", title: "Ouverture régionale",     desc: "Extension vers le Mali, le Burkina Faso et le Sénégal.", color: "#9B93FF" },
  ];

  return (
    <div className="min-h-screen bg-[#060D1F] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(#0099FF 1px, transparent 1px), linear-gradient(90deg, #0099FF 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#0066FF] rounded-full blur-[150px] opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FF6B00] rounded-full blur-[150px] opacity-15 animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* NAV */}
      <nav className="relative border-b border-[#1a2540] px-6 md:px-12 py-4 flex items-center justify-between sticky top-0 bg-[#060D1F]/85 backdrop-blur-xl z-50">
        <Link href="/" className="text-xl font-black tracking-[3px]">SORA<span className="text-[#0099FF]">TECH</span></Link>
        <div className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={`text-xs uppercase tracking-widest transition ${l.active ? "text-[#0099FF] font-bold" : "text-[#8899BB] hover:text-white"}`}>{l.label}</Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden sm:block bg-[#0066FF] hover:bg-[#0099FF] transition px-4 py-2 rounded-md text-xs font-bold tracking-wide">+225 07 00 00 00</motion.button>
          <MobileMenu active="about" />
        </div>
      </nav>

      {/* HERO */}
      <section className="relative py-24 md:py-32 px-6 text-center z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(#1a2540 1px, transparent 1px), linear-gradient(90deg, #1a2540 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <ScanLine />
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-[#0A1A3A] border border-[#0066FF] text-[#0099FF] text-xs tracking-[2px] px-4 py-1.5 rounded-full mb-6" style={{ boxShadow: "0 0 20px rgba(0,102,255,0.2)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />
            NOTRE HISTOIRE
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-4xl md:text-7xl font-black leading-tight mb-6 tracking-tight">
            Nous sommes{" "}
            <motion.span animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 5, repeat: Infinity }} className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] via-[#0099FF] to-[#FF6B00]" style={{ backgroundSize: "200% 200%" }}>SORA TECH</motion.span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-[#8899BB] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Une entreprise tech panafricaine née de la passion pour l&apos;innovation et le désir de transformer le paysage digital africain.
          </motion.p>
        </div>
      </section>

      {/* MISSION / VISION */}
      <section className="relative py-16 px-6 z-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          {[
            { icon: Target,     title: "Notre Mission", color: "#0066FF", text: "Rendre la technologie accessible à toutes les entreprises ivoiriennes et africaines, peu importe leur taille. Nous croyons que chaque commerce mérite d'avoir les meilleurs outils digitaux pour réussir et grandir." },
            { icon: Telescope,  title: "Notre Vision",  color: "#FF6B00", text: "Faire d'Abidjan un hub technologique majeur en Afrique de l'Ouest. Devenir la référence absolue en matière de digitalisation des PME et grandes entreprises africaines." },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: i === 0 ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-2xl p-8 border" style={{ background: `linear-gradient(135deg, ${item.color}15, ${item.color}05)`, borderColor: `${item.color}40` }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: `${item.color}15`, border: `1px solid ${item.color}40` }}>
                <item.icon className="w-7 h-7" style={{ color: item.color }} />
              </div>
              <h3 className="text-2xl font-black mb-3">{item.title}</h3>
              <p className="text-[#8899BB] leading-relaxed text-sm">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FONDATEUR */}
      <section className="relative py-20 px-6 bg-[#080F20]/80 backdrop-blur z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <div className="text-[10px] tracking-[4px] text-[#0099FF] mb-2 font-mono">// LE_FONDATEUR</div>
            <h2 className="text-3xl md:text-5xl font-black">L&apos;homme derrière SORA TECH</h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-gradient-to-br from-[#0066FF]/20 via-[#0099FF]/10 to-[#FF6B00]/10 border border-[#0066FF]/50 rounded-3xl p-8 md:p-12 backdrop-blur" style={{ boxShadow: "0 0 60px rgba(0,102,255,0.1)" }}>
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="text-center">
                <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-[#0066FF] to-[#0099FF] flex items-center justify-center text-5xl font-black shadow-2xl mb-4" style={{ boxShadow: "0 0 40px rgba(0,102,255,0.4)" }}>SA</div>
                <div className="flex justify-center gap-2 flex-wrap">
                  <div className="text-xs bg-[#080F20] border border-[#0066FF]/40 px-3 py-1 rounded-full text-[#0099FF] font-bold">🇲🇱 Malien</div>
                  <div className="text-xs bg-[#080F20] border border-[#FF6B00]/40 px-3 py-1 rounded-full text-[#FF6B00] font-bold">🇨🇮 Basé à Abidjan</div>
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="text-[10px] tracking-[3px] text-[#0099FF] mb-2 font-mono">FONDATEUR & CEO</div>
                <h3 className="text-3xl md:text-4xl font-black mb-3">Sissoko Abdoulaye</h3>
                <div className="flex gap-2 flex-wrap mb-4">
                  <div className="text-xs bg-[#0A1525] border border-[#1a2540] px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5"><Lock className="w-3 h-3 text-[#FF4757]" /> Expert Cybersécurité</div>
                  <div className="text-xs bg-[#0A1525] border border-[#1a2540] px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5"><Globe2 className="w-3 h-3 text-[#0099FF]" /> Digitalisation</div>
                </div>
                <p className="text-[#8899BB] leading-relaxed mb-4 text-sm">Jeune entrepreneur malien passionné par la technologie, Sissoko Abdoulaye a fondé SORA TECH COMPANY avec une vision claire : rendre la digitalisation accessible à toutes les entreprises d&apos;Afrique de l&apos;Ouest.</p>
                <p className="text-[#8899BB] leading-relaxed italic border-l-2 border-[#0066FF] pl-4 text-sm">&ldquo;Mon rêve est de faire d&apos;Abidjan un hub technologique majeur en Afrique, où chaque entreprise a accès aux meilleurs outils digitaux, peu importe sa taille.&rdquo;</p>
                <div className="flex gap-3 mt-6 flex-wrap">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-[#0066FF] px-5 py-2.5 rounded-xl font-bold text-xs">Contacter le fondateur</motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-[#25D366] px-5 py-2.5 rounded-xl font-bold text-xs">💬 WhatsApp</motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HISTOIRE */}
      <section className="relative py-20 px-6 z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <div className="text-[10px] tracking-[4px] text-[#0099FF] mb-2 font-mono">// NOTRE_PARCOURS</div>
            <h2 className="text-3xl md:text-5xl font-black">L&apos;aventure SORA TECH</h2>
          </motion.div>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block" style={{ background: "linear-gradient(to bottom, transparent, #0066FF, #0099FF, transparent)" }} />
            {timeline.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`relative mb-8 md:w-1/2 ${i % 2 === 0 ? "md:pr-10 md:text-right" : "md:ml-auto md:pl-10"}`}>
                <div className="hidden md:block absolute top-6 w-3 h-3 rounded-full border-2 border-[#060D1F]" style={{ [i % 2 === 0 ? "right" : "left"]: "-7px", backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}` }} />
                <div className="bg-[#0A1525]/80 backdrop-blur border border-[#1a2540] hover:border-[#0066FF] transition-all duration-300 rounded-2xl p-6" style={{ boxShadow: "none" }}>
                  <div className="text-2xl font-black font-mono mb-2" style={{ color: item.color }}>{item.year}</div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-[#8899BB]">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* VALEURS */}
      <section className="relative py-20 px-6 bg-[#080F20]/80 backdrop-blur z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <div className="text-[10px] tracking-[4px] text-[#FF6B00] mb-2 font-mono">// NOS_VALEURS</div>
            <h2 className="text-3xl md:text-5xl font-black">Nos valeurs fondamentales</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -8, boxShadow: `0 10px 30px ${v.color}20` }} className="bg-[#0A1525]/80 backdrop-blur border border-[#1a2540] hover:border-[#0066FF] rounded-2xl p-6 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: `${v.color}15`, border: `1px solid ${v.color}40`, boxShadow: `0 0 15px ${v.color}10` }}>
                  <v.icon className="w-6 h-6" style={{ color: v.color }} />
                </div>
                <h3 className="text-lg font-bold mb-2">{v.title}</h3>
                <p className="text-sm text-[#8899BB] leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ÉQUIPE */}
      <section className="relative py-20 px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <div className="text-[10px] tracking-[4px] text-[#00C48C] mb-2 font-mono">// NOTRE_ÉQUIPE</div>
            <h2 className="text-3xl md:text-5xl font-black">Les talents derrière SORA TECH</h2>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-5">
            {team.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5, boxShadow: `0 10px 30px ${m.color}25` }} className="bg-[#0A1525]/80 backdrop-blur border border-[#1a2540] rounded-2xl p-6 text-center transition-all duration-300">
                <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-2xl font-black mb-4 shadow-lg" style={{ backgroundColor: m.color, boxShadow: `0 0 20px ${m.color}40` }}>{m.initials}</div>
                <h3 className="text-base font-bold mb-1">{m.name}</h3>
                <div className="text-xs font-bold mb-2 font-mono" style={{ color: m.color }}>{m.role}</div>
                <p className="text-xs text-[#8899BB]">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative py-16 px-6 bg-[#080F20]/80 backdrop-blur z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { num: "50+",  label: "PROJETS LIVRÉS",    color: "#0099FF" },
            { num: "30+",  label: "CLIENTS SATISFAITS", color: "#FF6B00" },
            { num: "6",    label: "EXPERTISES TECH",    color: "#00C48C" },
            { num: "100%", label: "SATISFACTION",       color: "#9B93FF" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-[#0A1525]/80 border border-[#1a2540] rounded-2xl p-6">
              <div className="text-4xl md:text-5xl font-black font-mono" style={{ color: s.color }}>{s.num}</div>
              <div className="text-[10px] text-[#8899BB] tracking-widest mt-2 font-mono">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 px-6 text-center z-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-3xl mx-auto bg-gradient-to-br from-[#0066FF]/20 via-[#0099FF]/10 to-[#FF6B00]/10 border border-[#0066FF]/50 rounded-3xl p-10 md:p-14 backdrop-blur relative overflow-hidden">
          <ScanLine />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-4">Rejoignez notre aventure</h2>
            <p className="text-[#8899BB] mb-8">Devenez l&apos;un de nos prochains clients satisfaits en Côte d&apos;Ivoire</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <motion.button whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,102,255,0.5)" }} whileTap={{ scale: 0.95 }} className="bg-[#0066FF] px-8 py-3.5 rounded-xl font-bold text-sm">Demander un devis</motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-[#25D366] px-8 py-3.5 rounded-xl font-bold text-sm">💬 WhatsApp direct</motion.button>
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
            <div className="flex gap-3">{["f","in","ig","wa"].map((s, i) => <div key={i} className={`w-8 h-8 ${i===3?"hover:bg-[#25D366]":"hover:bg-[#0066FF]"} bg-[#1a2540] rounded-lg flex items-center justify-center cursor-pointer transition text-xs`}>{s}</div>)}</div>
          </div>
          <div><h4 className="text-xs tracking-wider text-white mb-3 font-bold">SERVICES</h4><ul className="space-y-2 text-xs text-[#8899BB]">{["Sites web","Logiciels de gestion","Applications mobiles","ERP entreprise","Cybersécurité","Maintenance"].map(s=><li key={s} className="hover:text-[#0099FF] cursor-pointer transition">{s}</li>)}</ul></div>
          <div><h4 className="text-xs tracking-wider text-white mb-3 font-bold">ENTREPRISE</h4><ul className="space-y-2 text-xs text-[#8899BB]">{["À propos de nous","Blog SORA TECH","Nos réalisations","Boutique digitale","Devis & RDV","Contact"].map(s=><li key={s} className="hover:text-[#0099FF] cursor-pointer transition">{s}</li>)}</ul></div>
          <div><h4 className="text-xs tracking-wider text-white mb-3 font-bold">CONTACT</h4><ul className="space-y-2 text-xs text-[#8899BB]"><li>📍 Abidjan, Côte d&apos;Ivoire</li><li>📞 +225 07 00 00 00</li><li>✉️ contact@soratech.ci</li><li>💬 WhatsApp Business</li><li>🕐 Lun-Ven : 8h-18h</li><li>🕐 Sam : 9h-14h</li></ul></div>
        </div>
        <div className="border-t border-[#1a2540] pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="text-xs text-[#8899BB]">© 2025 SORA TECH COMPANY — Tous droits réservés</div>
          <div className="text-xs text-[#8899BB]">Fait avec ❤️ à Abidjan par Sissoko Abdoulaye</div>
        </div>
      </footer>
    </div>
  );
}
