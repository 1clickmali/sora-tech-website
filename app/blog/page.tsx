"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import MobileMenu from "../components/MobileMenu";

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("Tous");

  const categories = ["Tous", "Digitalisation", "Cybersécurité", "Web", "Mobile", "ERP", "Business"];

  const articles = [
    {
      id: 1,
      category: "Digitalisation",
      title: "Comment digitaliser votre boutique en 2025 : le guide complet",
      excerpt: "Découvrez les étapes essentielles pour transformer votre commerce traditionnel en entreprise digitale moderne et rentable.",
      date: "15 Avril 2025",
      readTime: "8 min",
      author: "Sissoko Abdoulaye",
      image: "📱",
      featured: true,
    },
    {
      id: 2,
      category: "Cybersécurité",
      title: "5 erreurs fatales qui mettent en danger la sécurité de votre PME",
      excerpt: "Protégez vos données contre les cyberattaques. Ces erreurs courantes coûtent des millions aux entreprises africaines.",
      date: "12 Avril 2025",
      readTime: "6 min",
      author: "Sissoko Abdoulaye",
      image: "🔐",
    },
    {
      id: 3,
      category: "ERP",
      title: "Pourquoi votre entreprise a besoin d'un ERP en 2025",
      excerpt: "Gagnez en efficacité et en rentabilité avec un système de gestion intégré adapté aux entreprises ivoiriennes.",
      date: "10 Avril 2025",
      readTime: "10 min",
      author: "Lead Developer",
      image: "⚙️",
    },
    {
      id: 4,
      category: "Web",
      title: "Site vitrine ou e-commerce : que choisir pour son business ?",
      excerpt: "On vous aide à faire le bon choix selon votre activité, votre budget et vos objectifs commerciaux.",
      date: "8 Avril 2025",
      readTime: "5 min",
      author: "UX Designer",
      image: "🌐",
    },
    {
      id: 5,
      category: "Mobile",
      title: "L'avenir des applications mobiles en Côte d'Ivoire",
      excerpt: "Pourquoi investir maintenant dans le mobile est crucial pour rester compétitif dans le marché ivoirien.",
      date: "5 Avril 2025",
      readTime: "7 min",
      author: "Sissoko Abdoulaye",
      image: "📲",
    },
    {
      id: 6,
      category: "Business",
      title: "10 outils digitaux indispensables pour les PME africaines",
      excerpt: "Découvrez les outils qui boostent la productivité et la croissance des petites entreprises en Afrique.",
      date: "2 Avril 2025",
      readTime: "9 min",
      author: "Lead Developer",
      image: "🚀",
    },
    {
      id: 7,
      category: "Cybersécurité",
      title: "Mobile Money : comment sécuriser les transactions de votre entreprise",
      excerpt: "Protégez vos paiements Wave, Orange Money et MTN Money contre la fraude avec ces bonnes pratiques.",
      date: "30 Mars 2025",
      readTime: "6 min",
      author: "Security Expert",
      image: "💳",
    },
    {
      id: 8,
      category: "Digitalisation",
      title: "Comment passer d'un registre papier à un logiciel de gestion",
      excerpt: "Guide pas à pas pour les commerçants qui veulent abandonner le papier et passer au digital.",
      date: "28 Mars 2025",
      readTime: "7 min",
      author: "Sissoko Abdoulaye",
      image: "📊",
    },
    {
      id: 9,
      category: "Web",
      title: "Référencement SEO local : être visible sur Google à Abidjan",
      excerpt: "Les techniques éprouvées pour apparaître en première page quand vos clients cherchent vos services.",
      date: "25 Mars 2025",
      readTime: "8 min",
      author: "UX Designer",
      image: "🔍",
    },
  ];

  const filteredArticles = activeCategory === "Tous"
    ? articles
    : articles.filter(a => a.category === activeCategory);

  const featured = articles.find(a => a.featured);

  return (
    <div className="min-h-screen bg-[#060D1F] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#0066FF] rounded-full blur-[150px] opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#9B93FF] rounded-full blur-[150px] opacity-15 animate-pulse" style={{ animationDelay: "1s" }} />
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
          <Link href="/blog" className="text-xs uppercase tracking-widest text-[#0099FF] font-bold">Blog</Link>
            <Link href="/projets" className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Projets</Link>
            <Link href="/boutique" className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Boutique</Link>
            <Link href="/devis" className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Devis & RDV</Link>
            <Link href="/contact" className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Contact</Link>
        </div>
        <div className="flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden sm:block bg-[#0066FF] hover:bg-[#0099FF] transition px-4 py-2 rounded-md text-xs font-bold tracking-wide">
            +225 07 00 00 00
          </motion.button>
          <MobileMenu active="blog" />
        </div>
      </nav>

      {/* HERO */}
      <section className="relative py-20 md:py-24 px-6 text-center z-10">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(#1a2540 1px, transparent 1px), linear-gradient(90deg, #1a2540 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block bg-[#0A1A3A] border border-[#0066FF] text-[#0099FF] text-xs tracking-[2px] px-4 py-1.5 rounded-full mb-6">
            ✨ BLOG SORA TECH
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-4xl md:text-6xl font-black leading-tight mb-6 tracking-tight">
            Conseils, tendances<br />et <motion.span animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 5, repeat: Infinity }} className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] via-[#0099FF] to-[#9B93FF]" style={{ backgroundSize: "200% 200%" }}>actualités tech</motion.span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-[#8899BB] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Restez informés des dernières tendances en digitalisation, cybersécurité et innovation tech pour booster votre entreprise.
          </motion.p>
        </div>
      </section>

      {/* ARTICLE À LA UNE */}
      {featured && (
        <section className="relative py-8 px-6 z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative bg-gradient-to-br from-[#0066FF]/20 via-[#0099FF]/10 to-[#9B93FF]/10 border border-[#0066FF] rounded-3xl overflow-hidden cursor-pointer group">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="h-64 md:h-auto bg-gradient-to-br from-[#0066FF] to-[#9B93FF] flex items-center justify-center text-9xl">
                  {featured.image}
                </div>
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-[10px] tracking-widest bg-[#FF6B00] text-white px-3 py-1 rounded-full font-bold">À LA UNE</div>
                    <div className="text-[10px] tracking-widest text-[#0099FF]">{featured.category}</div>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black mb-4 leading-tight">{featured.title}</h2>
                  <p className="text-sm text-[#8899BB] mb-5 leading-relaxed">{featured.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-[#8899BB] mb-5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0066FF] to-[#0099FF] flex items-center justify-center text-[10px] font-black">SA</div>
                      <span>{featured.author}</span>
                    </div>
                    <span>•</span>
                    <span>{featured.date}</span>
                    <span>•</span>
                    <span>📖 {featured.readTime}</span>
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-[#0066FF] px-6 py-3 rounded-lg font-bold text-sm w-fit">
                    Lire l'article →
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* FILTRES CATÉGORIES */}
      <section className="relative py-8 px-6 z-10">
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

      {/* GRILLE ARTICLES */}
      <section className="relative py-12 px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {filteredArticles.map((article, i) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -8, borderColor: "#0066FF" }}
                className="bg-[#0A1525]/80 backdrop-blur border border-[#1a2540] rounded-2xl overflow-hidden transition cursor-pointer group"
              >
                <div className="h-40 bg-gradient-to-br from-[#080F20] to-[#0A1525] flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-500">
                  {article.image}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="text-[10px] tracking-widest text-[#0099FF] bg-[#0A1A3A] px-2 py-1 rounded">{article.category}</div>
                    <div className="text-[10px] text-[#8899BB]">📖 {article.readTime}</div>
                  </div>
                  <h3 className="text-base font-bold mb-3 leading-snug group-hover:text-[#0099FF] transition">{article.title}</h3>
                  <p className="text-xs text-[#8899BB] leading-relaxed mb-4 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-[#1a2540]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0066FF] to-[#0099FF] flex items-center justify-center text-[8px] font-black">
                        {article.author.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div className="text-[10px] text-[#8899BB]">{article.author}</div>
                    </div>
                    <div className="text-[10px] text-[#8899BB]">{article.date}</div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
          {filteredArticles.length === 0 && (
            <div className="text-center py-12 text-[#8899BB]">
              <p>Aucun article dans cette catégorie pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="relative py-16 px-6 z-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-3xl mx-auto bg-gradient-to-br from-[#0066FF]/20 via-[#0099FF]/10 to-[#FF6B00]/10 border border-[#0066FF] rounded-3xl p-10 md:p-14 backdrop-blur text-center">
          <div className="text-4xl mb-4">📬</div>
          <h2 className="text-3xl md:text-4xl font-black mb-3">Restez informés</h2>
          <p className="text-[#8899BB] mb-6">Recevez nos meilleurs articles directement dans votre boîte mail, chaque semaine</p>
          <div className="flex gap-3 max-w-md mx-auto flex-col sm:flex-row">
            <input
              type="email"
              placeholder="votre@email.com"
              className="flex-1 bg-[#0A1525] border border-[#1a2540] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#0066FF]"
            />
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-[#0066FF] px-6 py-3 rounded-lg font-bold text-sm whitespace-nowrap">
              S'abonner
            </motion.button>
          </div>
          <p className="text-xs text-[#8899BB] mt-4">🔒 Zéro spam. Désabonnement en un clic.</p>
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