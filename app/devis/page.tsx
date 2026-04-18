"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

type Service = {
  id: string;
  icon: string;
  name: string;
  basePrice: number;
  baseDays: number;
  color: string;
};

export default function DevisPage() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [complexity, setComplexity] = useState(1);
  const [modules, setModules] = useState(3);
  const [options, setOptions] = useState<{ [key: string]: boolean }>({});
  const [selectedDate, setSelectedDate] = useState("22 Avril 2025");
  const [selectedSlot, setSelectedSlot] = useState("11:00");
  const [clientInfo, setClientInfo] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const services: Service[] = [
    { id: "web", icon: "🌐", name: "Site web", basePrice: 400000, baseDays: 21, color: "#0099FF" },
    { id: "soft", icon: "🖥️", name: "Logiciel gestion", basePrice: 700000, baseDays: 45, color: "#FF6B00" },
    { id: "app", icon: "📱", name: "App mobile", basePrice: 1000000, baseDays: 60, color: "#00C48C" },
    { id: "erp", icon: "⚙️", name: "ERP complet", basePrice: 2000000, baseDays: 90, color: "#9B93FF" },
    { id: "cyber", icon: "🔐", name: "Cybersécurité", basePrice: 250000, baseDays: 14, color: "#FF4757" },
    { id: "maint", icon: "🔧", name: "Maintenance", basePrice: 150000, baseDays: 7, color: "#0066FF" },
  ];

  const availableOptions = [
    { id: "mm", name: "Paiement Mobile Money", price: 100000 },
    { id: "multi", name: "Multilingue (FR/EN)", price: 80000 },
    { id: "client", name: "Espace client sécurisé", price: 150000 },
    { id: "seo", name: "Optimisation SEO avancée", price: 60000 },
    { id: "wa", name: "Chat WhatsApp intégré", price: 50000 },
    { id: "form", name: "Formation équipe (4h)", price: 120000 },
  ];

  const calendar = {
    month: "Avril 2025",
    days: [
      { num: 31, other: true }, { num: 1, full: true }, { num: 2 }, { num: 3, full: true }, { num: 4 }, { num: 5 }, { num: 6, other: true },
      { num: 7 }, { num: 8, full: true }, { num: 9 }, { num: 10 }, { num: 11, full: true }, { num: 12 }, { num: 13, other: true },
      { num: 14 }, { num: 15 }, { num: 16 }, { num: 17 }, { num: 18, today: true }, { num: 19 }, { num: 20, other: true },
      { num: 21 }, { num: 22, selected: true }, { num: 23 }, { num: 24 }, { num: 25 }, { num: 26 }, { num: 27, other: true },
      { num: 28 }, { num: 29 }, { num: 30 }, { num: 1, other: true }, { num: 2, other: true }, { num: 3, other: true }, { num: 4, other: true },
    ]
  };

  const slots = [
    { time: "09:00", booked: true },
    { time: "10:00" },
    { time: "11:00" },
    { time: "14:00" },
    { time: "15:00" },
    { time: "16:00" },
    { time: "17:00", booked: true },
    { time: "Visio" },
  ];

  const formatPrice = (n: number) => n.toLocaleString("fr-FR").replace(/,/g, " ");
  const optsTotal = availableOptions.reduce((sum, o) => sum + (options[o.id] ? o.price : 0), 0);
  const totalPrice = selectedService ? Math.round((selectedService.basePrice * (1 + (complexity - 1) * 0.4) * (1 + (modules - 1) * 0.08) + optsTotal) / 1000) * 1000 : 0;
  const totalDays = selectedService ? Math.round(selectedService.baseDays * (1 + (complexity - 1) * 0.3) * (1 + (modules - 1) * 0.05)) : 0;

  const toggleOption = (id: string) => setOptions({ ...options, [id]: !options[id] });
  const submitDevis = () => { setSubmitted(true); };

  return (
    <div className="min-h-screen bg-[#060D1F] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#0066FF] rounded-full blur-[150px] opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FF6B00] rounded-full blur-[150px] opacity-15 animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* NAV */}
      <nav className="relative border-b border-[#1a2540] px-6 md:px-12 py-4 flex items-center justify-between sticky top-0 bg-[#060D1F]/80 backdrop-blur-xl z-50">
        <Link href="/" className="text-xl font-black tracking-[3px]">SORA<span className="text-[#0099FF]">TECH</span></Link>
        <div className="hidden lg:flex items-center gap-6">
          <Link href="/" className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Accueil</Link>
          <Link href="/services" className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Services</Link>
          <Link href="/about" className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">À propos</Link>
          <Link href="/blog" className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Blog</Link>
          <Link href="/projets" className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Projets</Link>
          <Link href="/boutique" className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Boutique</Link>
          <Link href="/devis" className="text-xs uppercase tracking-widest text-[#0099FF] font-bold">Devis & RDV</Link>
          <Link href="/contact" className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Contact</Link>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-[#0066FF] hover:bg-[#0099FF] transition px-4 py-2 rounded-md text-xs font-bold tracking-wide">+225 07 00 00 00</motion.button>
      </nav>

      {/* HERO */}
      <section className="relative py-16 md:py-20 px-6 text-center z-10">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(#1a2540 1px, transparent 1px), linear-gradient(90deg, #1a2540 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block bg-[#0A1A3A] border border-[#0066FF] text-[#0099FF] text-xs tracking-[2px] px-4 py-1.5 rounded-full mb-6">
            ✨ ESTIMATION + RENDEZ-VOUS
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-4xl md:text-6xl font-black leading-tight mb-4 tracking-tight">
            Obtenez votre devis <motion.span animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 5, repeat: Infinity }} className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] via-[#0099FF] to-[#FF6B00]" style={{ backgroundSize: "200% 200%" }}>en 2 minutes</motion.span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-[#8899BB] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Configurez votre projet, voyez le prix instantanément et réservez un rendez-vous avec notre équipe — tout en une seule démarche.
          </motion.p>
        </div>
      </section>

      {/* STEPPER */}
      <section className="relative px-6 pb-6 z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-1 bg-[#0A1525] border border-[#1a2540] rounded-xl p-2">
            {[
              { n: 1, label: "Votre projet" },
              { n: 2, label: "Configuration" },
              { n: 3, label: "Rendez-vous" },
              { n: 4, label: "Confirmation" }
            ].map((s) => (
              <button
                key={s.n}
                onClick={() => !submitted && s.n <= step && setStep(s.n)}
                className={`flex-1 py-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                  step === s.n ? "bg-[#0066FF] text-white" : s.n < step ? "text-[#00C48C]" : "text-[#8899BB]"
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  step === s.n ? "bg-white/25" : s.n < step ? "bg-[#00C48C] text-white" : "bg-[#1a2540]"
                }`}>
                  {s.n < step ? "✓" : s.n}
                </span>
                <span className="hidden md:inline">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CONTENU */}
      <section className="relative px-6 pb-20 z-10">
        <div className="max-w-5xl mx-auto">

          {/* ÉTAPE 1 : SERVICE */}
          <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="text-2xl font-black mb-2">Quel type de projet souhaitez-vous ?</h2>
              <p className="text-sm text-[#8899BB] mb-8">Sélectionnez un service pour commencer — vous pourrez affiner à l'étape suivante.</p>
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {services.map((s) => (
                  <motion.button
                    key={s.id}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedService(s)}
                    className={`p-6 rounded-2xl text-center transition border-2 ${
                      selectedService?.id === s.id
                        ? "border-[#0066FF] bg-[#0066FF]/10"
                        : "border-[#1a2540] bg-[#0A1525]/80 hover:border-[#0066FF]"
                    }`}
                  >
                    <div className="text-5xl mb-3">{s.icon}</div>
                    <div className="text-base font-bold mb-1" style={{ color: selectedService?.id === s.id ? s.color : "#fff" }}>{s.name}</div>
                    <div className="text-xs text-[#8899BB]">Dès {formatPrice(s.basePrice / 2)} F</div>
                  </motion.button>
                ))}
              </div>
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: selectedService ? 1.05 : 1 }}
                  whileTap={{ scale: selectedService ? 0.95 : 1 }}
                  onClick={() => selectedService && setStep(2)}
                  disabled={!selectedService}
                  className={`px-8 py-3 rounded-lg font-bold text-sm transition ${selectedService ? "bg-[#0066FF]" : "bg-[#1a2540] text-[#8899BB] cursor-not-allowed"}`}
                >
                  Continuer →
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ÉTAPE 2 : CONFIGURATION */}
          {step === 2 && selectedService && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="text-2xl font-black mb-2">Configurez votre projet</h2>
              <p className="text-sm text-[#8899BB] mb-8">Le prix et le délai se mettent à jour automatiquement.</p>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* CONFIG */}
                <div className="bg-[#0A1525]/80 border border-[#1a2540] rounded-2xl p-6">
                  <div className="mb-6">
                    <label className="text-xs text-[#8899BB] uppercase tracking-wide font-bold mb-3 block">Complexité du projet</label>
                    <div className="flex items-center gap-3">
                      <input type="range" min="1" max="3" step="1" value={complexity} onChange={(e) => setComplexity(Number(e.target.value))} className="flex-1 accent-[#0066FF]" />
                      <span className="text-xs font-bold min-w-[80px] text-right text-[#0099FF]">{["Simple", "Moyen", "Complexe"][complexity - 1]}</span>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="text-xs text-[#8899BB] uppercase tracking-wide font-bold mb-3 block">Modules / Pages</label>
                    <div className="flex items-center gap-3">
                      <input type="range" min="1" max="10" value={modules} onChange={(e) => setModules(Number(e.target.value))} className="flex-1 accent-[#0066FF]" />
                      <span className="text-xs font-bold min-w-[80px] text-right text-[#0099FF]">{modules} module{modules > 1 ? "s" : ""}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[#8899BB] uppercase tracking-wide font-bold mb-3">Options supplémentaires</div>
                    <div className="space-y-2">
                      {availableOptions.map((o) => (
                        <label key={o.id} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${options[o.id] ? "bg-[#00C48C]/10 border border-[#00C48C]" : "bg-[#060D1F] border border-[#1a2540] hover:border-[#0066FF]"}`}>
                          <input type="checkbox" checked={options[o.id] || false} onChange={() => toggleOption(o.id)} className="accent-[#00C48C]" />
                          <span className="text-xs flex-1">{o.name}</span>
                          <span className="text-xs font-bold text-[#8899BB]">+ {formatPrice(o.price)} F</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RÉSULTAT */}
                <div>
                  <div className="bg-gradient-to-br from-[#0066FF]/20 via-[#0099FF]/10 to-[#0066FF]/5 border border-[#0066FF] rounded-2xl p-6 mb-4 backdrop-blur">
                    <div className="text-[10px] text-[#8899BB] uppercase tracking-[2px] mb-2">Prix estimé</div>
                    <div className="text-4xl font-black text-[#0099FF] mb-1">{formatPrice(totalPrice)} FCFA</div>
                    <div className="text-sm text-[#FF6B00] font-bold">Délai : {totalDays} jours ouvrés</div>
                    <div className="text-[10px] text-[#8899BB] mt-3">* Estimation automatique — Un RDV confirmera le devis définitif</div>
                  </div>
                  <div className="bg-[#0A1525]/80 border border-[#1a2540] rounded-2xl p-5">
                    <div className="text-xs font-bold mb-3 uppercase tracking-wide">Votre configuration</div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between"><span className="text-[#8899BB]">Service</span><span className="font-bold">{selectedService.name}</span></div>
                      <div className="flex justify-between"><span className="text-[#8899BB]">Complexité</span><span className="font-bold">{["Simple", "Moyen", "Complexe"][complexity - 1]}</span></div>
                      <div className="flex justify-between"><span className="text-[#8899BB]">Modules</span><span className="font-bold">{modules}</span></div>
                      <div className="flex justify-between"><span className="text-[#8899BB]">Options</span><span className="font-bold">{Object.values(options).filter(Boolean).length} ajoutée(s)</span></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="px-6 py-3 rounded-lg font-bold text-sm border border-[#1a2540] text-[#8899BB]">← Retour</button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setStep(3)} className="bg-[#0066FF] px-8 py-3 rounded-lg font-bold text-sm">Réserver un RDV →</motion.button>
              </div>
            </motion.div>
          )}

          {/* ÉTAPE 3 : RDV */}
          {step === 3 && selectedService && (
            <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="text-2xl font-black mb-2">Choisissez une date et un créneau</h2>
              <p className="text-sm text-[#8899BB] mb-8">Prenez RDV avec notre équipe pour discuter de votre projet — gratuit et sans engagement.</p>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* CALENDRIER */}
                <div className="bg-[#0A1525]/80 border border-[#1a2540] rounded-2xl p-5">
                  <div className="flex justify-between items-center mb-4">
                    <button className="w-8 h-8 rounded-lg bg-[#060D1F] border border-[#1a2540] text-[#8899BB]">‹</button>
                    <div className="text-sm font-bold">{calendar.month}</div>
                    <button className="w-8 h-8 rounded-lg bg-[#060D1F] border border-[#1a2540] text-[#8899BB]">›</button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"].map((d) => (
                      <div key={d} className="text-[10px] text-[#8899BB] font-bold py-1">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {calendar.days.map((d, i) => (
                      <button
                        key={i}
                        disabled={d.full || d.other}
                        onClick={() => !d.full && !d.other && setSelectedDate(`${d.num} Avril 2025`)}
                        className={`text-xs py-2.5 rounded-lg transition ${
                          d.other ? "opacity-20 cursor-not-allowed" :
                          d.full ? "bg-[#FF4757]/10 text-[#FF4757] line-through cursor-not-allowed" :
                          d.selected || (selectedDate === `${d.num} Avril 2025`) ? "bg-[#0066FF] text-white font-bold" :
                          d.today ? "border border-[#FF6B00] text-[#FF6B00] font-bold" :
                          "bg-[#060D1F] hover:bg-[#1a2540] text-white"
                        }`}
                      >
                        {d.num}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3 text-[10px] text-[#8899BB] mt-4 pt-3 border-t border-[#1a2540]">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#FF4757]/30 rounded"></div>Complet</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 border border-[#FF6B00] rounded"></div>Aujourd&apos;hui</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#0066FF] rounded"></div>Sélectionné</div>
                  </div>
                  <div className="mt-5 pt-4 border-t border-[#1a2540]">
                    <div className="text-xs font-bold text-[#0099FF] mb-3">Créneaux disponibles — {selectedDate}</div>
                    <div className="grid grid-cols-4 gap-2">
                      {slots.map((s) => (
                        <button
                          key={s.time}
                          disabled={s.booked}
                          onClick={() => !s.booked && setSelectedSlot(s.time)}
                          className={`text-[11px] py-2 rounded-lg font-bold transition ${
                            s.booked ? "opacity-30 line-through cursor-not-allowed bg-[#060D1F]" :
                            selectedSlot === s.time ? "bg-[#0066FF] text-white" :
                            "bg-[#060D1F] border border-[#1a2540] hover:border-[#0066FF] text-white"
                          }`}
                        >
                          {s.time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* INFOS CLIENT */}
                <div className="space-y-4">
                  <div className="bg-[#0A1525]/80 border border-[#1a2540] rounded-2xl p-5">
                    <div className="text-xs font-bold mb-3 uppercase tracking-wide">Vos coordonnées</div>
                    <div className="space-y-3">
                      <input type="text" value={clientInfo.name} onChange={(e) => setClientInfo({...clientInfo, name: e.target.value})} placeholder="Nom complet *" className="w-full bg-[#060D1F] border border-[#1a2540] rounded-lg px-3 py-2.5 text-xs outline-none focus:border-[#0066FF]" />
                      <input type="tel" value={clientInfo.phone} onChange={(e) => setClientInfo({...clientInfo, phone: e.target.value})} placeholder="+225 07 00 00 00 *" className="w-full bg-[#060D1F] border border-[#1a2540] rounded-lg px-3 py-2.5 text-xs outline-none focus:border-[#0066FF]" />
                      <input type="email" value={clientInfo.email} onChange={(e) => setClientInfo({...clientInfo, email: e.target.value})} placeholder="Email *" className="w-full bg-[#060D1F] border border-[#1a2540] rounded-lg px-3 py-2.5 text-xs outline-none focus:border-[#0066FF]" />
                      <input type="text" value={clientInfo.company} onChange={(e) => setClientInfo({...clientInfo, company: e.target.value})} placeholder="Entreprise (facultatif)" className="w-full bg-[#060D1F] border border-[#1a2540] rounded-lg px-3 py-2.5 text-xs outline-none focus:border-[#0066FF]" />
                      <textarea value={clientInfo.message} onChange={(e) => setClientInfo({...clientInfo, message: e.target.value})} placeholder="Décrivez brièvement votre projet..." rows={3} className="w-full bg-[#060D1F] border border-[#1a2540] rounded-lg px-3 py-2.5 text-xs outline-none focus:border-[#0066FF] resize-none" />
                    </div>
                  </div>
                  <div className="bg-[#0A1525]/80 border border-[#1a2540] rounded-2xl p-5">
                    <div className="text-xs font-bold mb-3 uppercase tracking-wide">Récapitulatif du RDV</div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between"><span className="text-[#8899BB]">Service</span><span className="font-bold">{selectedService.name}</span></div>
                      <div className="flex justify-between"><span className="text-[#8899BB]">Date</span><span className="font-bold">{selectedDate}</span></div>
                      <div className="flex justify-between"><span className="text-[#8899BB]">Heure</span><span className="font-bold">{selectedSlot}</span></div>
                      <div className="flex justify-between"><span className="text-[#8899BB]">Durée</span><span className="font-bold">45 min</span></div>
                      <div className="flex justify-between pt-2 border-t border-[#1a2540]">
                        <span className="text-[#8899BB] text-xs uppercase tracking-wide">Devis estimé</span>
                        <span className="text-xl font-black text-[#0099FF]">{formatPrice(totalPrice)} F</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <button onClick={() => setStep(2)} className="px-6 py-3 rounded-lg font-bold text-sm border border-[#1a2540] text-[#8899BB]">← Retour</button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { if (clientInfo.name && clientInfo.phone && clientInfo.email) { setStep(4); submitDevis(); }}} className="bg-[#00C48C] px-8 py-3 rounded-lg font-bold text-sm">✓ Confirmer le RDV & devis</motion.button>
              </div>
            </motion.div>
          )}

          {/* ÉTAPE 4 : CONFIRMATION */}
          {step === 4 && submitted && (
            <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="text-8xl mb-6">🎉</motion.div>
              <h2 className="text-3xl md:text-4xl font-black mb-3 text-[#00C48C]">Rendez-vous confirmé !</h2>
              <p className="text-sm text-[#8899BB] max-w-xl mx-auto mb-10">
                Votre demande a été enregistrée. L&apos;équipe SORA TECH vous contactera avant le RDV.
              </p>

              <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-8">
                <div className="bg-[#0A1525]/80 border border-[#0066FF] rounded-2xl p-5 text-left">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="text-2xl">📧</div>
                    <div className="text-sm font-bold text-[#0099FF]">Email envoyé</div>
                  </div>
                  <div className="text-xs text-[#8899BB] leading-relaxed">
                    Confirmation envoyée à <span className="text-white font-bold">{clientInfo.email}</span>
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    <li className="text-xs text-[#8899BB]">✓ Détails du RDV : {selectedDate} à {selectedSlot}</li>
                    <li className="text-xs text-[#8899BB]">📎 Devis préliminaire : {formatPrice(totalPrice)} FCFA</li>
                    <li className="text-xs text-[#8899BB]">📎 Fiche de configuration</li>
                    <li className="text-xs text-[#8899BB]">📍 Adresse + lien visio</li>
                  </ul>
                </div>
                <div className="bg-[#0A1525]/80 border border-[#25D366] rounded-2xl p-5 text-left">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="text-2xl">💬</div>
                    <div className="text-sm font-bold text-[#25D366]">WhatsApp envoyé</div>
                  </div>
                  <div className="text-xs text-[#8899BB] leading-relaxed">
                    Message envoyé à <span className="text-white font-bold">{clientInfo.phone}</span>
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    <li className="text-xs text-[#8899BB]">✓ Rappel du RDV</li>
                    <li className="text-xs text-[#8899BB]">📎 Devis en PDF</li>
                    <li className="text-xs text-[#8899BB]">🔗 Lien de suivi</li>
                    <li className="text-xs text-[#8899BB]">☎️ Contact équipe direct</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3 justify-center flex-wrap">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setStep(1); setSubmitted(false); setSelectedService(null); setOptions({}); setClientInfo({ name: "", email: "", phone: "", company: "", message: "" }); }} className="bg-[#0066FF] px-6 py-3 rounded-lg font-bold text-xs">Nouvelle demande</motion.button>
                <Link href="/"><motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="border border-[#1a2540] text-[#8899BB] px-6 py-3 rounded-lg font-bold text-xs">Retour accueil</motion.button></Link>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
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