"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BookOpen, Clock, User } from "lucide-react";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  BLOG_CATEGORY_META,
  BLOG_FALLBACK_META,
  STATIC_ARTICLES,
  normalizeArticle,
  type BlogArticle,
} from "@/lib/blog";
import { resolveMediaUrl } from "@/lib/media";

function renderContent(content: string) {
  return content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => {
      const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);

      if (block.startsWith('## ')) {
        return <h2 key={index} className="text-2xl md:text-3xl font-black mt-10 mb-4" style={{ color: "var(--text)" }}>{block.slice(3)}</h2>;
      }

      if (block.startsWith('# ')) {
        return <h2 key={index} className="text-3xl md:text-4xl font-black mt-10 mb-4" style={{ color: "var(--text)" }}>{block.slice(2)}</h2>;
      }

      if (lines.length > 1 && lines.every((line) => line.startsWith('- '))) {
        return (
          <ul key={index} className="space-y-3 my-6" style={{ color: "var(--muted)" }}>
            {lines.map((line, lineIndex) => (
              <li key={lineIndex} className="flex items-start gap-3">
                <span className="text-[#0099FF] mt-1.5 text-[10px]">●</span>
                <span>{line.slice(2)}</span>
              </li>
            ))}
          </ul>
        );
      }

      return <p key={index} className="leading-8 text-base md:text-lg mb-6" style={{ color: "var(--muted)" }}>{block}</p>;
    });
}

export default function BlogArticlePage() {
  const params = useParams<{ slug: string }>();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const fallbackArticle = STATIC_ARTICLES.find((article) => article.slug === slug) || null;

  const [article, setArticle] = useState<BlogArticle | null>(fallbackArticle);
  const [loading, setLoading] = useState(!fallbackArticle);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let active = true;

    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/articles/${slug}`)
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Article introuvable");
        return data;
      })
      .then((response) => {
        if (active && response.data) {
          setArticle(normalizeArticle(response.data));
        }
      })
      .catch(() => {
        if (active && !fallbackArticle) {
          setNotFound(true);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [fallbackArticle, slug]);

  const meta = BLOG_CATEGORY_META[article?.category || ""] || BLOG_FALLBACK_META;
  const Icon = meta.icon;

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(#0099FF 1px, transparent 1px), linear-gradient(90deg, #0099FF 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#0066FF] rounded-full blur-[150px] opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#9B93FF] rounded-full blur-[150px] opacity-15 animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <Navbar active="blog" />

      <section className="relative z-10 px-6 pt-10 pb-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[#8899BB] hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
            Retour au blog
          </Link>
        </div>
      </section>

      {loading && !article ? (
        <section className="relative z-10 px-6 py-20">
          <div className="max-w-4xl mx-auto text-center text-[#8899BB]">Chargement de l&apos;article...</div>
        </section>
      ) : notFound || !article ? (
        <section className="relative z-10 px-6 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0A1525] border border-[#1a2540] flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-[#0099FF]" />
            </div>
            <h1 className="text-3xl font-black mb-3">Article introuvable</h1>
            <p className="text-[#8899BB] mb-6">Cet article n&apos;est pas disponible ou n&apos;est pas encore publié.</p>
            <Link href="/blog" className="inline-flex bg-[#0066FF] px-5 py-3 rounded-xl font-bold text-sm">Voir les autres articles</Link>
          </div>
        </section>
      ) : (
        <>
          <section className="relative z-10 px-6 pb-10">
            <div className="max-w-4xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] tracking-[2px] font-bold mb-5" style={{ color: meta.color, backgroundColor: `${meta.color}15`, border: `1px solid ${meta.color}30` }}>
                  <Icon className="w-3.5 h-3.5" />
                  {article.category}
                </div>
                <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">{article.title}</h1>
                <p className="text-[#9FB0CC] text-lg md:text-xl leading-relaxed max-w-3xl">{article.excerpt}</p>
              </motion.div>

              <div className="flex flex-wrap items-center gap-5 text-sm text-[#8899BB] mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0066FF] to-[#0099FF] flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" />{article.readTime}</div>
                {article.date && <div>{article.date}</div>}
              </div>

              <div className="rounded-3xl overflow-hidden border border-[#1a2540] bg-[#0A1525] mb-10">
                {article.image ? (
                  <img src={resolveMediaUrl(article.image)} alt={article.title} className="w-full h-[260px] md:h-[460px] object-cover" />
                ) : (
                  <div className="w-full h-[260px] md:h-[420px] flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${meta.color}20, rgba(4,10,20,0.85))` }}>
                    <div className="w-24 h-24 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center">
                      <Icon className="w-12 h-12 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="relative z-10 px-6 pb-20">
            <div className="max-w-3xl mx-auto bg-[#0A1525]/80 border border-[#1a2540] rounded-3xl p-8 md:p-12 backdrop-blur">
              {renderContent(article.content || article.excerpt)}
            </div>
          </section>

          <section className="relative z-10 px-6 pb-20">
            <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-3xl mx-auto bg-gradient-to-br from-[#0066FF]/20 via-[#0099FF]/10 to-[#FF6B00]/10 border border-[#0066FF]/50 rounded-3xl p-10 text-center backdrop-blur">
              <h2 className="text-3xl md:text-4xl font-black mb-4">Besoin d&apos;un accompagnement ?</h2>
              <p className="text-[#9FB0CC] mb-6">Notre équipe peut transformer ces idées en solution concrète pour ton entreprise.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/devis" className="bg-[#0066FF] px-6 py-3 rounded-xl font-bold text-sm">Demander un devis</Link>
                <Link href="/contact" className="bg-[#0A1525] border border-[#1a2540] px-6 py-3 rounded-xl font-bold text-sm">Parler à l&apos;équipe</Link>
              </div>
            </motion.div>
          </section>
        </>
      )}

      <Footer />
    </div>
  );
}
