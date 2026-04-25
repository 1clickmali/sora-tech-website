import {
  Globe,
  Monitor,
  Shield,
  ShoppingCart,
  Smartphone,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const PRODUCT_CATEGORIES = ["Matériel", "Logiciel"] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const PRODUCT_SUBCATEGORIES: Record<ProductCategory, string[]> = {
  "Matériel": [
    "Téléphone",
    "Ordinateur",
    "Serveur",
    "Imprimante",
    "Réseau",
    "Accessoires",
  ],
  "Logiciel": [
    "Microsoft Office",
    "Odoo",
    "Gestion d'entreprise",
    "Gestion alimentation / magasin",
    "ERP / CRM",
    "Comptabilité",
    "Cybersécurité",
    "Sur mesure",
  ],
};

export const DEFAULT_SUBCATEGORY: Record<ProductCategory, string> = {
  "Matériel": "Ordinateur",
  "Logiciel": "Gestion d'entreprise",
};

export const PRODUCT_CATEGORY_COLORS: Record<ProductCategory, string> = {
  "Matériel": "#FF6B00",
  "Logiciel": "#0099FF",
};

const PRODUCT_SUBCATEGORY_META: Record<string, { color: string; icon: LucideIcon }> = {
  "Téléphone": { color: "#FF6B00", icon: Smartphone },
  "Ordinateur": { color: "#FF8B3D", icon: Monitor },
  "Serveur": { color: "#FF9F66", icon: Monitor },
  "Imprimante": { color: "#FFB38F", icon: Monitor },
  "Réseau": { color: "#FF8B3D", icon: Globe },
  "Accessoires": { color: "#FFB38F", icon: Wrench },
  "Microsoft Office": { color: "#0099FF", icon: Monitor },
  "Odoo": { color: "#6BB6FF", icon: Globe },
  "Gestion d'entreprise": { color: "#00C48C", icon: Globe },
  "Gestion alimentation / magasin": { color: "#FF6B00", icon: ShoppingCart },
  "ERP / CRM": { color: "#9B93FF", icon: Globe },
  "Comptabilité": { color: "#00C48C", icon: Monitor },
  "Cybersécurité": { color: "#FF4757", icon: Shield },
  "Sur mesure": { color: "#00C48C", icon: Wrench },
};

function includesOneOf(text: string, patterns: string[]) {
  return patterns.some((pattern) => text.includes(pattern));
}

export function normalizeProductCategory(value?: string | null, context = ""): ProductCategory {
  const raw = (value || "").trim().toLowerCase();
  const text = `${raw} ${context}`.toLowerCase();

  if (raw === "matériel" || raw === "materiel") return "Matériel";
  if (raw === "logiciel" || raw === "logiciels") return "Logiciel";

  if (
    includesOneOf(text, [
      "téléphone",
      "telephone",
      "smartphone",
      "android",
      "iphone",
      "ordinateur",
      "pc",
      "laptop",
      "serveur",
      "server",
      "imprimante",
      "réseau",
      "reseau",
      "routeur",
      "switch",
      "accessoire",
      "clavier",
      "souris",
      "disque",
    ])
  ) {
    return "Matériel";
  }

  return "Logiciel";
}

export function normalizeProductSubcategory(
  categoryInput?: string | null,
  subcategoryInput?: string | null,
  context = ""
) {
  const category = normalizeProductCategory(categoryInput, context);
  const allowed = PRODUCT_SUBCATEGORIES[category];
  const subcategory = (subcategoryInput || "").trim();

  if (allowed.includes(subcategory)) {
    return subcategory;
  }

  const text = `${subcategoryInput || ""} ${context}`.toLowerCase();

  if (category === "Matériel") {
    if (includesOneOf(text, ["téléphone", "telephone", "smartphone", "android", "iphone"])) return "Téléphone";
    if (includesOneOf(text, ["serveur", "server", "rack"])) return "Serveur";
    if (includesOneOf(text, ["imprimante", "printer"])) return "Imprimante";
    if (includesOneOf(text, ["réseau", "reseau", "routeur", "switch", "wifi"])) return "Réseau";
    if (includesOneOf(text, ["accessoire", "clavier", "souris", "casque", "disque"])) return "Accessoires";
    if (includesOneOf(text, ["ordinateur", "pc", "laptop", "desktop"])) return "Ordinateur";
    return DEFAULT_SUBCATEGORY["Matériel"];
  }

  if (includesOneOf(text, ["office", "excel", "word", "powerpoint", "outlook"])) return "Microsoft Office";
  if (includesOneOf(text, ["odoo"])) return "Odoo";
  if (includesOneOf(text, ["alimentation", "magasin", "boutique", "caisse", "pos", "stock"])) return "Gestion alimentation / magasin";
  if (includesOneOf(text, ["erp", "crm"])) return "ERP / CRM";
  if (includesOneOf(text, ["compta", "compta", "facturation", "finance"])) return "Comptabilité";
  if (includesOneOf(text, ["cyber", "sécurité", "securite", "antivirus"])) return "Cybersécurité";
  if (includesOneOf(text, ["sur mesure", "personnalisé", "personnalise", "custom"])) return "Sur mesure";
  return DEFAULT_SUBCATEGORY["Logiciel"];
}

export function normalizeProductTaxonomy<T extends { category?: string; subcategory?: string; title?: string; description?: string }>(
  product: T
) {
  const context = [product.title, product.description, product.category, product.subcategory]
    .filter(Boolean)
    .join(" ");
  const category = normalizeProductCategory(product.category, context);
  const subcategory = normalizeProductSubcategory(category, product.subcategory, context);

  return {
    ...product,
    category,
    subcategory,
  };
}

export function getSubcategoriesForCategory(category: string) {
  if (category !== "Matériel" && category !== "Logiciel") return [];
  return PRODUCT_SUBCATEGORIES[category];
}

export function getProductDisplayMeta(categoryInput?: string | null, subcategoryInput?: string | null) {
  const category = normalizeProductCategory(categoryInput);
  const subcategory = normalizeProductSubcategory(category, subcategoryInput);

  return PRODUCT_SUBCATEGORY_META[subcategory] || {
    color: PRODUCT_CATEGORY_COLORS[category],
    icon: category === "Matériel" ? Monitor : Wrench,
  };
}
