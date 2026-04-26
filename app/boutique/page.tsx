"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  ShoppingCart, Trash2, X, Download, Truck, Headphones, RotateCcw,
  CheckCircle, type LucideIcon
} from "lucide-react";
import Footer from "../components/Footer";
import { resolveMediaUrl } from "@/lib/media";
import {
  PRODUCT_CATEGORIES,
  getProductDisplayMeta,
  getSubcategoriesForCategory,
  normalizeProductTaxonomy,
} from "@/lib/productTaxonomy";

function ScanLine() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div animate={{ y: ["-5%", "105%"] }} transition={{ duration: 8, repeat: Infinity, ease: "linear", repeatDelay: 4 }} className="absolute left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, rgba(0,153,255,0.5), rgba(0,198,255,0.8), rgba(0,153,255,0.5), transparent)" }} />
    </div>
  );
}

type Product = {
  id: string | number; category: string; subcategory: string; title: string; description: string;
  price: number; icon: LucideIcon; color: string; badge?: string;
  features: string[]; digital?: boolean; image?: string;
};

type ApiProduct = {
  _id: string;
  category: string;
  subcategory?: string;
  title: string;
  description: string;
  price: number;
  badge?: string;
  features?: string[];
  digital?: boolean;
  image?: string;
  active?: boolean;
};

function buildProduct(product: Omit<Product, "icon" | "color">): Product {
  const normalized = normalizeProductTaxonomy(product);
  const meta = getProductDisplayMeta(normalized.category, normalized.subcategory);

  return {
    ...normalized,
    icon: meta.icon,
    color: meta.color,
  };
}

const STATIC_PRODUCTS: Product[] = [
  buildProduct({ id: 1, category: "Logiciel", subcategory: "Gestion alimentation / magasin", title: "Logiciel de caisse alimentation", description: "Gestion complète de votre alimentation : ventes, stock, historique client et rapports journaliers.", price: 150000, badge: "BESTSELLER", features: ["Gestion stocks temps réel","Impression tickets","Rapports auto","Multi-caisses"], digital: true }),
  buildProduct({ id: 2, category: "Logiciel", subcategory: "Microsoft Office", title: "Pack Microsoft Office pro", description: "Suite bureautique complète pour vos équipes : Word, Excel, PowerPoint et Outlook.", price: 65000, features: ["Installation assistée","Activation propre","Support de prise en main","Compatible Windows"], digital: true }),
  buildProduct({ id: 3, category: "Logiciel", subcategory: "Odoo", title: "Déploiement Odoo PME", description: "Configuration Odoo pour ventes, stocks, facturation et suivi opérationnel.", price: 250000, badge: "POPULAIRE", features: ["Modules ventes + stock","Formation initiale","Paramétrage entreprise","Support lancement"], digital: true }),
  buildProduct({ id: 4, category: "Logiciel", subcategory: "Gestion d'entreprise", title: "Logiciel de gestion d'entreprise", description: "Centralisez clients, factures, encaissements et tableaux de bord dans une seule solution.", price: 220000, features: ["Facturation","Suivi clients","Dashboard complet","Historique opérations"], digital: true }),
  buildProduct({ id: 5, category: "Matériel", subcategory: "Téléphone", title: "Smartphone professionnel Android", description: "Téléphone fiable pour commerciaux, livreurs et équipes terrain.", price: 95000, badge: "NOUVEAU", features: ["Double SIM","Bonne autonomie","WhatsApp Business","Prêt à l'emploi"], digital: false }),
  buildProduct({ id: 6, category: "Matériel", subcategory: "Ordinateur", title: "Ordinateur portable bureautique", description: "PC portable pour gestion, bureautique, caisse et suivi d'activité.", price: 275000, features: ["SSD rapide","Windows installé","Suite bureautique prête","Garantie incluse"], digital: false }),
  buildProduct({ id: 7, category: "Matériel", subcategory: "Serveur", title: "Serveur PME local", description: "Serveur pour centraliser vos fichiers, sauvegardes et applications d'entreprise.", price: 650000, features: ["Stockage sécurisé","Sauvegarde locale","Accès équipe","Installation réseau"], digital: false }),
  buildProduct({ id: 8, category: "Logiciel", subcategory: "Cybersécurité", title: "Pack cybersécurité entreprise", description: "Protection de vos postes, sensibilisation équipe et audit de base.", price: 180000, features: ["Audit sécurité","Antivirus entreprise","Plan d'action","Suivi mensuel"], digital: true }),
];

