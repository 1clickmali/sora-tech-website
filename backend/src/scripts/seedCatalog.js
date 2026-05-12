/**
 * Seed script — 25 produits + 6 articles de blog
 * Usage local : node src/scripts/seedCatalog.js
 * Usage Railway : appelé automatiquement au démarrage si catalog vide
 */

require('dotenv').config();
const connectDB = require('../config/database');
const Produit = require('../models/Produit');
const Article = require('../models/Article');

// ─── Images Unsplash stables ───────────────────────────────────────────────
const IMG = {
  laptop:       'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80&fit=crop',
  laptop2:      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80&fit=crop',
  desktop:      'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&q=80&fit=crop',
  tablet:       'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80&fit=crop',
  router:       'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&fit=crop',
  switch:       'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80&fit=crop',
  hdd:          'https://images.unsplash.com/photo-1601737487795-dab272f52420?w=800&q=80&fit=crop',
  usb:          'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&q=80&fit=crop',
  webcam:       'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80&fit=crop',
  headphones:   'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80&fit=crop',
  mouse:        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80&fit=crop',
  keyboard:     'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80&fit=crop',
  ups:          'https://images.unsplash.com/photo-1588421357574-87938a86fa28?w=800&q=80&fit=crop',
  cable:        'https://images.unsplash.com/photo-1601524909162-ae8725290836?w=800&q=80&fit=crop',
  printer:      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&q=80&fit=crop',
  monitor:      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80&fit=crop',
  office:       'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80&fit=crop',
  pos:          'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80&fit=crop',
  antivirus:    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80&fit=crop',
  accounting:   'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80&fit=crop',
  erp:          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&fit=crop',
  stock:        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80&fit=crop',
  webdesign:    'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80&fit=crop',
  security2:    'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80&fit=crop',
  hubusb:       'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&q=80&fit=crop',
  // Articles
  artLaptop:    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=85&fit=crop',
  artCyber:     'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1200&q=85&fit=crop',
  artDigital:   'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=85&fit=crop',
  artSoftware:  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=85&fit=crop',
  artERP:       'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=85&fit=crop',
  artWeb:       'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=85&fit=crop',
};

