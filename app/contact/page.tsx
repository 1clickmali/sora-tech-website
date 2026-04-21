"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import MobileMenu from "../components/MobileMenu";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    budget: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({ name: "", email: "", phone: "", company: "", service: "", budget: "", message: "" });
    }, 4000);
  };

  const contactMethods = [
    { icon: "📞", title: "Téléphone", value: "+225 07 00 00 00 00", subtitle: "Lun-Ven : 8h-18h", color: "#0099FF", action: "Appeler" },
    { icon: "💬", title: "WhatsApp", value: "+225 07 00 00 00 00", subtitle: "Réponse rapide garantie", color: "#25D366", action: "Écrire" },
    { icon: "✉️", title: "Email", value: "contact@soratech.ci", subtitle: "Réponse sous 24h", color: "#FF6B00", action: "Envoyer" },
    { icon: "📍", title: "Adresse", value: "Abidjan, Côte d'Ivoire", subtitle: "Cocody - Angré 8ème", color: "#9B93FF", action: "Itinéraire" },
  ];

  const faqs = [
    { q: "Dans quels délais répondez-vous ?", a: "Nous répondons à toutes les demandes en moins de 24 heures, et souvent en quelques heures seulement pour WhatsApp." },
    { q: "Proposez-vous des consultations gratuites ?", a: "Oui ! La première consultation de 30-45 minutes est 100% gratuite et sans engagement, en visio ou à Abidjan." },
    { q: "Travaillez-vous en dehors d'Abidjan ?", a: "Absolument. Nous servons toute la Côte d'Ivoire et la sous-région. Les réunions se font en visio et nous nous déplaçons pour les gros projets." },
    { q: "Quels sont vos horaires d'ouverture ?", a: "Lundi-Vendredi : 8h-18h | Samedi : 9h-14h | WhatsApp 24/7 pour les urgences." },
  ];

  return (
    <div className="min-h-screen bg-[#060D1F] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#0066FF] rounded-full blur-[150px] opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#25D366] rounded-full blur-[150px] opacity-15 animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* NAV */}
      <nav className="relative border-b border-[#1a2540] px-6 md:px-12 py-4 flex items-center justify-between sticky top-0 bg-[#060D1F]/80 backdrop-blur-xl z-50">
        <Link href="/" className="text-xl font-black tracking-[3px]">
          SORA<span className="text-[#0099FF]">TECH</span>
        </Link>
        <div className="hidden lg:flex items-center gap-6">
          <Link href="/" className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Accueil</Link>
          <Link href="/services" className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Services</Link>
          <Link href="/about" className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">À propos</Link>
          <Link href="/blog" className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Blog</Link>
          <Link href="/projets" className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Projets</Link>
          <Link href="/boutique" className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Boutique</Link>
          <Link href="/devis" className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Devis & RDV</Link>
          <Link href="/contact" className="text-xs uppercase tracking-widest text-[#0099FF] font-bold">Contact</Link>
        </div>
        <div className="flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden sm:block bg-[#0066FF] hover:bg-[#0099FF] transition px-4 py-2 rounded-md text-xs font-bold tracking-wide">
            +225 07 00 00 00
          </motion.button>
          <MobileMenu active="contact" />
        </div>
      </nav>

      {/* HERO */}
      <section className="relative py-20 md:py-24 px-6 text-center z-10">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(#1a2540 1px, transparent 1px), linear-gradient(90deg, #1a2540 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block bg-[#0A1A3A] border border-[#0066FF] text-[#0099FF] text-xs tracking-[2px] px-4 py-1.5 rounded-full mb-6">
            ✨ NOUS CONTACTER
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-4xl md:text-6xl font-black leading-tight mb-6 tracking-tight">
            Parlons de votre <motion.span animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 5, repeat: Infinity }} className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] via-[#0099FF] to-[#FF6B00]" style={{ backgroundSize: "200% 200%" }}>projet</motion.span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-[#8899BB] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Notre équipe est là pour répondre à toutes vos questions. Consultation gratuite et sans engagement.
          </motion.p>
        </div>
      </section>

      {/* MÉTHODES DE CONTACT */}
      <section className="relative py-8 px-6 z-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-4">
          {contactMethods.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5, borderColor: m.color, boxShadow: `0 10px 30px ${m.color}20` }}
              className="bg-[#0A1525]/80 backdrop-blur border border-[#1a2540] rounded-2xl p-5 text-center cursor-pointer transition"
            >
              <div className="text-4xl mb-3">{m.icon}</div>
              <div className="text-xs tracking-wider mb-1 font-bold" style={{ color: m.color }}>{m.title.toUpperCase()}</div>
              <div className="text-sm font-bold mb-1">{m.value}</div>
              <div className="text-xs text-[#8899BB] mb-3">{m.subtitle}</div>
              <button className="text-xs font-bold hover:underline" style={{ color: m.color }}>{m.action} →</button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FORMULAIRE + INFO */}
      <section className="relative py-16 px-6 z-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">

          {/* FORMULAIRE */}
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="bg-[#0A1525]/80 backdrop-blur border border-[#1a2540] rounded-2xl p-6 md:p-8">
              <div className="mb-6">
                <div className="text-xs tracking-[3px] text-[#0099FF] mb-2">ENVOYEZ-NOUS UN MESSAGE</div>
                <h2 className="text-2xl md:text-3xl font-black">Formulaire de contact</h2>
              </div>

              {sent ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#00C48C]/10 border border-[#00C48C] rounded-xl p-8 text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-xl font-black mb-2">Message envoyé !</h3>
                  <p className="text-sm text-[#8899BB]">Notre équipe vous répondra dans les 24 heures.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#8899BB] tracking-wide uppercase font-bold block mb-1.5">Nom complet *</label>
                      <input type="text" required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Votre nom" className="w-full bg-[#060D1F] border border-[#1a2540] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#0066FF]" />
                    </div>
                    <div>
                      <label className="text-xs text-[#8899BB] tracking-wide uppercase font-bold block mb-1.5">Entreprise</label>
                      <input type="text" value={form.company} onChange={(e) => setForm({...form, company: e.target.value})} placeholder="Nom entreprise" className="w-full bg-[#060D1F] border border-[#1a2540] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#0066FF]" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#8899BB] tracking-wide uppercase font-bold block mb-1.5">Email *</label>
                      <input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="vous@email.com" className="w-full bg-[#060D1F] border border-[#1a2540] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#0066FF]" />
                    </div>
                    <div>
                      <label className="text-xs text-[#8899BB] tracking-wide uppercase font-bold block mb-1.5">Téléphone WhatsApp *</label>
                      <input type="tel" required value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} placeholder="+225 07 00 00 00" className="w-full bg-[#060D1F] border border-[#1a2540] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#0066FF]" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[#8899BB] tracking-wide uppercase font-bold block mb-1.5">Type de projet</label>
                    <select value={form.service} onChange={(e) => setForm({...form, service: e.target.value})} className="w-full bg-[#060D1F] border border-[#1a2540] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#0066FF] cursor-pointer">
                      <option value="">Sélectionnez un service</option>
                      <option>🌐 Site web (vitrine, e-commerce)</option>
                      <option>🖥️ Logiciel de gestion</option>
                      <option>📱 Application mobile</option>
                      <option>⚙️ ERP complet</option>
                      <option>🔐 Cybersécurité</option>
                      <option>🔧 Maintenance informatique</option>
                      <option>💼 Autre / Projet personnalisé</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-[#8899BB] tracking-wide uppercase font-bold block mb-1.5">Budget estimé</label>
                    <select value={form.budget} onChange={(e) => setForm({...form, budget: e.target.value})} className="w-full bg-[#060D1F] border border-[#1a2540] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#0066FF] cursor-pointer">
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
                    <textarea required rows={5} value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} placeholder="Dites-nous tout sur votre projet, vos besoins, vos objectifs..." className="w-full bg-[#060D1F] border border-[#1a2540] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#0066FF] resize-none" />
                  </div>

                  <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-[#0066FF] py-4 rounded-lg font-bold text-sm">
                    Envoyer ma demande →
                  </motion.button>

                  <p className="text-[10px] text-[#8899BB] text-center">🔒 Vos données sont 100% sécurisées et ne seront jamais partagées.</p>
                </form>
              )}
            </div>
          </motion.div>

          {/* INFO DROITE */}
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-5">

            {/* CARTE ABIDJAN (MOCK) */}
            <div className="bg-[#0A1525]/80 backdrop-blur border border-[#1a2540] rounded-2xl overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-[#0066FF]/30 to-[#00C48C]/20 flex items-center justify-center relative">
                <div className="text-center">
                  <div className="text-6xl mb-2">📍</div>
                  <div className="text-sm font-bold">SORA TECH COMPANY</div>
                  <div className="text-xs text-[#8899BB]">Cocody - Angré 8ème Tranche</div>
                  <div className="text-xs text-[#8899BB]">Abidjan, Côte d&apos;Ivoire</div>
                </div>
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(#1a2540 1px, transparent 1px), linear-gradient(90deg, #1a2540 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
              </div>
              <div className="p-5">
                <button className="w-full bg-[#0066FF] py-3 rounded-lg font-bold text-sm hover:bg-[#0099FF] transition">
                  🗺️ Voir sur Google Maps
                </button>
              </div>
            </div>

            {/* HORAIRES */}
            <div className="bg-[#0A1525]/80 backdrop-blur border border-[#1a2540] rounded-2xl p-5">
              <h3 className="text-base font-black mb-4 flex items-center gap-2">🕐 Nos horaires</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between pb-2 border-b border-[#1a2540]">
                  <span className="text-[#8899BB]">Lundi - Vendredi</span>
                  <span className="font-bold text-[#00C48C]">8h00 - 18h00</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#1a2540]">
                  <span className="text-[#8899BB]">Samedi</span>
                  <span className="font-bold text-[#00C48C]">9h00 - 14h00</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#1a2540]">
                  <span className="text-[#8899BB]">Dimanche</span>
                  <span className="font-bold text-[#FF4757]">Fermé</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-[#8899BB]">WhatsApp urgences</span>
                  <span className="font-bold text-[#25D366]">24/7</span>
                </div>
              </div>
            </div>

            {/* RÉSEAUX SOCIAUX */}
            <div className="bg-[#0A1525]/80 backdrop-blur border border-[#1a2540] rounded-2xl p-5">
              <h3 className="text-base font-black mb-4 flex items-center gap-2">🌐 Suivez-nous</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-[#1877F2]/20 hover:bg-[#1877F2] border border-[#1877F2] rounded-lg p-3 text-xs font-bold transition flex items-center gap-2 justify-center">
                  📘 Facebook
                </button>
                <button className="bg-[#E4405F]/20 hover:bg-[#E4405F] border border-[#E4405F] rounded-lg p-3 text-xs font-bold transition flex items-center gap-2 justify-center">
                  📷 Instagram
                </button>
                <button className="bg-[#0A66C2]/20 hover:bg-[#0A66C2] border border-[#0A66C2] rounded-lg p-3 text-xs font-bold transition flex items-center gap-2 justify-center">
                  💼 LinkedIn
                </button>
                <button className="bg-[#25D366]/20 hover:bg-[#25D366] border border-[#25D366] rounded-lg p-3 text-xs font-bold transition flex items-center gap-2 justify-center">
                  💬 WhatsApp
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-16 px-6 bg-[#080F20]/80 backdrop-blur z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <div className="text-xs tracking-[3px] text-[#9B93FF] mb-2">QUESTIONS FRÉQUENTES</div>
            <h2 className="text-3xl md:text-4xl font-black">FAQ Contact</h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <motion.details key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="bg-[#0A1525]/80 border border-[#1a2540] hover:border-[#0066FF] rounded-xl overflow-hidden transition group">
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

      {/* CTA RAPIDE */}
      <section className="relative py-16 px-6 z-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-4xl mx-auto grid md:grid-cols-2 gap-4">
          <a href="tel:+22507000000" className="block">
            <motion.div whileHover={{ scale: 1.02, borderColor: "#0066FF" }} className="bg-gradient-to-br from-[#0066FF]/20 to-[#0099FF]/5 border border-[#0066FF] rounded-2xl p-6 cursor-pointer transition">
              <div className="text-3xl mb-2">📞</div>
              <div className="text-lg font-black mb-1">Appelez maintenant</div>
              <div className="text-sm text-[#0099FF] font-bold">+225 07 00 00 00 00</div>
              <div className="text-xs text-[#8899BB] mt-2">Réponse immédiate pendant les heures d&apos;ouverture</div>
            </motion.div>
          </a>
          <a href="https://wa.me/22507000000" target="_blank" rel="noopener" className="block">
            <motion.div whileHover={{ scale: 1.02, borderColor: "#25D366" }} className="bg-gradient-to-br from-[#25D366]/20 to-[#25D366]/5 border border-[#25D366] rounded-2xl p-6 cursor-pointer transition">
              <div className="text-3xl mb-2">💬</div>
              <div className="text-lg font-black mb-1">Écrivez sur WhatsApp</div>
              <div className="text-sm text-[#25D366] font-bold">+225 07 00 00 00 00</div>
              <div className="text-xs text-[#8899BB] mt-2">Le canal préféré de nos clients, réponse rapide</div>
            </motion.div>
          </a>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="relative bg-[#040A14] border-t border-[#1a2540] py-12 px-6 z-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-lg font-black tracking-widest mb-3">SORA<span className="text-[#0099FF]">TECH</span></div>
            <p className="text-xs text-[#8899BB] leading-relaxed mb-4">Entreprise tech panafricaine qui digitalise les entreprises d&apos;Abidjan et de toute l&apos;Afrique de l&apos;Ouest.</p>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-[#1a2540] hover:bg-[#0066FF] rounded-lg flex items-center justify-center cursor-pointer transition text-xs">f</div>
              <div className="w-8 h-8 bg-[#1a2540] hover:bg-[#0066FF] rounded-lg flex items-center justify-center cursor-pointer transition text-xs">in</div>
              <div className="w-8 h-8 bg-[#1a2540] hover:bg-[#0066FF] rounded-lg flex items-center justify-center cursor-pointer transition text-xs">ig</div>
              <div className="w-8 h-8 bg-[#1a2540] hover:bg-[#25D366] rounded-lg flex items-center justify-center cursor-pointer transition text-xs">wa</div>
            </div>
          </div>
          <div>
            <h4 className="text-xs tracking-wider text-white mb-3 font-bold">SERVICES</h4>
            <ul className="space-y-2 text-xs text-[#8899BB]">
              <li className="hover:text-[#0099FF] cursor-pointer transition">Sites web</li>
              <li className="hover:text-[#0099FF] cursor-pointer transition">Logiciels de gestion</li>
              <li className="hover:text-[#0099FF] cursor-pointer transition">Applications mobiles</li>
              <li className="hover:text-[#0099FF] cursor-pointer transition">ERP entreprise</li>
              <li className="hover:text-[#0099FF] cursor-pointer transition">Cybersécurité</li>
              <li className="hover:text-[#0099FF] cursor-pointer transition">Maintenance</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs tracking-wider text-white mb-3 font-bold">ENTREPRISE</h4>
            <ul className="space-y-2 text-xs text-[#8899BB]">
              <li className="hover:text-[#0099FF] cursor-pointer transition">À propos de nous</li>
              <li className="hover:text-[#0099FF] cursor-pointer transition">Blog SORA TECH</li>
              <li className="hover:text-[#0099FF] cursor-pointer transition">Nos réalisations</li>
              <li className="hover:text-[#0099FF] cursor-pointer transition">Boutique digitale</li>
              <li className="hover:text-[#0099FF] cursor-pointer transition">Devis & RDV</li>
              <li className="hover:text-[#0099FF] cursor-pointer transition">Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs tracking-wider text-white mb-3 font-bold">CONTACT</h4>
            <ul className="space-y-2 text-xs text-[#8899BB]">
              <li>📍 Abidjan, Côte d&apos;Ivoire</li>
              <li>📞 +225 07 00 00 00</li>
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