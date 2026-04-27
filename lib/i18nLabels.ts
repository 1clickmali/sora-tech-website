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
  "Site web": { fr: "Site web", en: "Website" },
  Logiciel: { fr: "Logiciel", en: "Software" },
  Application: { fr: "Application", en: "Application" },
  ERP: { fr: "ERP", en: "ERP" },
  "Cybersécurité": { fr: "Cybersécurité", en: "Cybersecurity" },
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

export function projectLabel(value: string, lang: Lang) {
  return projectLabels[value]?.[lang] || value;
}

export function blogLabel(value: string, lang: Lang) {
  return blogLabels[value]?.[lang] || value;
}