// ─── 25 Produits ───────────────────────────────────────────────────────────
const PRODUITS = [
  // ── MATÉRIEL / Ordinateur ──
  {
    title: 'Laptop HP 15s Core i5 12ème Gén. — 8Go RAM / 512Go SSD',
    description: 'Ordinateur portable professionnel HP 15s équipé du processeur Intel Core i5 12ème génération. Idéal pour les professionnels, étudiants et entrepreneurs. Léger, rapide et autonome avec jusqu\'à 8h de batterie. Parfait pour le travail au bureau ou en déplacement à Abidjan.',
    price: 395000,
    category: 'Matériel',
    subcategory: 'Ordinateur',
    image: IMG.laptop,
    images: [IMG.laptop, IMG.laptop2],
    badge: 'Bestseller',
    digital: false,
    stock: 8,
    specs: { brand: 'HP', processor: 'Intel Core i5 12ème génération', ram: '8 Go DDR4', storage: '512 Go SSD NVMe', screen: '15.6" Full HD', os: 'Windows 11 Pro', battery: '41Wh / ~8h', condition: 'Neuf', warranty: '1 an constructeur' },
    features: ['Processeur Intel Core i5 12ème génération', '8 Go de RAM DDR4 extensible à 16 Go', '512 Go SSD NVMe ultra-rapide', 'Écran 15.6" Full HD anti-reflets', 'Windows 11 Pro préinstallé', 'Batterie longue durée ~8h', 'WiFi 6 + Bluetooth 5.0', 'Poids : 1.74 kg'],
    order: 1,
  },
  {
    title: 'Laptop Lenovo IdeaPad 15" Core i3 — 8Go / 256Go SSD',
    description: 'L\'ordinateur portable idéal pour démarrer votre activité sans se ruiner. Le Lenovo IdeaPad offre des performances solides pour la bureautique, la navigation web et la gestion quotidienne. Disponible à Abidjan avec garantie 1 an.',
    price: 295000,
    category: 'Matériel',
    subcategory: 'Ordinateur',
    image: IMG.laptop2,
    images: [IMG.laptop2],
    badge: 'Bon plan',
    digital: false,
    stock: 12,
    specs: { brand: 'Lenovo', processor: 'Intel Core i3 11ème génération', ram: '8 Go DDR4', storage: '256 Go SSD', screen: '15.6" HD', os: 'Windows 11 Home', battery: '38Wh / ~7h', condition: 'Neuf', warranty: '1 an constructeur' },
    features: ['Core i3 11ème génération pour la bureautique', '8 Go RAM — multitâche fluide', '256 Go SSD — démarrage en 15 secondes', 'Port USB-C + HDMI + SD Card', 'Clavier ergonomique avec pavé numérique', 'WiFi 5 + Bluetooth 5.0'],
    order: 2,
  },
  {
    title: 'PC Bureau Dell OptiPlex Core i5 — 16Go RAM / 512Go SSD',
    description: 'PC de bureau professionnel Dell OptiPlex, la référence pour les entreprises ivoiriennes. Compact, silencieux et ultra-fiable. Livré avec clavier et souris. Parfait pour les postes de travail en entreprise, commerces ou administrations.',
    price: 385000,
    category: 'Matériel',
    subcategory: 'Ordinateur',
    image: IMG.desktop,
    images: [IMG.desktop],
    digital: false,
    stock: 5,
    specs: { brand: 'Dell', processor: 'Intel Core i5 10ème génération', ram: '16 Go DDR4', storage: '512 Go SSD', os: 'Windows 11 Pro', condition: 'Neuf', warranty: '3 ans constructeur' },
    features: ['Intel Core i5 10ème génération', '16 Go RAM DDR4', 'SSD 512 Go — rapide et silencieux', 'Port USB-C, USB 3.0 x4, DisplayPort', 'Garantie 3 ans Dell ProSupport', 'Livré avec clavier + souris Dell'],
    order: 3,
  },
  {
    title: 'Tablette Samsung Galaxy Tab A8 10.5" — 4Go / 64Go',
    description: 'La tablette Samsung Galaxy Tab A8 est parfaite pour les professionnels en déplacement, les présentations clients et les démonstrations. Grand écran 10.5" Full HD, son stéréo Dolby Atmos et autonomie de 12h. Idéale aussi comme écran de caisse ou catalogue produits.',
    price: 175000,
    category: 'Matériel',
    subcategory: 'Téléphone',
    image: IMG.tablet,
    images: [IMG.tablet],
    badge: 'Polyvalente',
    digital: false,
    stock: 15,
    specs: { brand: 'Samsung', processor: 'Unisoc T618', ram: '4 Go', storage: '64 Go extensible via microSD', screen: '10.5" Full HD+ (1920x1200)', battery: '7040 mAh / ~12h', os: 'Android 11', condition: 'Neuf', warranty: '1 an constructeur' },
    features: ['Écran 10.5" Full HD+ Anti-reflets', 'Son stéréo Dolby Atmos (4 haut-parleurs)', 'Stockage extensible microSD jusqu\'à 1 To', 'WiFi 5 + Bluetooth 5.0', 'Chargement rapide 15W', 'Ultra légère 508g'],
    order: 4,
  },

  // ── MATÉRIEL / Réseau ──
  {
    title: 'Routeur WiFi TP-Link Archer C6 AC1200 Dual Band',
    description: 'Le routeur WiFi TP-Link Archer C6 est la solution idéale pour les PME et domiciles à Abidjan. Couverture WiFi sur 2 étages, 4 antennes haute gain, vitesse jusqu\'à 1200 Mbps. Compatible Orange CI, MTN CI, Côte d\'Ivoire Telecom. Installation facile en 5 minutes.',
    price: 38000,
    category: 'Matériel',
    subcategory: 'Réseau',
    image: IMG.router,
    images: [IMG.router],
    badge: 'Le plus vendu',
    digital: false,
    stock: 30,
    specs: { brand: 'TP-Link', condition: 'Neuf', warranty: '2 ans constructeur' },
    features: ['WiFi Dual Band 2.4GHz + 5GHz', 'Vitesse jusqu\'à 1200 Mbps', '4 antennes omnidirectionnelles 5dBi', '4 ports LAN Gigabit + 1 WAN', 'Compatibilité universelle (Orange, MTN, SODECI...)', 'Application TP-Link Tether (gestion smartphone)', 'MU-MIMO — plusieurs appareils simultanément'],
    order: 5,
  },
  {
    title: 'Switch Réseau TP-Link 8 Ports Gigabit TL-SG108',
    description: 'Switch non manageable TP-Link 8 ports Gigabit, parfait pour connecter en filaire tous les équipements de votre bureau ou commerce. Plug & Play, aucune configuration requise. Boîtier métal robuste, consommation ultra-faible.',
    price: 22000,
    category: 'Matériel',
    subcategory: 'Réseau',
    image: IMG.switch,
    images: [IMG.switch],
    digital: false,
    stock: 25,
    specs: { brand: 'TP-Link', condition: 'Neuf', warranty: '2 ans' },
    features: ['8 ports RJ45 Gigabit 10/100/1000 Mbps', 'Plug & Play — aucune configuration', 'Boîtier métal robuste et silencieux', 'Technologie verte — économie d\'énergie 78%', 'Garantie 2 ans TP-Link', 'Idéal PME, cybercafé, boutique'],
    order: 6,
  },
  {
    title: 'Point d\'Accès WiFi TP-Link EAP225 AC1350 Plafond',
    description: 'Point d\'accès WiFi professionnel pour boutiques, restaurants, hôtels et bureaux. Montage au plafond, couverture jusqu\'à 80m², gestion centralisée via Omada Cloud. Dual Band AC1350 pour une connexion stable de tous vos clients.',
    price: 58000,
    category: 'Matériel',
    subcategory: 'Réseau',
    image: IMG.router,
    images: [IMG.router],
    badge: 'Pro',
    digital: false,
    stock: 18,
    specs: { brand: 'TP-Link', condition: 'Neuf', warranty: '3 ans' },
    features: ['WiFi AC1350 Dual Band (400 + 867 Mbps)', 'Couverture jusqu\'à 80m²', '256 clients simultanés', 'Alimentation PoE (câble réseau suffit)', 'Gestion cloud Omada gratuite', 'Idéal hotel, restaurant, boutique, bureau'],
    order: 7,
  },

  // ── MATÉRIEL / Accessoires ──
  {
    title: 'Disque Dur Externe Seagate 1 To USB 3.0 — Backup Plus',
    description: 'Sauvegardez toutes vos données professionnelles en toute sécurité avec le Seagate Backup Plus 1 To. Plug & Play sous Windows et Mac. Livré avec câble USB 3.0. Compatible aussi bien avec les PC de bureau que les laptops.',
    price: 58000,
    category: 'Matériel',
    subcategory: 'Accessoires',
    image: IMG.hdd,
    images: [IMG.hdd],
    digital: false,
    stock: 20,
    specs: { brand: 'Seagate', storage: '1 To (1000 Go)', condition: 'Neuf', warranty: '2 ans' },
    features: ['Capacité 1 To (1000 Go)', 'USB 3.0 — transfert jusqu\'à 120 Mo/s', 'Compatible Windows 10/11 et MacOS', 'Boîtier compact et portable (sans adaptateur)', 'Logiciel de sauvegarde automatique inclus', 'Garantie 2 ans Seagate'],
    order: 8,
  },
  {
    title: 'Clé USB SanDisk Ultra 64 Go USB 3.0 — 150 Mo/s',
    description: 'La clé USB SanDisk Ultra 64 Go est 15x plus rapide qu\'une clé USB 2.0 standard. Transférez un film HD en 30 secondes. Corps glissant pour protéger le connecteur. Idéale pour partager vos présentations, fichiers clients et sauvegardes.',
    price: 9500,
    category: 'Matériel',
    subcategory: 'Accessoires',
    image: IMG.usb,
    images: [IMG.usb],
    digital: false,
    stock: 50,
    specs: { brand: 'SanDisk', storage: '64 Go', condition: 'Neuf', warranty: '5 ans' },
    features: ['64 Go de stockage', 'USB 3.0 — vitesse de lecture jusqu\'à 150 Mo/s', 'Corps glissant — connecteur protégé', 'Compatible USB 2.0 (rétrocompatible)', 'Garantie 5 ans SanDisk', 'Certifiée RescuePRO Deluxe (récupération de données)'],
    order: 9,
  },
  {
    title: 'Webcam Logitech C270 HD 720p — Micro intégré',
    description: 'La Logitech C270 est la webcam la plus vendue pour le télétravail et les visioconférences. Compatible Zoom, Teams, Google Meet. Image HD 720p claire, micro antibruit intégré. Plug & Play sur Windows et Mac — aucun driver à installer.',
    price: 28000,
    category: 'Matériel',
    subcategory: 'Accessoires',
    image: IMG.webcam,
    images: [IMG.webcam],
    digital: false,
    stock: 22,
    specs: { brand: 'Logitech', condition: 'Neuf', warranty: '2 ans' },
    features: ['Résolution vidéo HD 720p (1280x720)', 'Micro intégré avec filtre de bruit', 'Compatible Zoom, Teams, Meet, Skype', 'Plug & Play — aucun driver', 'Clip universel pour écran ou bureau', 'Compatible Windows, Mac, Chrome OS'],
    order: 10,
  },
  {
    title: 'Casque avec Micro Logitech H390 USB — Son stéréo',
    description: 'Le casque USB Logitech H390 offre un son stéréo riche et un micro antibruit performant pour vos réunions, appels clients et présentations. Léger et confortable pour une utilisation toute la journée. Contrôle du volume intégré sur le câble.',
    price: 24000,
    category: 'Matériel',
    subcategory: 'Accessoires',
    image: IMG.headphones,
    images: [IMG.headphones],
    digital: false,
    stock: 18,
    specs: { brand: 'Logitech', condition: 'Neuf', warranty: '2 ans' },
    features: ['Son stéréo haute définition', 'Micro antibruit sur bras flexible', 'Connexion USB — aucun driver', 'Contrôle volume + sourdine intégré', 'Coussinets rembourrés — confort toute la journée', 'Compatible Windows, Mac, Chrome OS'],
    order: 11,
  },
  {
    title: 'Souris Sans Fil Logitech M330 Silent Plus',
    description: 'La Logitech M330 est une souris sans fil silencieuse, idéale pour les open spaces et les réunions. Clic 90% plus silencieux que les souris standard. Récepteur nano USB, autonomie 24 mois. Confortable, ergonomique, disponible en noir.',
    price: 18000,
    category: 'Matériel',
    subcategory: 'Accessoires',
    image: IMG.mouse,
    images: [IMG.mouse],
    digital: false,
    stock: 30,
    specs: { brand: 'Logitech', color: 'Noir', condition: 'Neuf', warranty: '1 an', battery: '1 pile AA — 24 mois' },
    features: ['Silencieuse — 90% moins de bruit', 'Portée sans fil jusqu\'à 10m', 'Récepteur nano USB inclus', 'Autonomie 24 mois avec 1 pile AA', 'Résolution optique 1000 DPI', 'Compatibilité universelle Windows/Mac/Linux'],
    order: 12,
  },
  {
    title: 'Clavier Mécanique Filaire Redragon K552 RGB',
    description: 'Clavier mécanique Redragon K552 avec rétroéclairage RGB multicolore. Switches rouges linéaires pour une frappe rapide et précise. Format compact TKL (sans pavé numérique) pour gagner de l\'espace. Parfait pour développeurs, comptables et professionnels.',
    price: 35000,
    category: 'Matériel',
    subcategory: 'Accessoires',
    image: IMG.keyboard,
    images: [IMG.keyboard],
    badge: 'Populaire',
    digital: false,
    stock: 15,
    specs: { brand: 'Redragon', color: 'Noir/RGB', condition: 'Neuf', warranty: '1 an' },
    features: ['Switches mécaniques rouges (linéaires)', 'Rétroéclairage RGB 12 modes', 'Format compact TKL — gain d\'espace', 'Touches anti-ghosting 100%', 'Corps métal et ABS haute qualité', 'Connexion USB filaire fiable'],
    order: 13,
  },
  {
    title: 'Onduleur APC Back-UPS 650VA — Protection coupures',
    description: 'L\'onduleur APC Back-UPS 650VA protège vos équipements informatiques contre les coupures de courant, les surtensions et les variations de tension fréquentes en Côte d\'Ivoire. Indispensable pour les commerces, bureaux et serveurs. Fournit jusqu\'à 10 minutes de secours.',
    price: 88000,
    category: 'Matériel',
    subcategory: 'Accessoires',
    image: IMG.ups,
    images: [IMG.ups],
    badge: 'Indispensable CI',
    digital: false,
    stock: 10,
    specs: { brand: 'APC', condition: 'Neuf', warranty: '2 ans' },
    features: ['650VA / 400W de puissance', '8 prises protégées', 'Autonomie ~10 min à charge nominale', 'Protection surtension + filtre ligne', 'Affichage LED état batterie', 'Alarme sonore coupure courant', 'Batterie remplaçable par l\'utilisateur'],
    order: 14,
  },
  {
    title: 'Câble HDMI 1.8m Haute Vitesse 4K — Plaqué Or',
    description: 'Câble HDMI haute vitesse compatible 4K, 3D, ARC. Connecteurs plaqués or pour une connexion durable sans oxydation. Idéal pour connecter votre laptop à un écran, projecteur ou TV pour vos présentations clients. Longueur 1.8m.',
    price: 5500,
    category: 'Matériel',
    subcategory: 'Accessoires',
    image: IMG.cable,
    images: [IMG.cable],
    digital: false,
    stock: 60,
    specs: { condition: 'Neuf', warranty: '6 mois' },
    features: ['Compatible 4K Ultra HD, 3D, ARC', 'Connecteurs plaqués or anti-oxydation', 'Blindage double couche anti-interférence', 'Longueur 1.8m — flexible', 'Compatible tous écrans HDMI, TV, projecteurs', 'Taux de rafraîchissement jusqu\'à 144Hz'],
    order: 15,
  },

  // ── MATÉRIEL / Imprimante ──
  {
    title: 'Imprimante Thermique de Caisse 80mm — USB + WiFi',
    description: 'Imprimante thermique professionnelle pour points de vente, restaurants et commerces. Impression rapide (200mm/s), silencieuse, sans cartouche d\'encre. Connexion USB et WiFi intégrée. Compatible avec tous les logiciels de caisse du marché ivoirien.',
    price: 68000,
    category: 'Matériel',
    subcategory: 'Imprimante',
    image: IMG.printer,
    images: [IMG.printer],
    badge: 'Commerce & Resto',
    digital: false,
    stock: 12,
    specs: { brand: 'Epson compatible', condition: 'Neuf', warranty: '1 an' },
    features: ['Impression thermique — sans encre ni toner', 'Vitesse 200mm/s (ultra-rapide)', 'Largeur papier 80mm (rouleaux standards)', 'Connexion USB + WiFi + Bluetooth', 'Compatible Android, iOS, Windows', 'Auto-découpe du ticket intégrée', 'Idéale boutique, restaurant, pharmacie'],
    order: 16,
  },

  // ── LOGICIEL / Microsoft Office ──
  {
    title: 'Microsoft Office 2021 Famille & Petite Entreprise — Licence perpétuelle',
    description: 'La suite bureautique professionnelle Microsoft Office 2021 avec Word, Excel, PowerPoint, Outlook et Teams. Licence perpétuelle pour 1 PC, sans abonnement. Idéale pour les PME, professions libérales et auto-entrepreneurs de Côte d\'Ivoire.',
    price: 89000,
    category: 'Logiciel',
    subcategory: 'Microsoft Office',
    image: IMG.office,
    images: [IMG.office],
    badge: 'Licence à vie',
    digital: true,
    stock: -1,
    specs: { brand: 'Microsoft', condition: 'Neuf', warranty: 'Permanent' },
    features: ['Word, Excel, PowerPoint, Outlook, Teams', 'Licence perpétuelle — 1 seul paiement', 'Compatible Windows 10/11', 'Mises à jour de sécurité incluses', 'Clé d\'activation envoyée par email', 'Support téléphonique SORA TECH inclus'],
    order: 17,
  },

  // ── LOGICIEL / Gestion d'entreprise ──
  {
    title: 'Logiciel de Caisse POS SORATECH — Boutique & Restaurant',
    description: 'Notre logiciel de caisse développé spécialement pour le marché ivoirien. Gestion des ventes, stocks, clients et rapports quotidiens. Interface en français, fonctionne hors ligne. Idéal pour boutiques, restaurants, pharmacies, supérettes. Formation + installation incluses.',
    price: 185000,
    category: 'Logiciel',
    subcategory: "Gestion alimentation / magasin",
    image: IMG.pos,
    images: [IMG.pos],
    badge: 'Made in CI',
    digital: true,
    stock: -1,
    specs: { brand: 'SORA TECH', condition: 'Neuf', warranty: '1 an + mises à jour' },
    features: ['Interface tactile adaptée aux caissiers', 'Gestion multi-caisses et multi-points de vente', 'Impression tickets (thermique + PDF)', 'Rapports de vente journaliers, hebdo, mensuels', 'Gestion stocks avec alertes rupture', 'Fidélisation clients intégrée', 'Fonctionne SANS internet (hors ligne)', 'Formation + installation sur site incluses'],
    order: 18,
  },
  {
    title: 'Logiciel Gestion de Stock PME — Multi-entrepôts',
    description: 'Gérez vos stocks en temps réel avec notre solution développée pour les PME de Côte d\'Ivoire. Suivi des entrées/sorties, alertes de rupture, gestion des fournisseurs et génération de bons de commande automatiques. Compatible code-barres.',
    price: 145000,
    category: 'Logiciel',
    subcategory: "Gestion alimentation / magasin",
    image: IMG.stock,
    images: [IMG.stock],
    digital: true,
    stock: -1,
    specs: { brand: 'SORA TECH', condition: 'Neuf', warranty: '1 an' },
    features: ['Gestion illimitée de références produits', 'Multi-entrepôts et multi-sites', 'Alertes automatiques rupture de stock', 'Scan code-barres (USB ou Bluetooth)', 'Génération auto des bons de commande', 'Historique complet des mouvements', 'Export Excel et rapports PDF'],
    order: 19,
  },

  // ── LOGICIEL / Comptabilité ──
  {
    title: 'Logiciel Comptabilité PME SORA — Plan SYSCOHADA',
    description: 'Logiciel de comptabilité conforme au plan SYSCOHADA révisé, adapté aux entreprises de Côte d\'Ivoire. Gestion des journaux, grand livre, balance, bilan et compte de résultat. Déclarations fiscales simplifiées. Formation incluse.',
    price: 195000,
    category: 'Logiciel',
    subcategory: 'Comptabilité',
    image: IMG.accounting,
    images: [IMG.accounting],
    badge: 'SYSCOHADA',
    digital: true,
    stock: -1,
    specs: { brand: 'SORA TECH', condition: 'Neuf', warranty: '1 an' },
    features: ['Conforme SYSCOHADA révisé 2017', 'Saisie des écritures comptables simplifiée', 'Grand livre, balance et états financiers auto', 'Gestion des immobilisations', 'Export rapports pour expert-comptable', 'Sauvegarde automatique sécurisée', 'Formation de 2 jours incluse'],
    order: 20,
  },

  // ── LOGICIEL / ERP / CRM ──
  {
    title: 'Pack ERP Odoo PME — Licence 1 An + Formation',
    description: 'Gérez toute votre entreprise avec un seul logiciel. Odoo ERP inclut : ventes, achats, comptabilité, stocks, ressources humaines, CRM et e-commerce. Solution cloud accessible partout. Nous assurons l\'installation, la configuration et la formation de votre équipe.',
    price: 295000,
    category: 'Logiciel',
    subcategory: 'ERP / CRM',
    image: IMG.erp,
    images: [IMG.erp],
    badge: 'Tout-en-un',
    digital: true,
    stock: -1,
    specs: { brand: 'Odoo', condition: 'Neuf', warranty: '1 an + support' },
    features: ['Modules Ventes + Achats + Stock inclus', 'Comptabilité SYSCOHADA intégrée', 'CRM — Gestion des prospects et clients', 'RH — Paie, congés, pointage', 'E-commerce + Boutique en ligne', 'Accessible sur PC, tablette et smartphone', 'Installation + Configuration + Formation 3 jours', 'Support technique 1 an inclus'],
    order: 21,
  },

  // ── LOGICIEL / Cybersécurité ──
  {
    title: 'Antivirus Kaspersky Total Security — 1 An / 3 Postes',
    description: 'Protection complète Kaspersky pour 3 PC pendant 1 an. Antivirus, anti-ransomware, VPN, gestionnaire de mots de passe, contrôle parental et protection bancaire. Leader mondial de la cybersécurité. Clé d\'activation envoyée par email immédiatement.',
    price: 32000,
    category: 'Logiciel',
    subcategory: 'Cybersécurité',
    image: IMG.antivirus,
    images: [IMG.antivirus],
    badge: 'Leader mondial',
    digital: true,
    stock: -1,
    specs: { brand: 'Kaspersky', condition: 'Neuf', warranty: '1 an' },
    features: ['Protection antivirus en temps réel', 'Anti-ransomware et anti-phishing', 'VPN sécurisé (200Mo/jour)', 'Gestionnaire de mots de passe', 'Protection bancaire et achats en ligne', 'Contrôle parental avancé', '3 licences (PC/Mac/Android/iOS)', 'Activation par email — immédiat'],
    order: 22,
  },
  {
    title: 'Antivirus ESET NOD32 Business — 1 An / 5 Postes',
    description: 'ESET NOD32 Business Edition est la solution de sécurité privilégiée par les PME pour sa légèreté et ses performances. Protection antivirus, anti-spyware, anti-ransomware. Console d\'administration centralisée. Idéal pour 5 postes de travail en entreprise.',
    price: 45000,
    category: 'Logiciel',
    subcategory: 'Cybersécurité',
    image: IMG.security2,
    images: [IMG.security2],
    digital: true,
    stock: -1,
    specs: { brand: 'ESET', condition: 'Neuf', warranty: '1 an' },
    features: ['5 licences pour PME', 'Ultra-léger — n\'impacte pas les performances', 'Console d\'administration centralisée', 'Protection anti-ransomware avancée', 'Mises à jour automatiques de signatures', 'Support technique ESET inclus', 'Compatible Windows 7 à 11'],
    order: 23,
  },

  // ── LOGICIEL / Sur mesure ──
  {
    title: 'Site Web Professionnel — Création + Hébergement 1 An',
    description: 'Lancez votre présence en ligne avec un site web professionnel créé par nos développeurs. Design moderne adapté à votre secteur, responsive mobile, formulaire de contact, galerie photos. Hébergement sur serveur sécurisé, nom de domaine .ci ou .com inclus pour 1 an.',
    price: 155000,
    category: 'Logiciel',
    subcategory: 'Sur mesure',
    image: IMG.webdesign,
    images: [IMG.webdesign],
    badge: 'Clé en main',
    digital: true,
    stock: -1,
    specs: { brand: 'SORA TECH', condition: 'Neuf', warranty: '1 an hébergement inclus' },
    features: ['Design sur mesure adapté à votre activité', 'Site responsive (mobile, tablette, PC)', 'Nom de domaine .ci ou .com inclus 1 an', 'Hébergement sécurisé SSL/HTTPS 1 an', 'Formulaire de contact + WhatsApp intégré', 'Optimisé SEO pour Google', '5 pages minimum (Accueil, Services, About, Contact, Blog)', 'Livraison en 72h'],
    order: 24,
  },
  {
    title: 'Pack Identité Visuelle — Logo + Charte Graphique Complète',
    description: 'Donnez une image professionnelle à votre entreprise avec notre pack identité visuelle. Logo unique créé par nos graphistes, déclinaison sur tous les supports : carte de visite, en-tête email, réseaux sociaux, kakémono. Fichiers fournis en HD (PNG, PDF, SVG, AI).',
    price: 95000,
    category: 'Logiciel',
    subcategory: 'Sur mesure',
    image: IMG.webdesign,
    images: [IMG.webdesign],
    digital: true,
    stock: -1,
    specs: { brand: 'SORA TECH Design', condition: 'Neuf', warranty: 'Fichiers définitifs livrés' },
    features: ['Logo professionnel (3 propositions)', 'Charte graphique complète (couleurs, typos)', 'Carte de visite recto/verso', 'Couverture Facebook + LinkedIn', 'En-tête email professionnel', 'Template PowerPoint aux couleurs de votre marque', 'Livraison en 48-72h', 'Fichiers HD : PNG, PDF, SVG, AI, EPS'],
    order: 25,
  },
];