export default function BoutiquePage() {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [activeSubcategory, setActiveSubcategory] = useState("Tous");
  const [products, setProducts] = useState<Product[]>(STATIC_PRODUCTS);
  const [cart, setCart] = useState<Product[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Populaire");
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [paymentMode, setPaymentMode] = useState<"online" | "cod" | null>(null);
  const [deliveryInfo, setDeliveryInfo] = useState({ name: "", phone: "", email: "", address: "", quartier: "" });
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');

  const DELIVERY_FEE = 2500;
  const categories = ["Tous", ...PRODUCT_CATEGORIES];
  const subcategories = activeCategory === "Tous" ? [] : getSubcategoriesForCategory(activeCategory);

  useEffect(() => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5000); // 5s timeout
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/produits?limit=100`, { signal: ctrl.signal })
      .then(r => r.json())
      .then(r => {
        clearTimeout(timer);
        if (r.data?.length) {
          setProducts(r.data.filter((p: ApiProduct) => p.active).map((p: ApiProduct) => buildProduct({
            id: p._id,
            category: p.category,
            subcategory: p.subcategory || '',
            title: p.title,
            description: p.description,
            price: p.price,
            badge: p.badge || undefined,
            features: p.features || [],
            digital: typeof p.digital === "boolean" ? p.digital : p.category === "Logiciel",
            image: p.image || undefined,
          })));
        }
      })
      .catch(() => clearTimeout(timer));
    return () => { clearTimeout(timer); ctrl.abort(); };
  }, []);

  const filteredProducts = (activeCategory === "Tous" ? products : products.filter((p) => p.category === activeCategory))
    .filter((p) => activeSubcategory === "Tous" || p.subcategory === activeSubcategory);
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "Prix croissant") return a.price - b.price;
    if (sortBy === "Prix décroissant") return b.price - a.price;
    return 0;
  });

  const addToCart = (product: Product) => { setCart([...cart, product]); setCartOpen(true); };
  const removeFromCart = (id: string | number) => {
    const index = cart.findIndex(item => item.id === id);
    if (index > -1) { const nc = [...cart]; nc.splice(index, 1); setCart(nc); }
  };
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const deliveryFee = paymentMode === "cod" ? DELIVERY_FEE : 0;
  const cartTotal = cartSubtotal + deliveryFee;
  const fmt = (n: number) => n.toLocaleString("fr-FR").replace(/,/g, " ");

  const getLocation = () => {
    if (!navigator.geolocation) { setGeoError('Géolocalisation non supportée.'); return; }
    setGeoLoading(true);
    setGeoError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=fr`,
            { headers: { 'Accept-Language': 'fr' } }
          );
          const data = await r.json();
          const addr = data.address || {};
          const q = addr.suburb || addr.neighbourhood || addr.city_district || addr.city || '';
          const full = data.display_name || '';
          setDeliveryInfo(prev => ({
            ...prev,
            quartier: q || prev.quartier,
            address: full || prev.address,
          }));
        } catch {
          setGeoError('Impossible de déterminer votre adresse.');
        } finally {
          setGeoLoading(false);
        }
      },
      () => { setGeoError('Accès à la position refusé.'); setGeoLoading(false); },
      { timeout: 10000 }
    );
  };

  const resetCheckout = () => {
    setCheckoutStep(0); setPaymentMode(null);
    setDeliveryInfo({ name: "", phone: "", email: "", address: "", quartier: "" });
    setOrderSuccess(false);
  };
  const confirmOrder = async () => {
    if (orderLoading) return;
    setOrderLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/commandes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: deliveryInfo.name || 'Client',
          clientPhone: deliveryInfo.phone || '0000000000',
          clientEmail: deliveryInfo.email || '',
          clientAddress: deliveryInfo.address,
          clientQuartier: deliveryInfo.quartier,
          items: cart.map(p => ({
            productId: typeof p.id === 'string' ? p.id : undefined,
            title: p.title, price: p.price, quantity: 1,
            digital: p.digital || false, image: p.image || '',
          })),
          subtotal: cartSubtotal,
          deliveryFee: deliveryFee,
          total: cartTotal,
          paymentMode: paymentMode || 'online',
        }),
      });
    } catch {}
    setOrderLoading(false);
    setOrderSuccess(true);
    setTimeout(() => { setCart([]); setCartOpen(false); resetCheckout(); }, 4000);
  };

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(#0099FF 1px, transparent 1px), linear-gradient(90deg, #0099FF 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#FF6B00] rounded-full blur-[150px] opacity-15 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#0099FF] rounded-full blur-[150px] opacity-15 animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <Navbar active="boutique" />

      {/* Floating cart button */}
      <motion.button
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={() => setCartOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-[#0066FF] hover:bg-[#0099FF] transition px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2"
        style={{ boxShadow: cart.length > 0 ? "0 0 30px rgba(0,102,255,0.6)" : "0 4px 20px rgba(0,0,0,0.4)" }}
      >
        <ShoppingCart className="w-4 h-4" /> Panier
        {cart.length > 0 && <span className="bg-[#FF6B00] text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-black">{cart.length}</span>}
      </motion.button>

      {/* HERO */}
      <section className="relative py-20 md:py-24 px-6 text-center z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(#1a2540 1px, transparent 1px), linear-gradient(90deg, #1a2540 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <ScanLine />
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-[#0A1A3A] border border-[#FF6B00] text-[#FF6B00] text-xs tracking-[2px] px-4 py-1.5 rounded-full mb-6" style={{ boxShadow: "0 0 20px rgba(255,107,0,0.2)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
            BOUTIQUE DIGITALE
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-4xl md:text-6xl font-black leading-tight mb-6 tracking-tight">
            Nos produits<br />
            <motion.span animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 5, repeat: Infinity }} className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#0099FF] to-[#00C48C]" style={{ backgroundSize: "200% 200%" }}>
              prêts à l&apos;emploi
            </motion.span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-[#8899BB] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Matériel et logiciels professionnels pour équiper, structurer et digitaliser votre entreprise plus vite.
          </motion.p>
        </div>
      </section>

      {/* AVANTAGES */}
      <section className="relative border-y border-[#1a2540] bg-[#080F20]/80 backdrop-blur py-8 px-6 z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[{ icon: Download, label: "Livraison instantanée", color: "#0099FF" },{ icon: ShoppingCart, label: "Mobile Money + Cash", color: "#FF6B00" },{ icon: Truck, label: "Livraison Abidjan 2500F", color: "#00C48C" },{ icon: Headphones, label: "Support 24/7", color: "#9B93FF" }].map((a, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: `${a.color}15`, border: `1px solid ${a.color}30` }}>
                <a.icon className="w-5 h-5" style={{ color: a.color }} />
              </div>
              <div className="text-xs text-[#8899BB] tracking-wide">{a.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FILTRES + TRI */}
      <section className="relative py-10 px-6 z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 flex-wrap justify-center">
            {categories.map((cat) => (
              <motion.button key={cat} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setActiveCategory(cat); setActiveSubcategory("Tous"); }}
                className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-200 ${activeCategory === cat ? "bg-[#0066FF] text-white shadow-[0_0_20px_rgba(0,102,255,0.4)]" : "bg-[#0A1525] border border-[#1a2540] text-[#8899BB] hover:border-[#0066FF] hover:text-white"}`}>
                {cat}
              </motion.button>
            ))}
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-[#0A1525] border border-[#1a2540] rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-[#0066FF] cursor-pointer transition-colors">
            <option>Populaire</option><option>Prix croissant</option><option>Prix décroissant</option>
          </select>
        </div>
        {subcategories.length > 0 && (
          <div className="max-w-6xl mx-auto mt-4 flex gap-2 flex-wrap justify-center">
            {["Tous", ...subcategories].map((subcategory) => (
              <motion.button key={subcategory} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setActiveSubcategory(subcategory)}
                className={`px-4 py-2 rounded-full text-[11px] font-bold tracking-wide transition-all duration-200 ${activeSubcategory === subcategory ? "bg-[#FF6B00] text-white shadow-[0_0_20px_rgba(255,107,0,0.35)]" : "bg-[#101B30] border border-[#1a2540] text-[#93A4C5] hover:border-[#FF6B00] hover:text-white"}`}>
                {subcategory}
              </motion.button>
            ))}
          </div>
        )}
      </section>

      {/* GRILLE PRODUITS */}
      <section className="relative py-8 px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} whileHover={{ y: -8, boxShadow: `0 20px 40px ${product.color}25` }} className="bg-[#0A1525]/80 backdrop-blur border border-[#1a2540] rounded-2xl overflow-hidden transition-all duration-300 group">
                <div className="relative h-52 flex items-center justify-center overflow-hidden" style={{ background: `linear-gradient(135deg, ${product.color}25, ${product.color}05)` }}>
                  {product.image ? (
                    <img src={resolveMediaUrl(product.image)} alt={product.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-20 h-20 rounded-3xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: `${product.color}20`, border: `1px solid ${product.color}40`, boxShadow: `0 0 25px ${product.color}15` }}>
                      <product.icon className="w-10 h-10" style={{ color: product.color }} />
                    </div>
                  )}
                  {product.badge && <div className="absolute top-3 right-3 bg-[#FF6B00] text-white px-2 py-1 rounded text-[9px] font-black tracking-wider">{product.badge}</div>}
                  <div className="absolute top-3 left-3 bg-[#060D1F]/80 backdrop-blur px-2 py-1 rounded text-[10px] tracking-widest font-mono" style={{ color: product.color }}>{product.category}</div>
                  <div className="absolute bottom-3 left-3 bg-[#060D1F]/80 backdrop-blur px-2 py-1 rounded text-[10px] font-medium border border-white/10">{product.subcategory}</div>
                  {product.digital && <div className="absolute bottom-3 right-3 bg-[#00C48C]/20 border border-[#00C48C] text-[#00C48C] px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1"><Download className="w-2.5 h-2.5" /> DIGITAL</div>}
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold mb-2 group-hover:text-[#0099FF] transition-colors duration-200">{product.title}</h3>
                  <p className="text-xs text-[#8899BB] leading-relaxed mb-4">{product.description}</p>
                  <div className="space-y-1 mb-4">
                    {product.features.slice(0, 3).map((f, k) => (
                      <div key={k} className="flex items-center gap-2 text-xs text-[#8899BB]">
                        <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: product.color }} /><span>{f}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[#1a2540]">
                    <div>
                      <div className="text-[10px] text-[#8899BB]">À partir de</div>
                      <div className="text-xl font-black font-mono" style={{ color: product.color }}>{fmt(product.price)} F</div>
                    </div>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => addToCart(product)} className="px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5" style={{ backgroundColor: product.color, color: "#fff" }}>
                      <ShoppingCart className="w-3 h-3" /> Panier
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PANIER + CHECKOUT */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setCartOpen(false); resetCheckout(); }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25 }} className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-[#060D1F] border-l border-[#1a2540] z-[101] flex flex-col" style={{ boxShadow: "-10px 0 50px rgba(0,0,0,0.5)" }}>
              <div className="flex items-center justify-between p-6 border-b border-[#1a2540]">
                <div>
                  {checkoutStep > 0 && !orderSuccess && (<motion.button onClick={() => setCheckoutStep(checkoutStep - 1)} whileHover={{ x: -3 }} whileTap={{ scale: 0.95 }} className="text-xs text-[#0099FF] mb-1 block">← Retour</motion.button>)}
                  <h3 className="text-lg font-black">
                    {orderSuccess ? "✅ Commande confirmée !" : checkoutStep === 0 ? `🛒 Votre panier (${cart.length})` : checkoutStep === 1 ? "💳 Mode de paiement" : checkoutStep === 2 ? "📝 Vos informations" : "✓ Récapitulatif"}
                  </h3>
                </div>
                <motion.button onClick={() => { setCartOpen(false); resetCheckout(); }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-9 h-9 flex items-center justify-center bg-[#0A1525] border border-[#1a2540] rounded-xl hover:border-[#FF4757] transition">
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {orderSuccess && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                    <div className="text-7xl mb-4">🎉</div>
                    <h4 className="text-xl font-black mb-3">Commande validée !</h4>
                    <p className="text-sm text-[#8899BB] mb-4">Confirmation envoyée par email et WhatsApp à <span className="text-[#0099FF] font-bold">{deliveryInfo.phone}</span></p>
                    <div className="bg-[#00C48C]/10 border border-[#00C48C] rounded-xl p-4 text-left mb-3"><div className="text-xs text-[#00C48C] font-bold mb-2">📧 Email envoyé</div><div className="text-xs text-[#8899BB]">📎 Facture PDF · 📎 Reçu de paiement</div></div>
                    <div className="bg-[#25D366]/10 border border-[#25D366] rounded-xl p-4 text-left"><div className="text-xs text-[#25D366] font-bold mb-2">💬 WhatsApp envoyé</div><div className="text-xs text-[#8899BB]">Confirmation avec suivi de commande</div></div>
                  </motion.div>
                )}

                {!orderSuccess && checkoutStep === 0 && (
                  cart.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 mx-auto rounded-3xl bg-[#0A1525] border border-[#1a2540] flex items-center justify-center mb-4"><ShoppingCart className="w-10 h-10 text-[#8899BB]" /></div>
                      <p className="text-[#8899BB]">Votre panier est vide</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map((item, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="bg-[#0A1525] border border-[#1a2540] rounded-xl p-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${item.color}20`, border: `1px solid ${item.color}40` }}>
                            <item.icon className="w-5 h-5" style={{ color: item.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold truncate">{item.title}</div>
                            <div className="text-xs font-bold font-mono" style={{ color: item.color }}>{fmt(item.price)} FCFA</div>
                            {item.digital && <div className="text-[10px] text-[#00C48C] mt-0.5 flex items-center gap-1"><Download className="w-2.5 h-2.5" /> Produit digital</div>}
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-[#FF4757] hover:bg-[#FF4757]/10 w-8 h-8 rounded-lg flex items-center justify-center transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )
                )}

                {!orderSuccess && checkoutStep === 1 && (
                  <div className="space-y-3">
                    <p className="text-xs text-[#8899BB] mb-4">Choisissez votre mode de paiement préféré :</p>
                    <motion.div whileHover={{ scale: 1.02 }} onClick={() => setPaymentMode("online")} className={`border rounded-xl p-5 cursor-pointer transition-all ${paymentMode === "online" ? "border-[#0066FF] bg-[#0066FF]/10" : "border-[#1a2540] bg-[#0A1525]"}`}>
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">💳</div>
                        <div className="flex-1">
                          <div className="font-bold text-sm mb-1 flex items-center gap-2">Paiement en ligne <span className="text-[9px] bg-[#00C48C] text-white px-2 py-0.5 rounded-full font-black">RECOMMANDÉ</span></div>
                          <div className="text-xs text-[#8899BB] mb-2">Wave, Orange Money, MTN Money, carte bancaire</div>
                          <div className="text-xs text-[#00C48C] font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Livraison gratuite + Accès immédiat</div>
                        </div>
                      </div>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} onClick={() => setPaymentMode("cod")} className={`border rounded-xl p-5 cursor-pointer transition-all ${paymentMode === "cod" ? "border-[#FF6B00] bg-[#FF6B00]/10" : "border-[#1a2540] bg-[#0A1525]"}`}>
                      <div className="flex items-start gap-3">
                        <Truck className="w-8 h-8 text-[#FF6B00] mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-bold text-sm mb-1">Paiement à la livraison</div>
                          <div className="text-xs text-[#8899BB] mb-2">Cash ou Mobile Money au livreur</div>
                          <div className="text-xs text-[#FF6B00] font-bold">+ 2 500 FCFA frais de livraison</div>
                          <div className="text-[10px] text-[#8899BB] mt-1">📍 Uniquement à Abidjan · Livraison en 24-48h</div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}

                {!orderSuccess && checkoutStep === 2 && (
                  <div className="space-y-3">
                    {[
                      { label: "Nom complet *", key: "name", type: "text", ph: "Kofi Mensah" },
                      { label: "Téléphone WhatsApp *", key: "phone", type: "tel", ph: "+225 07 00 00 00" },
                      { label: "Email (pour recevoir votre facture)", key: "email", type: "email", ph: "kofi@gmail.com" },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="text-xs text-[#8899BB] tracking-wide uppercase font-bold">{f.label}</label>
                        <input type={f.type} value={deliveryInfo[f.key as keyof typeof deliveryInfo]} onChange={(e) => setDeliveryInfo({...deliveryInfo, [f.key]: e.target.value})} placeholder={f.ph} className="w-full mt-1 bg-[#0A1525] border border-[#1a2540] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0066FF] transition-colors" />
                      </div>
                    ))}
                    {paymentMode === "cod" && (
                      <>
                        {/* Geolocation button */}
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={getLocation} disabled={geoLoading}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition"
                            style={{ background: geoLoading ? '#1a2540' : '#0066FF20', color: geoLoading ? '#64748B' : '#0099FF', border: '1px solid #0066FF40' }}>
                            {geoLoading
                              ? <><span className="w-3 h-3 border border-cyan-400 border-t-transparent rounded-full animate-spin inline-block" /> Localisation...</>
                              : '📍 Utiliser ma position GPS'}
                          </button>
                          {geoError && <span className="text-xs text-red-400">{geoError}</span>}
                        </div>
                        <div>
                          <label className="text-xs text-[#8899BB] tracking-wide uppercase font-bold">Quartier *</label>
                          <select value={deliveryInfo.quartier} onChange={(e) => setDeliveryInfo({...deliveryInfo, quartier: e.target.value})} className="w-full mt-1 bg-[#0A1525] border border-[#1a2540] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0066FF] cursor-pointer">
                            <option value="">Sélectionnez...</option>
                            {["Cocody","Plateau","Marcory","Treichville","Yopougon","Abobo","Adjamé","Riviera","Angré","Port-Bouët","Koumassi","Autre"].map(q => <option key={q}>{q}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-[#8899BB] tracking-wide uppercase font-bold">Adresse précise *</label>
                          <textarea value={deliveryInfo.address} onChange={(e) => setDeliveryInfo({...deliveryInfo, address: e.target.value})} placeholder="Ex: Rue des jardins, près de la pharmacie du coin..." rows={3} className="w-full mt-1 bg-[#0A1525] border border-[#1a2540] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0066FF] resize-none" />
                        </div>
                      </>
                    )}
                  </div>
                )}

                {!orderSuccess && checkoutStep === 3 && (
                  <div className="space-y-4">
                    <div className="bg-[#0A1525] border border-[#1a2540] rounded-xl p-4">
                      <div className="text-xs text-[#8899BB] font-bold mb-3 uppercase tracking-wider font-mono">Articles commandés</div>
                      {cart.map((item, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-[#1a2540] last:border-0">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${item.color}20` }}>
                              <item.icon className="w-4 h-4" style={{ color: item.color }} />
                            </div>
                            <span className="text-xs">{item.title}</span>
                          </div>
                          <span className="text-xs font-bold font-mono" style={{ color: item.color }}>{fmt(item.price)} F</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-[#0A1525] border border-[#1a2540] rounded-xl p-4">
                      <div className="text-xs text-[#8899BB] font-bold mb-2 uppercase tracking-wider font-mono">Paiement</div>
                      <div className="text-sm">{paymentMode === "online" ? "💳 Paiement en ligne" : "🚚 Paiement à la livraison"}</div>
                    </div>
                    <div className="bg-[#0A1525] border border-[#1a2540] rounded-xl p-4">
                      <div className="text-xs text-[#8899BB] font-bold mb-2 uppercase tracking-wider font-mono">Client</div>
                      <div className="text-sm">{deliveryInfo.name}</div>
                      <div className="text-xs text-[#8899BB]">{deliveryInfo.phone}</div>
                      {deliveryInfo.email && <div className="text-xs text-[#8899BB]">✉️ {deliveryInfo.email}</div>}
                      {paymentMode === "cod" && deliveryInfo.address && <div className="text-xs text-[#8899BB] mt-1">📍 {deliveryInfo.quartier} · {deliveryInfo.address}</div>}
                    </div>
                  </div>
                )}
              </div>

              {cart.length > 0 && !orderSuccess && (
                <div className="p-6 border-t border-[#1a2540] bg-[#060D1F]">
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-xs text-[#8899BB]"><span>Sous-total</span><span className="font-mono">{fmt(cartSubtotal)} FCFA</span></div>
                    {deliveryFee > 0 && <div className="flex justify-between text-xs text-[#FF6B00]"><span>🚚 Livraison Abidjan</span><span className="font-mono">+ {fmt(deliveryFee)} FCFA</span></div>}
                    <div className="flex justify-between items-center pt-2 border-t border-[#1a2540]">
                      <span className="text-sm font-bold">Total</span>
                      <span className="text-2xl font-black text-[#0099FF] font-mono">{fmt(cartTotal)} FCFA</span>
                    </div>
                  </div>
                  {checkoutStep === 0 && <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setCheckoutStep(1)} className="w-full bg-[#0066FF] py-3.5 rounded-xl font-bold text-sm">Commander →</motion.button>}
                  {checkoutStep === 1 && <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => paymentMode && setCheckoutStep(2)} disabled={!paymentMode} className={`w-full py-3.5 rounded-xl font-bold text-sm transition ${paymentMode ? "bg-[#0066FF]" : "bg-[#1a2540] text-[#8899BB] cursor-not-allowed"}`}>Continuer →</motion.button>}
                  {checkoutStep === 2 && <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { if (deliveryInfo.name && deliveryInfo.phone && (paymentMode === "online" || (deliveryInfo.quartier && deliveryInfo.address))) setCheckoutStep(3); }} className="w-full bg-[#0066FF] py-3.5 rounded-xl font-bold text-sm">Vérifier la commande →</motion.button>}
                  {checkoutStep === 3 && (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={confirmOrder}
                      disabled={orderLoading}
                      className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${paymentMode === "online" ? "bg-[#0066FF]" : "bg-[#FF6B00]"} ${orderLoading ? "opacity-70 cursor-not-allowed" : ""}`}>
                      {orderLoading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Traitement...</> : paymentMode === "online" ? "💳 Payer maintenant" : "✓ Confirmer la commande"}
                    </motion.button>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* GARANTIE */}
      <section className="relative py-16 px-6 z-10">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4">
          {[{ icon: CheckCircle, title: "Garantie & support", desc: "Assistance incluse sur nos logiciels et équipements sélectionnés", color: "#00C48C" },{ icon: RotateCcw, title: "Satisfait ou remboursé", desc: "14 jours pour changer d'avis selon le produit commandé", color: "#0099FF" },{ icon: Truck, title: "Livraison Abidjan", desc: "24-48h pour les produits physiques · 2500 FCFA", color: "#FF6B00" }].map((g, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-[#0A1525]/80 border border-[#1a2540] rounded-2xl p-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${g.color}15`, border: `1px solid ${g.color}30` }}>
                <g.icon className="w-6 h-6" style={{ color: g.color }} />
              </div>
              <h3 className="text-base font-bold mb-2">{g.title}</h3>
              <p className="text-xs text-[#8899BB] leading-relaxed">{g.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 px-6 text-center z-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-3xl mx-auto bg-gradient-to-br from-[#FF6B00]/20 via-[#0099FF]/10 to-[#00C48C]/10 border border-[#FF6B00]/50 rounded-3xl p-10 md:p-14 backdrop-blur relative overflow-hidden">
          <ScanLine />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-4">Besoin d&apos;une solution personnalisée ?</h2>
            <p className="text-[#8899BB] mb-8">Pas trouvé ce que vous cherchez ? Nous créons des solutions sur mesure</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/devis"><motion.button whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,102,255,0.5)" }} whileTap={{ scale: 0.95 }} className="bg-[#0066FF] px-8 py-3.5 rounded-xl font-bold text-sm">Demander un devis</motion.button></Link>
              <motion.a href="https://wa.me/2250704928068" target="_blank" rel="noopener" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-[#25D366] px-8 py-3.5 rounded-xl font-bold text-sm">💬 WhatsApp direct</motion.a>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
