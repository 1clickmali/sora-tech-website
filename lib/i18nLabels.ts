export type Lang = "fr" | "en";

const productLabels: Record<string, Record<Lang, string>> = {
  Tous: { fr: "Tous", en: "All" },
  "Matériel": { fr: "Matériel", en: "Hardware" },
  Logiciel: { fr: "Logiciel", en: "Software" },
  "Téléphone": { fr: "Téléphone", en: "Phone" },
  Ordinateur: { fr: "Ordinateur", en: "Computer" },
  Serveur: { fr: "Serveur", en: "Server" },
  Imprimante: { fr: "Imprimante", en: "Printer" },
  "Réseau": { fr: "Réseau", en: "Network" },
  Accessoires: { fr: "Accessoires", en: "Accessories" },
  "Microsoft Office": { fr: "Microsoft Office", en: "Microsoft Office" },
  Odoo: { fr: "Odoo", en: "Odoo" },
  "Gestion d'entreprise": { fr: "Gestion d'entreprise", en: "Business management" },
  "Gestion alimentation / magasin": { fr: "Gestion alimentation / magasin", en: "Food store / shop management" },
  "ERP / CRM": { fr: "ERP / CRM", en: "ERP / CRM" },
  "Comptabilité": { fr: "Comptabilité", en: "Accounting" },
  "Cybersécurité": { fr: "Cybersécurité", en: "Cybersecurity" },
  "Sur mesure": { fr: "Sur mesure", en: "Custom" },
};

const projectLabels: Record<string, Record<Lang, string>> = {
  Tous: { fr: "Tous", en: "All" },
  web: { fr: "Site web", en: "Website" },
  logiciel: { fr: "Logiciel", en: "Software" },
  mobile: { fr: "Application", en: "Application" },
  erp: { fr: "ERP", en: "ERP" },
  cybersecurite: { fr: "Cybersécurité", en: "Cybersecurity" },
  ia: { fr: "IA", en: "AI" },
  reseau: { fr: "Réseau", en: "Network" },
};

const blogLabels: Record<string, Record<Lang, string>> = {
  Tous: { fr: "Tous", en: "All" },
  Digitalisation: { fr: "Digitalisation", en: "Digitalization" },
  "Cybersécurité": { fr: "Cybersécurité", en: "Cybersecurity" },
  Web: { fr: "Web", en: "Web" },
  Mobile: { fr: "Mobile", en: "Mobile" },
  ERP: { fr: "ERP", en: "ERP" },
  Business: { fr: "Business", en: "Business" },
};

export function productLabel(value: string, lang: Lang) {
  return productLabels[value]?.[lang] || value;
}

export function normalizeProjectCategory(value: string) {
  const normalized = value
    ?.trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");

  switch (normalized) {
    case "tous":
    case "all":
      return "Tous";
    case "site web":
    case "website":
    case "web":
      return "web";
    case "logiciel":
    case "software":
      return "logiciel";
    case "application":
    case "applications":
    case "app":
    case "mobile":
      return "mobile";
    case "erp":
      return "erp";
    case "cybersecurite":
    case "cybersecurity":
      return "cybersecurite";
    case "ia":
    case "ai":
      return "ia";
    case "reseau":
    case "network":
      return "reseau";
    default:
      return value;
  }
}

export function projectLabel(value: string, lang: Lang) {
  return projectLabels[normalizeProjectCategory(value)]?.[lang] || value;
}

export function blogLabel(value: string, lang: Lang) {
  return blogLabels[value]?.[lang] || value;
}