// ─── 6 Articles de Blog ────────────────────────────────────────────────────
const ARTICLES = [
  {
    title: 'Comment choisir son ordinateur professionnel en Côte d\'Ivoire',
    category: 'Business',
    image: IMG.artLaptop,
    author: 'Sissoko Abdoulaye',
    published: true,
    featured: true,
    content: `Choisir un ordinateur professionnel en Côte d'Ivoire est une décision importante qui peut impacter votre productivité et votre budget pendant plusieurs années. Voici notre guide complet pour faire le bon choix.

## Ordinateur portable ou PC bureau ?

La première question à vous poser est : avez-vous besoin de mobilité ? Si vous travaillez principalement depuis un bureau fixe, un PC de bureau comme le Dell OptiPlex vous offrira plus de puissance pour le même budget. En revanche, si vous êtes souvent en déplacement à Abidjan ou dans l'intérieur du pays, un laptop est indispensable.

## Quels critères techniques regarder ?

**Le processeur** est le cerveau de votre ordinateur. Pour la bureautique courante (Excel, Word, navigation web), un Intel Core i3 ou i5 de dernière génération est largement suffisant. Pour le graphisme, la comptabilité lourde ou les logiciels ERP, optez pour un Core i5 ou i7.

**La RAM** conditionne la fluidité du multitâche. Minimum 8 Go en 2025. Si vous utilisez simultanément un logiciel de comptabilité, votre navigateur avec plusieurs onglets et Microsoft Office, prévoyez 16 Go.

**Le stockage SSD** est désormais indispensable. Un SSD rend votre ordinateur 5 à 10 fois plus rapide qu'un disque dur classique. Démarrage en 15 secondes, ouverture des fichiers immédiate.

## Le problème de la chaleur et de l'électricité en Côte d'Ivoire

En zone tropicale, la chaleur est un ennemi des composants électroniques. Privilégiez les marques reconnues (HP, Dell, Lenovo) qui intègrent de meilleurs systèmes de refroidissement. Et n'oubliez pas l'onduleur : les coupures de courant fréquentes à Abidjan peuvent endommager vos équipements ou corrompre vos données.

## Notre recommandation

Pour un professionnel avec un budget raisonnable, le **Lenovo IdeaPad Core i3 8Go/256Go SSD** à 295 000 FCFA est le meilleur rapport qualité-prix du marché. Pour plus de puissance, le **HP 15s Core i5 8Go/512Go SSD** à 395 000 FCFA s'impose.

Chez SORA TECH, chaque ordinateur vendu est testé et configuré avant livraison, avec une garantie de 1 à 3 ans selon le modèle.`,
  },
  {
    title: 'Cybersécurité : les 5 menaces qui visent les entreprises ivoiriennes en 2025',
    category: 'Cybersécurité',
    image: IMG.artCyber,
    author: 'Sissoko Abdoulaye',
    published: true,
    featured: true,
    content: `Les cyberattaques contre les PME africaines ont augmenté de 160% en 2024. En Côte d'Ivoire, de nombreuses entreprises pensent encore qu'elles ne sont pas des cibles. C'est une erreur dangereuse.

## 1. Le Ransomware : la menace numéro 1

Le ransomware chiffre tous vos fichiers et exige une rançon (souvent en Bitcoin) pour les récupérer. En 2024, plusieurs PME à Abidjan ont perdu des années de données comptables et clients après avoir refusé ou payé la rançon. Le coût moyen d'une attaque ransomware pour une PME : 2 à 5 millions FCFA de pertes directes.

**Comment se protéger ?** Un antivirus professionnel (Kaspersky ou ESET) avec protection anti-ransomware est la première ligne de défense. La sauvegarde quotidienne sur disque externe déconnecté est la seconde.

## 2. Le Phishing par email et WhatsApp

Des cybercriminels se font passer pour votre banque, votre opérateur télécom ou même l'administration fiscale ivoirienne (DGI). Ils vous demandent de cliquer sur un lien et saisir vos identifiants. En 2024, plusieurs commerçants d'Abidjan ont perdu leur accès Mobile Money suite à ces arnaques.

## 3. Le vol de données clients

Si vous gérez des données de clients (noms, téléphones, adresses), vous avez une obligation légale de les protéger. Un logiciel de gestion non sécurisé peut exposer ces données à vos concurrents ou à des revendeurs de données.

## 4. Les faux techniciens informatiques

Un "technicien" se présente chez vous, propose de réparer votre ordinateur et y installe un logiciel espion. Il peut ensuite accéder à distance à vos fichiers, vos emails et vos mots de passe bancaires.

## 5. Les réseaux WiFi non sécurisés

Votre réseau WiFi professionnel est-il protégé par un mot de passe robuste ? Un WiFi ouvert ou avec le mot de passe par défaut (souvent "admin123") permet à n'importe qui dans votre voisinage d'intercepter vos communications.

## Notre recommandation

La cybersécurité n'est pas un luxe, c'est une nécessité. Pour 32 000 FCFA par an, l'antivirus Kaspersky protège 3 postes contre toutes ces menaces. Pour les entreprises, notre équipe réalise des audits de sécurité complets.`,
  },
  {
    title: 'Pourquoi digitaliser votre PME ivoirienne dès maintenant',
    category: 'Digitalisation',
    image: IMG.artDigital,
    author: 'Sissoko Abdoulaye',
    published: true,
    featured: false,
    content: `La digitalisation n'est plus une option en Côte d'Ivoire. Avec l'essor du mobile money, du commerce électronique et des paiements numériques, les entreprises qui résistent à la transformation numérique perdent des clients au profit de leurs concurrents plus modernes.

## Qu'est-ce que la digitalisation concrètement ?

Pour une PME ivoirienne, digitaliser c'est :
- Remplacer le livre de caisse papier par un logiciel de caisse
- Avoir un site web pour être trouvé sur Google
- Gérer ses stocks via un logiciel plutôt que des cahiers
- Envoyer des factures par email plutôt qu'à la main
- Accepter les paiements Orange Money et MTN Money

## Les gains concrets mesurés

Les PME qui ont digitalisé leur gestion avec un logiciel de caisse constatent en moyenne :
- **30% de réduction** des erreurs de caisse
- **50% de temps gagné** sur les inventaires
- **25% d'augmentation** du chiffre d'affaires grâce à une meilleure gestion des stocks
- **Zéro perte** de données (vs les cahiers perdus, mouillés ou volés)

## Par où commencer ?

**Étape 1 : Le logiciel de caisse.** C'est l'investissement le plus rentable et le plus rapide à prendre en main. Notre logiciel POS SORATECH est formé en 2 heures et opérationnel dès le lendemain.

**Étape 2 : Le site web.** Avoir une présence en ligne permet d'être trouvé par de nouveaux clients. 78% des consommateurs ivoiriens recherchent une entreprise sur Google avant de s'y rendre.

**Étape 3 : L'ERP.** Quand votre activité grandit, l'ERP unifie toute votre gestion (ventes, achats, stocks, RH, comptabilité) dans un seul outil.

## Le coût de la non-digitalisation

Chaque mois sans logiciel de gestion, c'est :
- Des erreurs de stock non détectées
- Des vols non identifiés
- Des décisions prises "à l'aveugle"
- Des opportunités manquées

SORA TECH vous accompagne dans votre transformation numérique, étape par étape, avec des solutions adaptées au marché ivoirien.`,
  },
  {
    title: 'Top 5 logiciels de gestion pour PME en Afrique de l\'Ouest en 2025',
    category: 'Business',
    image: IMG.artSoftware,
    author: 'Sissoko Abdoulaye',
    published: true,
    featured: false,
    content: `Choisir le bon logiciel de gestion pour votre PME en Afrique de l'Ouest est crucial. Nous avons testé et déployé des dizaines de solutions pour nos clients ivoiriens. Voici notre sélection des 5 meilleures.

## 1. Odoo ERP — Le plus complet

Odoo est sans conteste la meilleure solution ERP pour les PME africaines. Open source, modulaire et disponible en cloud, il couvre tout : ventes, achats, stocks, comptabilité, RH, CRM. Sa flexibilité permet de l'adapter à n'importe quel secteur d'activité en Côte d'Ivoire, du négoce à l'industrie.

**Prix** : À partir de 295 000 FCFA/an avec installation et formation chez SORA TECH.
**Idéal pour** : PME de 5 à 200 employés.

## 2. SORATECH POS — Le meilleur pour le commerce ivoirien

Notre logiciel de caisse développé localement intègre les spécificités du marché ivoirien : paiement Mobile Money, TVA ivoirienne, format de tickets adapté. Fonctionne sans internet et synchronise automatiquement quand la connexion revient.

**Prix** : 185 000 FCFA (licence unique).
**Idéal pour** : Boutiques, restaurants, pharmacies, supérettes.

## 3. Microsoft Excel + Office — Le plus accessible

Souvent sous-estimé, Excel reste l'outil de gestion le plus utilisé par les PME africaines. Avec les bons modèles (factures, suivi de stock, tableau de bord), il peut suffire à une petite structure. La licence Office 2021 est un investissement unique.

**Prix** : 89 000 FCFA (licence perpétuelle).
**Idéal pour** : Micro-entreprises et débutants.

## 4. SORATECH Comptabilité — Conforme SYSCOHADA

Notre logiciel comptable respecte le plan comptable SYSCOHADA révisé, obligatoire en Côte d'Ivoire. Idéal pour les experts-comptables et les directeurs financiers qui veulent autonomiser leur comptabilité.

**Prix** : 195 000 FCFA.
**Idéal pour** : PME avec département comptabilité.

## 5. SORATECH Gestion de Stock — Le plus spécialisé

Pour les entreprises dont le coeur de métier est la gestion d'entrepôt (import-export, distribution, négoce), notre logiciel de stock avec scan code-barres est la solution la plus adaptée.

**Prix** : 145 000 FCFA.
**Idéal pour** : Importateurs, grossistes, distributeurs.

## Comment choisir ?

Commencez par identifier votre problème principal : est-ce la caisse ? Les stocks ? La comptabilité ? Choisissez d'abord la solution qui résout ce problème, puis étendez progressivement.`,
  },
  {
    title: 'ERP Odoo pour PME africaine : retour d\'expérience après 6 mois',
    category: 'ERP',
    image: IMG.artERP,
    author: 'Sissoko Abdoulaye',
    published: true,
    featured: false,
    content: `Nous avons accompagné plus de 20 PME ivoiriennes dans l'implémentation d'Odoo ERP au cours des 18 derniers mois. Voici un retour d'expérience honnête après 6 mois de déploiement chez l'une d'entre elles : une société de distribution alimentaire à Yopougon.

## Le contexte

Cette PME employait 12 personnes, gérait 3 points de vente à Abidjan et traitait environ 150 commandes par jour. Avant Odoo, ils utilisaient Excel pour les stocks, un carnet pour les commandes clients et un comptable externe pour la comptabilité. La croissance était freinée par le manque de visibilité sur leur activité réelle.

## Les difficultés initiales (mois 1-2)

L'implémentation d'un ERP n'est pas un parcours sans embûches. Les premiers défis :
- **La résistance au changement** des employés habitués à leurs méthodes
- **La saisie initiale des données** (catalogue produits, fournisseurs, stocks de départ)
- **Les bugs de jeunesse** liés à la configuration locale (TVA ivoirienne, formats)

Notre équipe SORA TECH a passé 3 jours sur site pour la formation initiale et assuré un support quotidien par WhatsApp le premier mois.

## Les résultats après 6 mois

Les chiffres parlent d'eux-mêmes :
- **Inventaire** : de 2 jours par mois à 2 heures (scan code-barres)
- **Erreurs de facturation** : -95% (factures générées automatiquement)
- **Visibilité stocks** : en temps réel sur les 3 sites depuis un seul écran
- **Relances clients** : automatisées (emails + SMS)
- **Délai de clôture comptable** : de 15 jours à 2 jours

Le directeur général nous a confié : "Je sais maintenant en temps réel combien je gagne, quel produit se vend le mieux et quel client me doit de l'argent."

## Notre recommandation

Pour une PME entre 5 et 50 employés en Côte d'Ivoire, Odoo ERP est le meilleur investissement que vous pouvez faire. Comptez un budget de déploiement entre 300 000 et 600 000 FCFA selon la complexité, avec un ROI généralement atteint en 6 à 12 mois.

Contactez-nous pour un diagnostic gratuit de votre situation.`,
  },
  {
    title: 'Créer un site web professionnel pour votre business en 2025 : ce qu\'il faut savoir',
    category: 'Web',
    image: IMG.artWeb,
    author: 'Sissoko Abdoulaye',
    published: true,
    featured: true,
    content: `En 2025, ne pas avoir de site web professionnel en Côte d'Ivoire, c'est comme ne pas avoir de numéro de téléphone. Pourtant, de nombreuses PME ivoiriennes se contentent encore d'une page Facebook ou d'un numéro WhatsApp. Voici pourquoi et comment créer un site qui attire vraiment des clients.

## Pourquoi un site web et pas juste Facebook ?

Facebook et WhatsApp sont des outils de communication formidables, mais ils ont leurs limites :
- Vous ne **contrôlez pas** vos données ni votre audience
- Un changement d'algorithme peut faire chuter votre visibilité du jour au lendemain
- Vous n'apparaissez **pas sur Google** quand un client recherche vos services
- Vous n'avez **pas d'image professionnelle** face aux grandes entreprises

Un site web vous appartient à 100%. C'est votre vitrine sur internet, accessible 24h/24, 7j/7.

## Les éléments indispensables d'un bon site web

**L'hébergement sécurisé (HTTPS)** : votre site doit obligatoirement avoir un certificat SSL (cadenas vert dans le navigateur). Sans SSL, Google pénalise votre référencement et les visiteurs fuient.

**La compatibilité mobile** : 87% des Ivoiriens naviguent sur internet depuis leur smartphone. Votre site doit être parfaitement lisible sur téléphone.

**La vitesse de chargement** : avec les connexions parfois instables en Côte d'Ivoire, votre site doit se charger en moins de 3 secondes. Des images mal optimisées peuvent faire fuir 40% de vos visiteurs.

**Le référencement Google (SEO)** : apparaître en première page de Google pour vos mots-clés cibles multiplie votre trafic par 10.

## Combien coûte un site web professionnel ?

Les prix varient énormément selon la qualité :
- **Site vitrine basique** : 80 000 à 200 000 FCFA
- **Site avec boutique en ligne** : 250 000 à 600 000 FCFA
- **Application web sur mesure** : à partir de 500 000 FCFA

Notre offre SORA TECH à 155 000 FCFA inclut : design moderne, 5 pages, hébergement 1 an, nom de domaine et certificat SSL. Livraison en 72 heures.

## Les erreurs à éviter

- Choisir le prestataire le moins cher sans vérifier ses références
- Ne pas penser au contenu (textes, photos) avant de commander
- Ne pas mettre à jour son site régulièrement
- Ignorer Google Analytics pour mesurer vos visiteurs

Un bon site web est votre meilleur commercial, disponible 24h/24 sans salaire à payer.`,
  },
];

