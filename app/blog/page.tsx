"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, Clock, User } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useApp } from "../i18n/AppContext";
import { blogLabel } from "@/lib/i18nLabels";
import {
  BLOG_CATEGORY_META,
  BLOG_FALLBACK_META,
  getArticleHref,
  getBlogCategories,
  normalizeArticle,
  type BlogArticle,
} from "@/lib/blog";
import { resolveMediaUrl } from "@/lib/media";

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

function ArticleCover({ article, className }: { article: BlogArticle; className: string }) {
  const meta = BLOG_CATEGORY_META[article.category] || BLOG_FALLBACK_META;
  const Icon = meta.icon;

  if (article.image) {
    return <img src={resolveMediaUrl(article.image)} alt={article.title} className={className} />;
  }

  return (
    <div className={`${className} flex items-center justify-center`} style={{ background: `linear-gradient(135deg, ${meta.color}25, ${meta.color}08)` }}>
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: `${meta.color}20`, border: `1px solid ${meta.color}40` }}
      >
        <Icon className="w-8 h-8" style={{ color: meta.color }} />
      </div>
    </div>
  );
}

export default function BlogPage() {
  const { lang, t } = useApp();
  const b = t.blog;
  const isFr = lang === "fr";
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [articles, setArticles] = useState<BlogArticle[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/articles`)
      .then((response) => response.json())
      .then((response) => {
        setArticles((response.data || []).map(normalizeArticle));
      })
      .catch(() => {});
  }, []);

  const categories = getBlogCategories(articles);
  const filtered = activeCategory === "Tous" ? articles : articles.filter((article) => article.category === activeCategory);
  const featured = articles.find((article) => article.featured) || articles[0];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#0066FF] rounded-full blur-[150px] opacity-10 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#9B93FF] rounded-full blur-[150px] opacity-10 animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <Navbar active="blog" />

      <section className="relative py-20 md:py-24 px-6 text-center z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(#1a2540 1px, transparent 1px), linear-gradient(90deg, #1a2540 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <ScanLine />
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-[#0A1A3A] border border-[#0066FF] text-[#00C6FF] text-xs tracking-[2px] px-4 py-1.5 rounded-full mb-6" style={{ boxShadow: "0 0 20px rgba(0,153,255,0.15)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C6FF] animate-pulse" />
            {b.badge}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-4xl md:text-6xl font-black leading-tight mb-6 tracking-tight">
            {isFr ? "Conseils, analyses" : "Tips, analysis"}<br />
            <motion.span animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 5, repeat: Infinity }} className="text-transparent bg-clip-text bg-gradient-to-r from-[#0099FF] via-[#00C6FF] to-[#9B93FF]" style={{ backgroundSize: "200% 200%" }}>
              {isFr ? "et guides concrets" : "and practical guides"}
            </motion.span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-[var(--muted)] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {isFr
              ? "Nos articles sur la digitalisation, les logiciels de gestion, la cybersécurité et les solutions pratiques pour les entreprises."
              : "Our articles about digitalization, management software, cybersecurity and practical business solutions."}
          </motion.p>
        </div>
      </section>

      {featured && (
        <section className="relative py-8 px-6 z-10">
          <div className="max-w-6xl mx-auto">
            <Link href={getArticleHref(featured)}>
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative bg-gradient-to-br from-[#0066FF]/20 via-[#0099FF]/10 to-[#9B93FF]/10 border border-[#0066FF]/50 rounded-3xl overflow-hidden cursor-pointer group" style={{ boxShadow: "0 0 40px rgba(0,102,255,0.1)" }}>
                <div className="grid md:grid-cols-2 gap-0">
                  <ArticleCover article={featured} className="h-64 md:h-full w-full object-cover" />
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-[10px] tracking-widest bg-[#FF6B00] text-white px-3 py-1 rounded-full font-bold">{isFr ? "À LA UNE" : "FEATURED"}</div>
                      <div className="text-[10px] tracking-widest text-[#0099FF] font-mono">{blogLabel(featured.category, lang).toUpperCase()}</div>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black mb-4 leading-tight">{featured.title}</h2>
                    <p className="text-sm text-[var(--muted)] mb-5 leading-relaxed">{featured.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-[var(--muted)] mb-5 flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0066FF] to-[#0099FF] flex items-center justify-center">
                          <User className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span>{featured.author}</span>
                      </div>
                      <div className="flex items-center gap-1"><Clock className="w-3 h-3" /><span>{featured.readTime}</span></div>
                      <span>{featured.date}</span>
                    </div>
                    <motion.div whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(0,102,255,0.4)" }} whileTap={{ scale: 0.98 }} className="bg-[#0066FF] px-6 py-3 rounded-xl font-bold text-sm w-fit">
                      {b.read}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </section>
      )}

      <section className="relative py-8 px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-2 flex-wrap justify-center">
            {categories.map((category) => (
              <motion.button key={category} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-200 ${activeCategory === category ? "bg-[#0066FF] text-white shadow-[0_0_20px_rgba(0,102,255,0.4)]" : "bg-[#0A1525] border border-[#1a2540] text-[var(--muted)] hover:border-[#0066FF] hover:text-white"}`}>
                {blogLabel(category, lang)}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-12 px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {filtered.map((article, index) => {
              const meta = BLOG_CATEGORY_META[article.category] || BLOG_FALLBACK_META;

              return (
                <Link key={article.id} href={getArticleHref(article)}>
                  <motion.article initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} whileHover={{ y: -8, boxShadow: `0 20px 40px ${meta.color}20` }} className="backdrop-blur border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer group h-full" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                    <ArticleCover article={article} className="h-48 w-full object-cover" />
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="text-[10px] tracking-widest font-mono px-2 py-1 rounded" style={{ color: meta.color, backgroundColor: `${meta.color}15` }}>{blogLabel(article.category, lang)}</div>
                        <div className="text-[10px] text-[var(--muted)] flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime}</div>
                      </div>
                      <h3 className="text-base font-bold mb-3 leading-snug group-hover:text-[#0099FF] transition-colors duration-200">{article.title}</h3>
                      <p className="text-xs text-[var(--muted)] leading-relaxed mb-4 line-clamp-3">{article.excerpt}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-[#1a2540]">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0066FF] to-[#0099FF] flex items-center justify-center">
                            <User className="w-3 h-3 text-white" />
                          </div>
                          <div className="text-[10px] text-[var(--muted)] truncate">{article.author}</div>
                        </div>
                        <div className="text-[10px] text-[var(--muted)] whitespace-nowrap">{article.date}</div>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-[var(--muted)]">
              <p>{isFr ? "Aucun article dans cette catégorie pour le moment." : "No article in this category yet."}</p>
            </div>
          )}
        </div>
      </section>

      <section className="relative py-16 px-6 z-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-3xl mx-auto bg-gradient-to-br from-[#0066FF]/20 via-[#0099FF]/10 to-[#FF6B00]/10 border border-[#0066FF]/50 rounded-3xl p-10 md:p-14 backdrop-blur text-center relative overflow-hidden" style={{ boxShadow: "0 0 60px rgba(0,102,255,0.1)" }}>
          <ScanLine />
          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0066FF]/15 border border-[#0066FF]/40 flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-[#0099FF]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-3">{isFr ? "Restez informés" : "Stay informed"}</h2>
            <p className="text-[var(--muted)] mb-6">{isFr ? "Recevez nos meilleurs articles directement dans votre boîte mail, chaque semaine" : "Receive our best articles directly in your inbox every week"}</p>
            <div className="flex gap-3 max-w-md mx-auto flex-col sm:flex-row">
              <input type="email" placeholder="votre@email.com" className="flex-1 bg-[#0A1525] border border-[#1a2540] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0066FF] transition-colors" />
              <motion.button type="button" whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(0,102,255,0.4)" }} whileTap={{ scale: 0.95 }} className="bg-[#0066FF] px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap">{isFr ? "S'abonner" : "Subscribe"}</motion.button>
            </div>
            <p className="text-xs text-[var(--muted)] mt-4">🔒 {isFr ? "Zéro spam. Désabonnement en un clic." : "No spam. Unsubscribe in one click."}</p>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
