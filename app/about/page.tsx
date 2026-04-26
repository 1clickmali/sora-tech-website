"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Target, Telescope, Zap, Lightbulb, Users, Lock, Globe2, type LucideIcon } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useApp } from "../i18n/AppContext";

function ScanLine() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div animate={{ y: ["-5%", "105%"] }} transition={{ duration: 8, repeat: Infinity, ease: "linear", repeatDelay: 4 }}
        className="absolute left-0 right-0 h-[2px]"
        style={{ background: "linear-gradient(90deg, transparent, rgba(0,153,255,0.5), rgba(0,198,255,0.8), rgba(0,153,255,0.5), transparent)" }} />
    </div>
  );
}

export default function AboutPage() {
  const { t, lang } = useApp();
  const a = t.about;

  const valueIcons: LucideIcon[] = [Target, Lightbulb, Users, Lock, Zap, Globe2];
  const valueColors = ["#0099FF", "#FF6B00", "#00C48C", "#FF4757", "#9B93FF", "#00FF88"];

  const teamColors = ["#0099FF", "#FF6B00", "#00C48C"];
  const teamInitials = ["AS", "FK", "MD"];

  const timelineColors = ["#0099FF", "#FF6B00", "#00C48C", "#9B93FF", "#FF4757", "#00FF88"];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#0066FF] rounded-full blur-[150px] opacity-10 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FF6B00] rounded-full blur-[150px] opacity-10 animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <Navbar active="about" />

      {/* HERO */}
      <section className="relative py-24 md:py-32 px-6 text-center z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <ScanLine />
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-[#0099FF] text-xs tracking-[2px] px-4 py-1.5 rounded-full mb-6 border border-[#0066FF]"
            style={{ background: "var(--card)", boxShadow: "0 0 20px rgba(0,102,255,0.2)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />
            {a.badge}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-7xl font-black leading-tight mb-6 tracking-tight">
            {a.title}{" "}
            <motion.span animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 5, repeat: Infinity }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] via-[#0099FF] to-[#FF6B00]" style={{ backgroundSize: "200% 200%" }}>
              {a.gradient}
            </motion.span>
            <br />{a.title2}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--muted)" }}>
            {a.subtitle}
          </motion.p>
        </div>
      </section>

      {/* MISSION / VISION */}
      <section className="relative py-16 px-6 z-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          {[
            { icon: Target,    title: lang === "fr" ? "Notre Mission" : "Our Mission", color: "#0066FF",
              text: lang === "fr"
                ? "Rendre la technologie accessible à toutes les entreprises ivoiriennes et africaines, peu importe leur taille."
                : "Make technology accessible to all businesses in Côte d'Ivoire and Africa, regardless of size." },
            { icon: Telescope, title: lang === "fr" ? "Notre Vision"  : "Our Vision",  color: "#FF6B00",
              text: lang === "fr"
                ? "Faire d'Abidjan un hub technologique majeur en Afrique de l'Ouest et devenir la référence en digitalisation."
                : "Make Abidjan a major tech hub in West Africa and become the reference for digitalization." },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: i === 0 ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="rounded-2xl p-8 border" style={{ background: `linear-gradient(135deg, ${item.color}15, ${item.color}05)`, borderColor: `${item.color}40` }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${item.color}15`, border: `1px solid ${item.color}40` }}>
                <item.icon className="w-7 h-7" style={{ color: item.color }} />
              </div>
              <h3 className="text-2xl font-black mb-3" style={{ color: "var(--text)" }}>{item.title}</h3>
              <p className="leading-relaxed text-sm" style={{ color: "var(--muted)" }}>{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="relative py-16 px-6 z-10" style={{ background: "var(--bg2)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-[10px] tracking-[4px] text-[#0099FF] mb-8 font-mono text-center">{a.statsLabel}</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {a.stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }} className="border rounded-2xl p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <div className="text-4xl font-black font-mono" style={{ color: valueColors[i] }}>{s.n}</div>
                <div className="text-[10px] tracking-widest mt-2 font-mono" style={{ color: "var(--muted)" }}>{s.l}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* VALEURS */}
      <section className="relative py-20 px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <div className="text-[10px] tracking-[4px] text-[#FF6B00] mb-2 font-mono">{a.valuesLabel}</div>
            <h2 className="text-3xl md:text-5xl font-black" style={{ color: "var(--text)" }}>{a.valuesTitle}</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {a.values.map((v, i) => {
              const Icon = valueIcons[i];
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }} whileHover={{ y: -8, boxShadow: `0 10px 30px ${valueColors[i]}20` }}
                  className="border rounded-2xl p-6 transition-all duration-300 group"
                  style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${valueColors[i]}15`, border: `1px solid ${valueColors[i]}40` }}>
                    <Icon className="w-6 h-6" style={{ color: valueColors[i] }} />
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text)" }}>{v.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ÉQUIPE */}
      <section className="relative py-20 px-6 z-10" style={{ background: "var(--bg2)" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <div className="text-[10px] tracking-[4px] text-[#00C48C] mb-2 font-mono">{a.teamLabel}</div>
            <h2 className="text-3xl md:text-5xl font-black" style={{ color: "var(--text)" }}>{a.teamTitle}</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {a.team.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }} whileHover={{ y: -5, boxShadow: `0 10px 30px ${teamColors[i]}25` }}
                className="border rounded-2xl p-6 text-center transition-all duration-300"
                style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-2xl font-black mb-4 shadow-lg text-white"
                  style={{ backgroundColor: teamColors[i], boxShadow: `0 0 20px ${teamColors[i]}40` }}>{teamInitials[i]}</div>
                <h3 className="text-base font-bold mb-1" style={{ color: "var(--text)" }}>{m.name}</h3>
                <div className="text-xs font-bold mb-2 font-mono" style={{ color: teamColors[i] }}>{m.role}</div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{m.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="relative py-20 px-6 z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <div className="text-[10px] tracking-[4px] text-[#0099FF] mb-2 font-mono">{a.timelineLabel}</div>
            <h2 className="text-3xl md:text-5xl font-black" style={{ color: "var(--text)" }}>{a.timelineTitle}</h2>
          </motion.div>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block" style={{ background: "linear-gradient(to bottom, transparent, #0066FF, #0099FF, transparent)" }} />
            {a.timeline.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }} className={`relative mb-8 md:w-1/2 ${i % 2 === 0 ? "md:pr-10 md:text-right" : "md:ml-auto md:pl-10"}`}>
                <div className="hidden md:block absolute top-6 w-3 h-3 rounded-full border-2"
                  style={{ [i % 2 === 0 ? "right" : "left"]: "-7px", backgroundColor: timelineColors[i], borderColor: "var(--bg)", boxShadow: `0 0 10px ${timelineColors[i]}` }} />
                <div className="border rounded-2xl p-6 transition-all duration-300 hover:border-[#0066FF]"
                  style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  <div className="text-2xl font-black font-mono mb-2" style={{ color: timelineColors[i] }}>{item.year}</div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text)" }}>{item.title}</h3>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 px-6 text-center z-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="max-w-3xl mx-auto border border-[#0066FF]/50 rounded-3xl p-10 md:p-14 backdrop-blur relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(0,102,255,0.1), rgba(255,107,0,0.05))" }}>
          <ScanLine />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-4" style={{ color: "var(--text)" }}>{a.ctaTitle}</h2>
            <p className="mb-8" style={{ color: "var(--muted)" }}>{a.ctaDesc}</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/devis">
                <motion.button whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,102,255,0.5)" }} whileTap={{ scale: 0.95 }}
                  className="bg-[#0066FF] px-8 py-3.5 rounded-xl font-bold text-sm text-white">{a.ctaDevis}</motion.button>
              </Link>
              <Link href="/contact">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="border border-[#0066FF] text-[#0099FF] px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-[#0066FF] hover:text-white transition-all">
                  {a.ctaContact}
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