// ─── Fonction principale ────────────────────────────────────────────────────
async function seedCatalog() {
  await connectDB();

  // ── Produits ──
  const existingCount = await Produit.countDocuments();
  if (existingCount > 0) {
    console.log(`ℹ️  ${existingCount} produits déjà en base. Suppression et réinsertion...`);
    await Produit.deleteMany({});
  }

  const produits = await Produit.insertMany(PRODUITS);
  console.log(`✅ ${produits.length} produits insérés.`);

  // ── Articles ──
  for (const art of ARTICLES) {
    const existing = await Article.findOne({ title: art.title });
    if (existing) {
      console.log(`⏭  Article déjà existant : "${art.title}"`);
      continue;
    }
    const a = new Article(art);
    await a.save();
    console.log(`✅ Article créé : "${art.title}"`);
  }

  console.log('\n🎉 Seed catalogue terminé !');
  process.exit(0);
}

// Auto-seed : appelé au démarrage du serveur
// Remplace le catalogue si aucun produit n'a d'image (vieux catalog sans photos)
async function autoSeedIfEmpty() {
  try {
    const count = await Produit.countDocuments();
    if (count > 0) {
      const withImage = await Produit.countDocuments({ image: { $nin: ['', null] } });
      if (withImage > 0) {
        console.log(`[Seed] ${count} produits avec photos — skip produits.`);
      } else {
        console.log(`[Seed] Produits sans photos détectés — remplacement du catalogue...`);
        await Produit.deleteMany({});
        const produits = await Produit.insertMany(PRODUITS);
        console.log(`[Seed] ${produits.length} produits remplacés avec photos.`);
      }
    } else {
      console.log('[Seed] Aucun produit — insertion du catalogue initial...');
      const produits = await Produit.insertMany(PRODUITS);
      console.log(`[Seed] ${produits.length} produits insérés.`);
    }

    // Toujours insérer les articles manquants (opération idempotente)
    let artCount = 0;
    for (const art of ARTICLES) {
      const existing = await Article.findOne({ title: art.title });
      if (!existing) { const a = new Article(art); await a.save(); artCount++; }
    }
    if (artCount > 0) console.log(`[Seed] ${artCount} articles insérés.`);
    console.log('[Seed] Catalogue OK.');
  } catch (err) {
    console.error('[Seed] Erreur auto-seed :', err.message);
  }
}

// Export pour usage via index.js et API endpoint
module.exports = { PRODUITS, ARTICLES, autoSeedIfEmpty };

// Exécution directe uniquement si appelé comme script principal
if (require.main === module) {
  seedCatalog().catch((err) => {
    console.error('Erreur seed :', err.message);
    process.exit(1);
  });
}
