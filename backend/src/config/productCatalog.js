const PRODUCT_CATEGORIES = ['Matériel', 'Logiciel'];

const PRODUCT_SUBCATEGORIES = {
  'Matériel': ['Téléphone', 'Ordinateur', 'Serveur', 'Imprimante', 'Réseau', 'Accessoires'],
  'Logiciel': [
    'Microsoft Office',
    'Odoo',
    "Gestion d'entreprise",
    'Gestion alimentation / magasin',
    'ERP / CRM',
    'Comptabilité',
    'Cybersécurité',
    'Sur mesure',
  ],
};

const DEFAULT_SUBCATEGORY = {
  'Matériel': 'Ordinateur',
  'Logiciel': "Gestion d'entreprise",
};

function includesOneOf(text, patterns) {
  return patterns.some((pattern) => text.includes(pattern));
}

function normalizeProductCategory(value, context = '') {
  const raw = (value || '').trim().toLowerCase();
  const text = `${raw} ${context}`.toLowerCase();

  if (raw === 'matériel' || raw === 'materiel') return 'Matériel';
  if (raw === 'logiciel' || raw === 'logiciels') return 'Logiciel';

  if (
    includesOneOf(text, [
      'téléphone',
      'telephone',
      'smartphone',
      'android',
      'iphone',
      'ordinateur',
      'pc',
      'laptop',
      'serveur',
      'server',
      'imprimante',
      'réseau',
      'reseau',
      'routeur',
      'switch',
      'accessoire',
      'clavier',
      'souris',
      'disque',
    ])
  ) {
    return 'Matériel';
  }

  return 'Logiciel';
}

function normalizeProductSubcategory(categoryInput, subcategoryInput, context = '') {
  const category = normalizeProductCategory(categoryInput, context);
  const allowed = PRODUCT_SUBCATEGORIES[category];
  const subcategory = (subcategoryInput || '').trim();

  if (allowed.includes(subcategory)) {
    return subcategory;
  }

  const text = `${subcategoryInput || ''} ${context}`.toLowerCase();

  if (category === 'Matériel') {
    if (includesOneOf(text, ['téléphone', 'telephone', 'smartphone', 'android', 'iphone'])) return 'Téléphone';
    if (includesOneOf(text, ['serveur', 'server', 'rack'])) return 'Serveur';
    if (includesOneOf(text, ['imprimante', 'printer'])) return 'Imprimante';
    if (includesOneOf(text, ['réseau', 'reseau', 'routeur', 'switch', 'wifi'])) return 'Réseau';
    if (includesOneOf(text, ['accessoire', 'clavier', 'souris', 'casque', 'disque'])) return 'Accessoires';
    if (includesOneOf(text, ['ordinateur', 'pc', 'laptop', 'desktop'])) return 'Ordinateur';
    return DEFAULT_SUBCATEGORY['Matériel'];
  }

  if (includesOneOf(text, ['office', 'excel', 'word', 'powerpoint', 'outlook'])) return 'Microsoft Office';
  if (includesOneOf(text, ['odoo'])) return 'Odoo';
  if (includesOneOf(text, ['alimentation', 'magasin', 'boutique', 'caisse', 'pos', 'stock'])) return 'Gestion alimentation / magasin';
  if (includesOneOf(text, ['erp', 'crm'])) return 'ERP / CRM';
  if (includesOneOf(text, ['compta', 'facturation', 'finance'])) return 'Comptabilité';
  if (includesOneOf(text, ['cyber', 'sécurité', 'securite', 'antivirus'])) return 'Cybersécurité';
  if (includesOneOf(text, ['sur mesure', 'personnalisé', 'personnalise', 'custom'])) return 'Sur mesure';
  return DEFAULT_SUBCATEGORY['Logiciel'];
}

function normalizeProductPayload(product = {}) {
  const context = [product.title, product.description, product.category, product.subcategory]
    .filter(Boolean)
    .join(' ');
  const category = normalizeProductCategory(product.category, context);
  const subcategory = normalizeProductSubcategory(category, product.subcategory, context);

  return {
    ...product,
    category,
    subcategory,
  };
}

module.exports = {
  PRODUCT_CATEGORIES,
  PRODUCT_SUBCATEGORIES,
  DEFAULT_SUBCATEGORY,
  normalizeProductCategory,
  normalizeProductSubcategory,
  normalizeProductPayload,
};
