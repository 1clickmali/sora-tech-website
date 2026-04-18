"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function ProjetsPage() {
  const [activeCategory, setActiveCategory] = useState("Tous");

  const categories = ["Tous", "Site web", "Logiciel", "Application", "ERP", "Cybersécurité"];

  const projects = [
    {
      id: 1,
      category: "Logiciel",
      title: "SuperMarché Abidjan",
      client: "Chaîne de supermarchés",
      description: "Logiciel de caisse et gestion des stocks pour 3 points de vente synchronisés en temps réel.",
      results: ["3 points de vente connectés", "Gestion stock temps réel", "+30% rapidité des ventes"],
      tech: ["React", "Node.js", "MongoDB"],
      image: "🛒",
      color: "#FF6B00",
      year: "2025",
    },
    {
      id: 2,
      category: "Site web",
      title: "BoutiqueMode CI",
      client: "E-commerce de vêtements",
      description: "Boutique en ligne complète avec paiement Mobile Money (Wave, Orange Money), gestion des commandes et livraison.",
      results: ["Paiement Wave intégré", "Livraison Abidjan géolocalisée", "200+ produits en ligne"],
      tech: ["Next.js", "Stripe", "Wave API"],
      image: "👗",
      color: "#0099FF",
      year: "2025",
    },
    {
      id: 3,
      category: "Application",
      title: "DelivCI",
      client: "Livraison de repas",
      description: "Application mobile de livraison sur Abidjan — clients, restaurants et livreurs connectés en temps réel.",
      results: ["Android + iOS", "50+ restaurants partenaires", "Livraison en 30 min"],
      tech: ["React Native", "Firebase", "Maps API"],
      image: "🛵",
      color: "#00C48C",
      year: "2024",
    },
    {
      id: 4,
      category: "ERP",
      title: "Cabinet Médical Cocody",
      client: "Cabinet médical",
      description: "Système complet de gestion patients, rendez-vous, facturation et stocks pharmaceutiques.",
      results: ["500+ patients gérés", "Rendez-vous en ligne", "Facturation automatique"],
      tech: ["Vue.js", "Express", "MySQL"],
      image: "🏥",
      color: "#9B93FF",
      year: "2024",
    },
    {
      id: 5,
      category: "Cybersécurité",
      title: "Banque Régionale",
      client: "Institution financière",
      description: "Audit complet de cybersécurité + mise en place des protections contre les cyberattaques.",
      results: ["Audit 40+ serveurs", "0 faille critique restante", "Formation 150 employés"],
      tech: ["CrowdStrike", "Bitdefender", "Cisco"],
      image: "🏦",
      color: "#FF4757",
      year: "2025",
    },
    {
      id: 6,
      category: "Site web",
      title: "Restaurant Le Gourmet",
      client: "Restaurant haut de gamme",
      description: "Site vitrine premium avec réservation de table en ligne, menu interactif et galerie photo.",
      results: ["Réservations en ligne +80%", "Menu QR code", "Design premium"],
      tech: ["Next.js", "Tailwind", "Framer Motion"],
      image: "🍽️",
      color: "#0066FF",
      year: "2025",
    },
    {
      id: 7,
      category: "Logiciel",
      title: "Pharmacie Centrale",
      client: "Pharmacie",
      description: "Logiciel de gestion des médicaments, alertes de péremption, et suivi des ordonnances.",
      results: ["10 000+ produits gérés", "Alertes automatiques", "Historique patients"],
      tech: ["Electron", "SQLite", "Node.js"],
      image: "💊",
      color: "#00C48C",
      year: "2024",
    },
    {
      id: 8,
      category: "Application",
      title: "TaxiCI",
      client: "Plateforme de VTC",
      description: "Application de réservation de taxi style Uber pour Abidjan avec paiement intégré.",
      results: ["100+ chauffeurs actifs", "GPS temps réel", "Paiement Mobile Money"],
      tech: ["React Native", "Socket.io", "Redis"],
      image: "🚕",
      color: "#FF6B00",
      year: "2024",
    },
    {
      id: 9,
      category: "ERP",
      title: "École Privée 2000",
      client: "Établissement scolaire",
      description: "Plateforme de gestion scolaire — élèves, notes, emploi du temps, paiements scolarité.",
      results: ["800+ élèves gérés", "Bulletins automatiques", "Paiement parents en ligne"],
      tech: ["Next.js", "PostgreSQL", "Docker"],
      image: "🎓",
      color: "#9B93FF",
      year: "2025",
    },
  ];

  const filteredProjects = activeCategory === "Tous"
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#060D1F] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#0066FF] rounded-full blur-[150px] opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00C48C] rounded-full blur-[150px] opacity-15 animate-pulse" style={{ animationDelay: "1s" }} />
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
          <Link href="/projets" className="text-xs uppercase tracking-widest text-[#0099FF] font-bold">Projets</Link>
            <Link href="/boutique" className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Boutique</Link>
            <Link href="/devis" className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Devis & RDV</Link>
            <Link href="/contact" className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Contact</Link>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-[#0066FF] hover:bg-[#0099FF] transition px-4 py-2 rounded-md text-xs font-bold tracking-wide">
          +225 07 00 00 00
        </motion.button>
      </nav>

      {/* HERO */}
      <section className="relative py-20 md:py-24 px-6 text-center z-10">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(#1a2540 1px, transparent 1px), linear-gradient(90deg, #1a2540 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block bg-[#0A1A3A] border border-[#0066FF] text-[#0099FF] text-xs tracking-[2px] px-4 py-1.5 rounded-full mb-6">
            ✨ NOTRE PORTFOLIO
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-4xl md:text-6xl font-black leading-tight mb-6 tracking-tight">
            Des projets <motion.span animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 5, repeat: Infinity }} className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] via-[#0099FF] to-[#00C48C]" style={{ backgroundSize: "200% 200%" }}>qui transforment</motion.span><br />des entreprises
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-[#8899BB] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Découvrez nos réalisations concrètes pour des clients satisfaits à Abidjan et partout en Côte d'Ivoire.
          </motion.p>
        </div>
      </section>

      {/* STATS */}
      <section className="relative border-y border-[#1a2540] bg-[#080F20]/80 backdrop-blur py-10 px-6 z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { num: "50+", label: "PROJETS LIVRÉS", color: "#0099FF" },
            { num: "30+", label: "CLIENTS SATISFAITS", color: "#FF6B00" },
            { num: "6", label: "SECTEURS COUVERTS", color: "#00C48C" },
            { num: "100%", label: "TAUX RÉUSSITE", color: "#9B93FF" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="text-4xl md:text-5xl font-black" style={{ color: s.color }}>{s.num}</div>
              <div className="text-xs text-[#8899BB] tracking-wider mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FILTRES */}
      <section className="relative py-10 px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-2 flex-wrap justify-center">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition ${
                  activeCategory === cat
                    ? "bg-[#0066FF] text-white"
                    : "bg-[#0A1525] border border-[#1a2540] text-[#8899BB] hover:border-[#0066FF] hover:text-white"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* GRILLE PROJETS */}
      <section className="relative py-8 px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -8, boxShadow: `0 20px 40px ${project.color}30` }}
                className="bg-[#0A1525]/80 backdrop-blur border border-[#1a2540] rounded-2xl overflow-hidden cursor-pointer group transition"
                style={{ borderColor: "" }}
              >
                <div className="relative h-44 flex items-center justify-center text-8xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${project.color}40, ${project.color}10)` }}>
                  <div className="group-hover:scale-110 transition-transform duration-500">{project.image}</div>
                  <div className="absolute top-3 right-3 bg-[#060D1F]/80 backdrop-blur px-2 py-1 rounded text-[10px] font-bold" style={{ color: project.color }}>
                    {project.year}
                  </div>
                  <div className="absolute top-3 left-3 bg-[#060D1F]/80 backdrop-blur px-2 py-1 rounded text-[10px] tracking-widest text-white">
                    {project.category}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-black mb-1 group-hover:text-[#0099FF] transition">{project.title}</h3>
                  <div className="text-xs font-bold mb-3" style={{ color: project.color }}>{project.client}</div>
                  <p className="text-xs text-[#8899BB] leading-relaxed mb-4">{project.description}</p>
                  <div className="space-y-1.5 mb-4">
                    {project.results.map((r, k) => (
                      <div key={k} className="flex items-start gap-2 text-xs text-[#8899BB]">
                        <span style={{ color: project.color }} className="font-bold">✓</span>
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-1.5 flex-wrap pt-3 border-t border-[#1a2540]">
                    {project.tech.map((t, k) => (
                      <span key={k} className="text-[9px] bg-[#080F20] border border-[#1a2540] px-2 py-1 rounded text-[#8899BB]">{t}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {filteredProjects.length === 0 && (
            <div className="text-center py-12 text-[#8899BB]">
              <p>Aucun projet dans cette catégorie pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* TÉMOIGNAGE CLIENT */}
      <section className="relative py-16 px-6 z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-gradient-to-br from-[#0066FF]/20 via-[#0099FF]/10 to-[#00C48C]/10 border border-[#0066FF] rounded-3xl p-8 md:p-12 backdrop-blur">
            <div className="text-6xl text-[#0099FF] mb-4">&ldquo;</div>
            <p className="text-lg md:text-2xl text-white mb-6 leading-relaxed italic">
              SORA TECH a complètement transformé notre supermarché. En 3 mois seulement, nos ventes ont augmenté de 30% et nous gagnons un temps fou sur la gestion des stocks. Je recommande à 100% !
            </p>
            <div className="flex items-center gap-4 pt-6 border-t border-[#1a2540]">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#0099FF] flex items-center justify-center text-lg font-black">KK</div>
              <div>
                <div className="text-base font-bold">Konan Kouassi</div>
                <div className="text-xs text-[#8899BB]">Directeur — Supermarché Abidjan</div>
                <div className="flex gap-0.5 mt-1">
                  {[1,2,3,4,5].map(i => <span key={i} className="text-[#FFD700] text-xs">★</span>)}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 px-6 text-center z-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-3xl mx-auto bg-gradient-to-br from-[#0066FF]/20 via-[#0099FF]/10 to-[#FF6B00]/10 border border-[#0066FF] rounded-3xl p-10 md:p-14 backdrop-blur">
          <h2 className="text-3xl md:text-5xl font-black mb-4">Votre projet sera le prochain</h2>
          <p className="text-[#8899BB] mb-8">Rejoignez nos 30+ clients satisfaits. Devis gratuit et sans engagement.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-[#0066FF] px-8 py-3.5 rounded-lg font-bold text-sm">Démarrer mon projet</motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-[#25D366] px-8 py-3.5 rounded-lg font-bold text-sm">💬 WhatsApp direct</motion.button>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="relative bg-[#040A14] border-t border-[#1a2540] py-12 px-6 z-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-lg font-black tracking-widest mb-3">SORA<span className="text-[#0099FF]">TECH</span></div>
            <p className="text-xs text-[#8899BB] leading-relaxed mb-4">Entreprise tech panafricaine qui digitalise les entreprises d'Abidjan et de toute l'Afrique de l'Ouest.</p>
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
              <li>📍 Abidjan, Côte d'Ivoire</li>
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