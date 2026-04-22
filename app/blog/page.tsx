"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import MobileMenu from "../components/MobileMenu";
import { BookOpen, Shield, Layers, Globe, Smartphone, TrendingUp, Clock, User } from "lucide-react";
import Footer from "../components/Footer";

function ScanLine() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div animate={{ y: ["-5%", "105%"] }} transition={{ duration: 8, repeat: Infinity, ease: "linear", repeatDelay: 4 }} className="absolute left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, rgba(0,153,255,0.5), rgba(0,198,255,0.8), rgba(0,153,255,0.5), transparent)" }} />
    </div>
  );
}

const TAG_META: Record<string, { color: string; icon: typeof BookOpen }> = {
  Digitalisation: { color: "#0099FF", icon: Globe },
  Cybersécurité:  { color: "#FF4757", icon: Shield },
  ERP:            { color: "#9B93FF", icon: Layers },
  Web:            { color: "#0066FF", icon: Globe },
  Mobile:         { color: "#00C48C", icon: Smartphone },
  Business:       { color: "#FF6B00", icon: TrendingUp },
};

const STATIC_ARTICLES = [
    { id: 1, category: "Digitalisation", title: "Comment digitaliser votre boutique en 2025 : le guide complet",            excerpt: "Découvrez les étapes essentielles pour transformer votre commerce traditionnel en entreprise digitale moderne et rentable.", date: "15 Avril 2025", readTime: "8 min",  author: "Sissoko Abdoulaye", featured: true },
    { id: 2, category: "Cybersécurité",  title: "5 erreurs fatales qui mettent en danger la sécurité de votre PME",         excerpt: "Protégez vos données contre les cyberattaques. Ces erreurs courantes coûtent des millions aux entreprises africaines.", date: "12 Avril 2025", readTime: "6 min",  author: "Sissoko Abdoulaye" },
    { id: 3, category: "ERP",            title: "Pourquoi votre entreprise a besoin d'un ERP en 2025",                       excerpt: "Gagnez en efficacité et en rentabilité avec un système de gestion intégré adapté aux entreprises ivoiriennes.", date: "10 Avril 2025", readTime: "10 min", author: "Lead Developer" },
    { id: 4, category: "Web",            title: "Site vitrine ou e-commerce : que choisir pour son business ?",              excerpt: "On vous aide à faire le bon choix selon votre activité, votre budget et vos objectifs commerciaux.", date: "8 Avril 2025",  readTime: "5 min",  author: "UX Designer" },
    { id: 5, category: "Mobile",         title: "L'avenir des applications mobiles en Côte d'Ivoire",                        excerpt: "Pourquoi investir maintenant dans le mobile est crucial pour rester compétitif dans le marché ivoirien.", date: "5 Avril 2025",  readTime: "7 min",  author: "Sissoko Abdoulaye" },
    { id: 6, category: "Business",       title: "10 outils digitaux indispensables pour les PME africaines",                 excerpt: "Découvrez les outils qui boostent la productivité et la croissance des petites entreprises en Afrique.", date: "2 Avril 2025",  readTime: "9 min",  author: "Lead Developer" },
    { id: 7, category: "Cybersécurité",  title: "Mobile Money : comment sécuriser les transactions de votre entreprise",    excerpt: "Protégez vos paiements Wave, Orange Money et MTN Money contre la fraude avec ces bonnes pratiques.", date: "30 Mars 2025", readTime: "6 min",  author: "Security Expert" },
    { id: 8, category: "Digitalisation", title: "Comment passer d'un registre papier à un logiciel de gestion",             excerpt: "Guide pas à pas pour les commerçants qui veulent abandonner le papier et passer au digital.", date: "28 Mars 2025", readTime: "7 min",  author: "Sissoko Abdoulaye" },
    { id: 9, category: "Web",            title: "Référencement SEO local : être visible sur Google à Abidjan",               excerpt: "Les techniques éprouvées pour apparaître en première page quand vos clients cherchent vos services.", date: "25 Mars 2025", readTime: "8 min",  author: "UX Designer" },
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const categories = ["Tous", "Digitalisation", "Cybersécurité", "Web", "Mobile", "ERP", "Business"];
  const [articles, setArticles] = useState<any[]>(STATIC_ARTICLES);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/articles`)
      .then(r => r.json())
      .then(r => { if (r.data?.length) setArticles(r.data.map((a: any) => ({ ...a, id: a._id, date: new Date(a.createdAt).toLocaleDateString('fr-FR'), readTime: a.readTime ? a.readTime + ' min' : '5 min', author: 'SORA TECH' }))); })
      .catch(() => {});
  }, []);

  const filtered = activeCategory === "Tous" ? articles : articles.filter(a => a.category === activeCategory);
  const featured = articles.find(a => a.featured);

  return (
    <div className="min-h-screen bg-[#060D1F] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(#0099FF 1px, transparent 1px), linear-gradient(90deg, #0099FF 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#0066FF] rounded-full blur-[150px] opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#9B93FF] rounded-full blur-[150px] opacity-15 animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* NAV */}
      <nav className="relative border-b border-[#1a2540] px-6 md:px-12 py-4 flex items-center justify-between sticky top-0 bg-[#060D1F]/85 backdrop-blur-xl z-50">
        <Link href="/" className="text-xl font-black tracking-[3px]">SORA<span className="text-[#0099FF]">TECH</span></Link>
        <div className="hidden lg:flex items-center gap-6">
          <Link href="/"         className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Accueil</Link>
          <Link href="/services" className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Services</Link>
          <Link href="/about"    className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">À propos</Link>
          <Link href="/blog"     className="text-xs uppercase tracking-widest text-[#0099FF] font-bold">Blog</Link>
          <Link href="/projets"  className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Projets</Link>
          <Link href="/boutique" className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Boutique</Link>
          <Link href="/devis"    className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Devis & RDV</Link>
          <Link href="/contact"  className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Contact</Link>
        </div>
        <div className="flex items-center gap-3">
          <motion.a href="tel:+2250704928068" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden sm:block bg-[#0066FF] hover:bg-[#0099FF] transition px-4 py-2 rounded-md text-xs font-bold tracking-wide">+225 07 00 00 00</motion.a>
          <MobileMenu active="blog" />
        </div>
      </nav>

      {/* HERO */}
      <section className="relative py-20 md:py-24 px-6 text-center z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(#1a2540 1px, transparent 1px), linear-gradient(90deg, #1a2540 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <ScanLine />
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-[#0A1A3A] border border-[#0066FF] text-[#0099FF] text-xs tracking-[2px] px-4 py-1.5 rounded-full mb-6" style={{ boxShadow: "0 0 20px rgba(0,102,255,0.2)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />
            BLOG SORA TECH
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-4xl md:text-6xl font-black leading-tight mb-6 tracking-tight">
            Conseils, tendances<br />et{" "}
            <motion.span animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 5, repeat: Infinity }} className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] via-[#0099FF] to-[#9B93FF]" style={{ backgroundSize: "200% 200%" }}>actualités tech</motion.span>
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
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative bg-gradient-to-br from-[#0066FF]/20 via-[#0099FF]/10 to-[#9B93FF]/10 border border-[#0066FF]/50 rounded-3xl overflow-hidden cursor-pointer group" style={{ boxShadow: "0 0 40px rgba(0,102,255,0.1)" }}>
              <div className="grid md:grid-cols-2 gap-0">
                <div className="h-64 md:h-auto bg-gradient-to-br from-[#0066FF] to-[#9B93FF] flex items-center justify-center">
                  <div className="w-24 h-24 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center">
                    <Globe className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-[10px] tracking-widest bg-[#FF6B00] text-white px-3 py-1 rounded-full font-bold">À LA UNE</div>
                    <div className="text-[10px] tracking-widest text-[#0099FF] font-mono">{featured.category.toUpperCase()}</div>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black mb-4 leading-tight">{featured.title}</h2>
                  <p className="text-sm text-[#8899BB] mb-5 leading-relaxed">{featured.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-[#8899BB] mb-5 flex-wrap">
                    <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0066FF] to-[#0099FF] flex items-center justify-center text-[10px] font-black">SA</div><span>{featured.author}</span></div>
                    <div className="flex items-center gap-1"><Clock className="w-3 h-3" /><span>{featured.readTime}</span></div>
                    <span>{featured.date}</span>
                  </div>
                  <Link href="/contact"><motion.button whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(0,102,255,0.4)" }} whileTap={{ scale: 0.98 }} className="bg-[#0066FF] px-6 py-3 rounded-xl font-bold text-sm w-fit">Lire l&apos;article →</motion.button></Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* FILTRES */}
      <section className="relative py-8 px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-2 flex-wrap justify-center">
            {categories.map((cat) => (
              <motion.button key={cat} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-200 ${activeCategory === cat ? "bg-[#0066FF] text-white shadow-[0_0_20px_rgba(0,102,255,0.4)]" : "bg-[#0A1525] border border-[#1a2540] text-[#8899BB] hover:border-[#0066FF] hover:text-white"}`}>
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
            {filtered.map((article, i) => {
              const meta = TAG_META[article.category] || { color: "#0099FF", icon: BookOpen };
              const Icon = meta.icon;
              return (
                <Link href="/contact"><motion.article key={article.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} whileHover={{ y: -8, boxShadow: `0 20px 40px ${meta.color}20` }} className="bg-[#0A1525]/80 backdrop-blur border border-[#1a2540] rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer group">
                  <div className="h-40 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${meta.color}25, ${meta.color}05)` }}>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: `${meta.color}20`, border: `1px solid ${meta.color}40` }}>
                      <Icon className="w-8 h-8" style={{ color: meta.color }} />
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-[10px] tracking-widest font-mono px-2 py-1 rounded" style={{ color: meta.color, backgroundColor: `${meta.color}15` }}>{article.category}</div>
                      <div className="text-[10px] text-[#8899BB] flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime}</div>
                    </div>
                    <h3 className="text-base font-bold mb-3 leading-snug group-hover:text-[#0099FF] transition-colors duration-200">{article.title}</h3>
                    <p className="text-xs text-[#8899BB] leading-relaxed mb-4 line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-[#1a2540]">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0066FF] to-[#0099FF] flex items-center justify-center">
                          <User className="w-3 h-3 text-white" />
                        </div>
                        <div className="text-[10px] text-[#8899BB]">{article.author}</div>
                      </div>
                      <div className="text-[10px] text-[#8899BB]">{article.date}</div>
                    </div>
                  </div>
                </motion.article></Link>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-[#8899BB]"><p>Aucun article dans cette catégorie pour le moment.</p></div>
          )}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="relative py-16 px-6 z-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-3xl mx-auto bg-gradient-to-br from-[#0066FF]/20 via-[#0099FF]/10 to-[#FF6B00]/10 border border-[#0066FF]/50 rounded-3xl p-10 md:p-14 backdrop-blur text-center relative overflow-hidden" style={{ boxShadow: "0 0 60px rgba(0,102,255,0.1)" }}>
          <ScanLine />
          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0066FF]/15 border border-[#0066FF]/40 flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-[#0099FF]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-3">Restez informés</h2>
            <p className="text-[#8899BB] mb-6">Recevez nos meilleurs articles directement dans votre boîte mail, chaque semaine</p>
            <div className="flex gap-3 max-w-md mx-auto flex-col sm:flex-row">
              <input type="email" placeholder="votre@email.com" className="flex-1 bg-[#0A1525] border border-[#1a2540] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0066FF] transition-colors" />
              <motion.button type="button" whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(0,102,255,0.4)" }} whileTap={{ scale: 0.95 }} className="bg-[#0066FF] px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap">S&apos;abonner</motion.button>
            </div>
            <p className="text-xs text-[#8899BB] mt-4">🔒 Zéro spam. Désabonnement en un clic.</p>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
