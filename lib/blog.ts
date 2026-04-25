import {
  BookOpen,
  Globe,
  Layers,
  Shield,
  Smartphone,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

export const BLOG_CATEGORIES = [
  "Digitalisation",
  "Cybersécurité",
  "Web",
  "Mobile",
  "ERP",
  "Business",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const BLOG_CATEGORY_META: Record<string, { color: string; icon: LucideIcon }> = {
  Digitalisation: { color: "#0099FF", icon: Globe },
  Cybersécurité: { color: "#FF4757", icon: Shield },
  ERP: { color: "#9B93FF", icon: Layers },
  Web: { color: "#0066FF", icon: Globe },
  Mobile: { color: "#00C48C", icon: Smartphone },
  Business: { color: "#FF6B00", icon: TrendingUp },
};

export type BlogArticle = {
  id: string | number;
  slug?: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  date?: string;
  readTime?: string;
  author?: string;
  featured?: boolean;
  image?: string;
  createdAt?: string;
};

type RawArticle = Partial<BlogArticle> & {
  _id?: string;
  createdAt?: string;
  readTime?: string | number;
  featured?: boolean;
  image?: string;
  author?: string;
};

function staticContent(title: string, excerpt: string) {
  return `${excerpt}

Chez SORA TECH, nous publions des conseils concrets pour aider les entreprises à mieux choisir leurs outils, structurer leurs opérations et accélérer leur digitalisation.

Dans ce sujet, nous revenons sur les bonnes pratiques, les erreurs fréquentes à éviter et les décisions les plus rentables pour une PME en Afrique de l'Ouest.

Si vous avez besoin d'un accompagnement personnalisé, notre équipe peut aussi vous aider à transformer ce sujet en plan d'action opérationnel.`;
}

export const STATIC_ARTICLES: BlogArticle[] = [
  {
    id: "static-1",
    slug: "comment-digitaliser-votre-boutique-en-2025",
    category: "Digitalisation",
    title: "Comment digitaliser votre boutique en 2025 : le guide complet",
    excerpt:
      "Découvrez les étapes essentielles pour transformer votre commerce traditionnel en entreprise digitale moderne et rentable.",
    content: staticContent(
      "Comment digitaliser votre boutique en 2025 : le guide complet",
      "Découvrez les étapes essentielles pour transformer votre commerce traditionnel en entreprise digitale moderne et rentable."
    ),
    date: "15 Avril 2025",
    readTime: "8 min",
    author: "Sissoko Abdoulaye",
    featured: true,
  },
  {
    id: "static-2",
    slug: "5-erreurs-fatales-cybersecurite-pme",
    category: "Cybersécurité",
    title: "5 erreurs fatales qui mettent en danger la sécurité de votre PME",
    excerpt:
      "Protégez vos données contre les cyberattaques. Ces erreurs courantes coûtent des millions aux entreprises africaines.",
    content: staticContent(
      "5 erreurs fatales qui mettent en danger la sécurité de votre PME",
      "Protégez vos données contre les cyberattaques. Ces erreurs courantes coûtent des millions aux entreprises africaines."
    ),
    date: "12 Avril 2025",
    readTime: "6 min",
    author: "Sissoko Abdoulaye",
  },
  {
    id: "static-3",
    slug: "pourquoi-votre-entreprise-a-besoin-d-un-erp-en-2025",
    category: "ERP",
    title: "Pourquoi votre entreprise a besoin d'un ERP en 2025",
    excerpt:
      "Gagnez en efficacité et en rentabilité avec un système de gestion intégré adapté aux entreprises ivoiriennes.",
    content: staticContent(
      "Pourquoi votre entreprise a besoin d'un ERP en 2025",
      "Gagnez en efficacité et en rentabilité avec un système de gestion intégré adapté aux entreprises ivoiriennes."
    ),
    date: "10 Avril 2025",
    readTime: "10 min",
    author: "Lead Developer",
  },
  {
    id: "static-4",
    slug: "site-vitrine-ou-ecommerce-que-choisir",
    category: "Web",
    title: "Site vitrine ou e-commerce : que choisir pour son business ?",
    excerpt:
      "On vous aide à faire le bon choix selon votre activité, votre budget et vos objectifs commerciaux.",
    content: staticContent(
      "Site vitrine ou e-commerce : que choisir pour son business ?",
      "On vous aide à faire le bon choix selon votre activité, votre budget et vos objectifs commerciaux."
    ),
    date: "8 Avril 2025",
    readTime: "5 min",
    author: "UX Designer",
  },
  {
    id: "static-5",
    slug: "avenir-des-applications-mobiles-en-cote-d-ivoire",
    category: "Mobile",
    title: "L'avenir des applications mobiles en Côte d'Ivoire",
    excerpt:
      "Pourquoi investir maintenant dans le mobile est crucial pour rester compétitif dans le marché ivoirien.",
    content: staticContent(
      "L'avenir des applications mobiles en Côte d'Ivoire",
      "Pourquoi investir maintenant dans le mobile est crucial pour rester compétitif dans le marché ivoirien."
    ),
    date: "5 Avril 2025",
    readTime: "7 min",
    author: "Sissoko Abdoulaye",
  },
  {
    id: "static-6",
    slug: "10-outils-digitaux-indispensables-pour-les-pme-africaines",
    category: "Business",
    title: "10 outils digitaux indispensables pour les PME africaines",
    excerpt:
      "Découvrez les outils qui boostent la productivité et la croissance des petites entreprises en Afrique.",
    content: staticContent(
      "10 outils digitaux indispensables pour les PME africaines",
      "Découvrez les outils qui boostent la productivité et la croissance des petites entreprises en Afrique."
    ),
    date: "2 Avril 2025",
    readTime: "9 min",
    author: "Lead Developer",
  },
  {
    id: "static-7",
    slug: "mobile-money-comment-securiser-les-transactions",
    category: "Cybersécurité",
    title: "Mobile Money : comment sécuriser les transactions de votre entreprise",
    excerpt:
      "Protégez vos paiements Wave, Orange Money et MTN Money contre la fraude avec ces bonnes pratiques.",
    content: staticContent(
      "Mobile Money : comment sécuriser les transactions de votre entreprise",
      "Protégez vos paiements Wave, Orange Money et MTN Money contre la fraude avec ces bonnes pratiques."
    ),
    date: "30 Mars 2025",
    readTime: "6 min",
    author: "Security Expert",
  },
  {
    id: "static-8",
    slug: "passer-du-papier-a-un-logiciel-de-gestion",
    category: "Digitalisation",
    title: "Comment passer d'un registre papier à un logiciel de gestion",
    excerpt:
      "Guide pas à pas pour les commerçants qui veulent abandonner le papier et passer au digital.",
    content: staticContent(
      "Comment passer d'un registre papier à un logiciel de gestion",
      "Guide pas à pas pour les commerçants qui veulent abandonner le papier et passer au digital."
    ),
    date: "28 Mars 2025",
    readTime: "7 min",
    author: "Sissoko Abdoulaye",
  },
  {
    id: "static-9",
    slug: "referencement-seo-local-abidjan",
    category: "Web",
    title: "Référencement SEO local : être visible sur Google à Abidjan",
    excerpt:
      "Les techniques éprouvées pour apparaître en première page quand vos clients cherchent vos services.",
    content: staticContent(
      "Référencement SEO local : être visible sur Google à Abidjan",
      "Les techniques éprouvées pour apparaître en première page quand vos clients cherchent vos services."
    ),
    date: "25 Mars 2025",
    readTime: "8 min",
    author: "UX Designer",
  },
];

export function formatReadTime(readTime?: string | number | null, content?: string) {
  if (typeof readTime === "string" && readTime.trim()) {
    return readTime.includes("min") ? readTime : `${readTime} min`;
  }

  if (typeof readTime === "number" && Number.isFinite(readTime)) {
    return `${readTime} min`;
  }

  if (content) {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    return `${Math.max(1, Math.ceil(words / 200))} min`;
  }

  return "5 min";
}

export function normalizeArticle(article: RawArticle): BlogArticle {
  const fallbackId = article._id || article.id || article.slug || article.title || 'article-fallback';

  return {
    id: fallbackId,
    slug: article.slug,
    title: article.title || 'Article SORA TECH',
    excerpt: article.excerpt || "",
    content: article.content || "",
    category: article.category || "Digitalisation",
    date: article.createdAt ? new Date(article.createdAt).toLocaleDateString("fr-FR") : article.date,
    readTime: formatReadTime(article.readTime, article.content),
    author: article.author || "SORA TECH",
    featured: Boolean(article.featured),
    image: article.image || "",
    createdAt: article.createdAt,
  };
}

export function getBlogCategories(articles: BlogArticle[]) {
  const unique = new Set(BLOG_CATEGORIES);

  articles.forEach((article) => {
    if (article.category) unique.add(article.category as BlogCategory);
  });

  return ["Tous", ...Array.from(unique)];
}

export function getArticleHref(article: Pick<BlogArticle, "slug" | "id">) {
  if (article.slug) return `/blog/${article.slug}`;
  return `/blog/${article.id}`;
}

export const BLOG_FALLBACK_META = { color: "#0099FF", icon: BookOpen };
