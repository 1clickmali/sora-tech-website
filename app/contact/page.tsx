"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  Phone, MessageCircle, Mail, MapPin, Clock, CheckCircle,
  Lock, Navigation, type LucideIcon,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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

type ContactMethod = {
  icon: LucideIcon;
  title: string;
  value: string;
  subtitle: string;
  color: string;
  action: string;
};

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "", service: "", budget: "", message: "",
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: form.service || 'Contact général',
          message: form.message,
        }),
      });
    } catch (_) {}
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({ name: "", email: "", phone: "", company: "", service: "", budget: "", message: "" });
    }, 4000);
  };

  const contactMethods: ContactMethod[] = [
    { icon: Phone,         title: "Téléphone", value: "+225 07 04 92 80 68", subtitle: "Lun-Ven : 8h-18h",        color: "#0099FF", action: "Appeler"    },
    { icon: MessageCircle, title: "WhatsApp",   value: "+225 07 04 92 80 68", subtitle: "Réponse rapide garantie", color: "#25D366", action: "Écrire"     },
    { icon: Mail,          title: "Email",      value: "contact@soratech.ci", subtitle: "Réponse sous 24h",        color: "#FF6B00", action: "Envoyer"    },
    { icon: MapPin,        title: "Adresse",    value: "Abidjan, Côte d'Ivoire", subtitle: "Cocody - Angré 8ème", color: "#9B93FF", action: "Itinéraire" },
  ];

  const faqs = [
    { q: "Dans quels délais répondez-vous ?",           a: "Nous répondons à toutes les demandes en moins de 24 heures, et souvent en quelques heures seulement pour WhatsApp." },
    { q: "Proposez-vous des consultations gratuites ?", a: "Oui ! La première consultation de 30-45 minutes est 100% gratuite et sans engagement, en visio ou à Abidjan." },
    { q: "Travaillez-vous en dehors d'Abidjan ?",       a: "Absolument. Nous servons toute la Côte d'Ivoire et la sous-région. Les réunions se font en visio et nous nous déplaçons pour les gros projets." },
    { q: "Quels sont vos horaires d'ouverture ?",       a: "Lundi-Vendredi : 8h-18h | Samedi : 9h-14h | WhatsApp 24/7 pour les urgences." },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#0066FF] rounded-full blur-[150px] opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#25D366] rounded-full blur-[150px] opacity-15 animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <Navbar active="contact" />

      {/* HERO */}
      <section className="relative py-20 md:py-24 px-6 text-center z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(#1a2540 1px, transparent 1px), linear-gradient(90deg, #1a2540 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <ScanLine />
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-[#0A1A3A] border border-[#0066FF] text-[#0099FF] text-xs tracking-[2px] px-4 py-1.5 rounded-full mb-6">
            <MessageCircle className="w-3 h-3" />
            NOUS CONTACTER
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-black leading-tight mb-6 tracking-tight">
            Parlons de votre{" "}
            <motion.span
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] via-[#0099FF] to-[#FF6B00]"
              style={{ backgroundSize: "200% 200%" }}
            >
              projet
            </motion.span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="text-[#8899BB] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Notre équipe est là pour répondre à toutes vos questions. Consultation gratuite et sans engagement.
          </motion.p>
        </div>
      </section>

      {/* CONTACT METHODS */}
      <section className="relative py-8 px-6 z-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-4">
          {contactMethods.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="backdrop-blur rounded-2xl p-5 text-center cursor-pointer transition group border" style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 mx-auto transition-all duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${m.color}15`, border: `1px solid ${m.color}40`, boxShadow: `0 0 20px ${m.color}15` }}
              >
                <m.icon className="w-7 h-7" style={{ color: m.color }} />
              </div>
              <div className="text-xs tracking-wider mb-1 font-bold" style={{ color: m.color }}>{m.title.toUpperCase()}</div>
              <div className="text-sm font-bold mb-1" style={{ color: "var(--text)" }}>{m.value}</div>
              <div className="text-xs mb-3" style={{ color: "var(--muted)" }}>{m.subtitle}</div>
              {m.title === 'Téléphone' && <motion.a href="tel:+2250704928068" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="text-xs font-bold hover:underline" style={{ color: m.color }}>{m.action} →</motion.a>}
              {m.title === 'WhatsApp' && <motion.a href="https://wa.me/2250704928068" target="_blank" rel="noopener" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="text-xs font-bold hover:underline" style={{ color: m.color }}>{m.action} →</motion.a>}
              {m.title === 'Email' && <motion.a href="mailto:contact@soratech.ci" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="text-xs font-bold hover:underline" style={{ color: m.color }}>{m.action} →</motion.a>}
              {m.title === 'Adresse' && <motion.a href="https://www.google.com/maps/search/Cocody+Angré+Abidjan" target="_blank" rel="noopener" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="text-xs font-bold hover:underline" style={{ color: m.color }}>{m.action} →</motion.a>}
            </motion.div>
          ))}
        </div>
      </section>

      {/* FORM + INFO */}
      <section className="relative py-16 px-6 z-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">

          {/* FORM */}
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="backdrop-blur rounded-2xl p-6 md:p-8 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="mb-6">
                <div className="text-xs tracking-[3px] text-[#0099FF] mb-2">ENVOYEZ-NOUS UN MESSAGE</div>
                <h2 className="text-2xl md:text-3xl font-black">Formulaire de contact</h2>
              </div>

              {sent ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#00C48C]/10 border border-[#00C48C] rounded-xl p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{ background: "rgba(0,196,140,0.15)", border: "2px solid rgba(0,196,140,0.5)", boxShadow: "0 0 30px rgba(0,196,140,0.3)" }}
                  >
                    <CheckCircle className="w-10 h-10 text-[#00C48C]" />
                  </motion.div>
                  <h3 className="text-xl font-black mb-2">Message envoyé !</h3>
                  <p className="text-sm text-[#8899BB]">Notre équipe vous répondra dans les 24 heures.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#8899BB] tracking-wide uppercase font-bold block mb-1.5">Nom complet *</label>
                      <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Votre nom" className="w-full border rounded-lg px-4 py-3 text-sm outline-none focus:border-[#0066FF] transition" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                    </div>
                    <div>
                      <label className="text-xs text-[#8899BB] tracking-wide uppercase font-bold block mb-1.5">Entreprise</label>
                      <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                        placeholder="Nom entreprise" className="w-full border rounded-lg px-4 py-3 text-sm outline-none focus:border-[#0066FF] transition" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#8899BB] tracking-wide uppercase font-bold block mb-1.5">Email *</label>
                      <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="vous@email.com" className="w-full border rounded-lg px-4 py-3 text-sm outline-none focus:border-[#0066FF] transition" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                    </div>
                    <div>
                      <label className="text-xs text-[#8899BB] tracking-wide uppercase font-bold block mb-1.5">Téléphone WhatsApp *</label>
                      <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+225 07 00 00 00" className="w-full border rounded-lg px-4 py-3 text-sm outline-none focus:border-[#0066FF] transition" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[#8899BB] tracking-wide uppercase font-bold block mb-1.5">Type de projet</label>
                    <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className="w-full border rounded-lg px-4 py-3 text-sm outline-none focus:border-[#0066FF] cursor-pointer transition" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}>
                      <option value="">Sélectionnez un service</option>
                      <option>Site web (vitrine, e-commerce)</option>
                      <option>Logiciel de gestion</option>
                      <option>Application mobile</option>
                      <option>ERP complet</option>
                      <option>Cybersécurité</option>
                      <option>Maintenance informatique</option>
                      <option>Autre / Projet personnalisé</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-[#8899BB] tracking-wide uppercase font-bold block mb-1.5">Budget estimé</label>
                    <select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      className="w-full border rounded-lg px-4 py-3 text-sm outline-none focus:border-[#0066FF] cursor-pointer transition" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}>
                      <option value="">Sélectionnez votre budget</option>
                      <option>Moins de 200 000 FCFA</option>
                      <option>200 000 - 500 000 FCFA</option>
                      <option>500 000 - 1 000 000 FCFA</option>
                      <option>1 000 000 - 3 000 000 FCFA</option>
                      <option>Plus de 3 000 000 FCFA</option>
                      <option>À définir ensemble</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-[#8899BB] tracking-wide uppercase font-bold block mb-1.5">Décrivez votre projet *</label>
                    <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Dites-nous tout sur votre projet, vos besoins, vos objectifs..."
                      className="w-full border rounded-lg px-4 py-3 text-sm outline-none focus:border-[#0066FF] resize-none transition" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                  </div>

                  <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full bg-[#0066FF] hover:bg-[#0099FF] transition py-4 rounded-lg font-bold text-sm">
                    Envoyer ma demande →
                  </motion.button>

                  <p className="text-[10px] text-[#8899BB] text-center flex items-center justify-center gap-1.5">
                    <Lock className="w-3 h-3" />
                    Vos données sont 100% sécurisées et ne seront jamais partagées.
                  </p>
                </form>
              )}
            </div>
          </motion.div>

          {/* RIGHT PANEL */}
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-5">

            {/* MAP MOCK */}
            <div className="backdrop-blur rounded-2xl overflow-hidden border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="h-48 bg-gradient-to-br from-[#0066FF]/30 to-[#00C48C]/20 flex items-center justify-center relative">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(#1a2540 1px, transparent 1px), linear-gradient(90deg, #1a2540 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
                <div className="relative text-center z-10">
                  <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
                    style={{ background: "rgba(0,153,255,0.2)", border: "2px solid rgba(0,153,255,0.5)", boxShadow: "0 0 30px rgba(0,153,255,0.3)" }}>
                    <MapPin className="w-8 h-8 text-[#0099FF]" />
                  </div>
                  <div className="text-sm font-bold">SORA TECH COMPANY</div>
                  <div className="text-xs text-[#8899BB]">Cocody - Angré 8ème Tranche</div>
                  <div className="text-xs text-[#8899BB]">Abidjan, Côte d&apos;Ivoire</div>
                </div>
              </div>
              <div className="p-5">
                <motion.a href="https://www.google.com/maps/search/Cocody+Angré+Abidjan" target="_blank" rel="noopener" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="w-full bg-[#0066FF] hover:bg-[#0099FF] transition py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2">
                  <Navigation className="w-4 h-4" />
                  Voir sur Google Maps
                </motion.a>
              </div>
            </div>

            {/* HOURS */}
            <div className="backdrop-blur rounded-2xl p-5 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <h3 className="text-base font-black mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#0099FF]" />
                Nos horaires
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between pb-2 border-b" style={{ borderColor: "var(--border)" }}>
                  <span style={{ color: "var(--muted)" }}>Lundi - Vendredi</span>
                  <span className="font-bold text-[#00C48C]">8h00 - 18h00</span>
                </div>
                <div className="flex justify-between pb-2 border-b" style={{ borderColor: "var(--border)" }}>
                  <span style={{ color: "var(--muted)" }}>Samedi</span>
                  <span className="font-bold text-[#00C48C]">9h00 - 14h00</span>
                </div>
                <div className="flex justify-between pb-2 border-b" style={{ borderColor: "var(--border)" }}>
                  <span className="text-[#8899BB]">Dimanche</span>
                  <span className="font-bold text-[#FF4757]">Fermé</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-[#8899BB]">WhatsApp urgences</span>
                  <span className="font-bold text-[#25D366]">24/7</span>
                </div>
              </div>
            </div>

            {/* SOCIAL */}
            <div className="backdrop-blur rounded-2xl p-5 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <h3 className="text-base font-black mb-4 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#0099FF]" />
                Suivez-nous
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <motion.a href="https://facebook.com/soratechci" target="_blank" rel="noopener" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-[#1877F2]/20 hover:bg-[#1877F2] border border-[#1877F2] rounded-lg p-3 text-xs font-bold transition flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 rounded flex items-center justify-center bg-[#1877F2] text-white text-[10px] font-black leading-none">f</span>
                  Facebook
                </motion.a>
                <motion.a href="https://instagram.com/soratechci" target="_blank" rel="noopener" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-[#E4405F]/20 hover:bg-[#E4405F] border border-[#E4405F] rounded-lg p-3 text-xs font-bold transition flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 rounded flex items-center justify-center bg-[#E4405F] text-white text-[9px] font-black leading-none">ig</span>
                  Instagram
                </motion.a>
                <motion.a href="https://linkedin.com/company/soratech" target="_blank" rel="noopener" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-[#0A66C2]/20 hover:bg-[#0A66C2] border border-[#0A66C2] rounded-lg p-3 text-xs font-bold transition flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 rounded flex items-center justify-center bg-[#0A66C2] text-white text-[9px] font-black leading-none">in</span>
                  LinkedIn
                </motion.a>
                <motion.a href="https://wa.me/2250704928068" target="_blank" rel="noopener" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-[#25D366]/20 hover:bg-[#25D366] border border-[#25D366] rounded-lg p-3 text-xs font-bold transition flex items-center gap-2 justify-center">
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  WhatsApp
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-16 px-6 backdrop-blur z-10" style={{ background: "var(--bg2)" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <div className="text-xs tracking-[3px] text-[#9B93FF] mb-2">QUESTIONS FRÉQUENTES</div>
            <h2 className="text-3xl md:text-4xl font-black">FAQ Contact</h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <motion.details
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl overflow-hidden transition group border hover:border-[#0066FF]" style={{ background: "var(--card)", borderColor: "var(--border)" }}
              >
                <summary className="cursor-pointer p-5 flex justify-between items-center font-bold text-sm list-none">
                  <span>{f.q}</span>
                  <span className="text-[#0099FF] group-open:rotate-45 transition-transform text-xl">+</span>
                </summary>
                <div className="px-5 pb-5 text-sm text-[#8899BB] leading-relaxed">{f.a}</div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 px-6 z-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="max-w-4xl mx-auto grid md:grid-cols-2 gap-4">
          <a href="tel:+22507000000" className="block">
            <motion.div whileHover={{ scale: 1.02, borderColor: "#0066FF" }}
              className="bg-gradient-to-br from-[#0066FF]/20 to-[#0099FF]/5 border border-[#0066FF] rounded-2xl p-6 cursor-pointer transition">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: "rgba(0,102,255,0.2)", border: "1px solid rgba(0,102,255,0.5)" }}>
                <Phone className="w-6 h-6 text-[#0099FF]" />
              </div>
              <div className="text-lg font-black mb-1">Appelez maintenant</div>
              <div className="text-sm text-[#0099FF] font-bold font-mono">+225 07 04 92 80 68</div>
              <div className="text-xs text-[#8899BB] mt-2">Réponse immédiate pendant les heures d&apos;ouverture</div>
            </motion.div>
          </a>
          <a href="https://wa.me/2250704928068" target="_blank" rel="noopener" className="block">
            <motion.div whileHover={{ scale: 1.02, borderColor: "#25D366" }}
              className="bg-gradient-to-br from-[#25D366]/20 to-[#25D366]/5 border border-[#25D366] rounded-2xl p-6 cursor-pointer transition">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: "rgba(37,211,102,0.2)", border: "1px solid rgba(37,211,102,0.5)" }}>
                <MessageCircle className="w-6 h-6 text-[#25D366]" />
              </div>
              <div className="text-lg font-black mb-1">Écrivez sur WhatsApp</div>
              <div className="text-sm text-[#25D366] font-bold font-mono">+225 07 04 92 80 68</div>
              <div className="text-xs text-[#8899BB] mt-2">Le canal préféré de nos clients, réponse rapide</div>
            </motion.div>
          </a>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
