"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import MobileMenu from "../components/MobileMenu";

type Product = {
  id: number;
  category: string;
  title: string;
  description: string;
  price: number;
  image: string;
  color: string;
  badge?: string;
  features: string[];
  digital?: boolean;
};

export default function BoutiquePage() {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [cart, setCart] = useState<Product[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Populaire");
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [paymentMode, setPaymentMode] = useState<"online" | "cod" | null>(null);
  const [deliveryInfo, setDeliveryInfo] = useState({ name: "", phone: "", address: "", quartier: "" });
  const [orderSuccess, setOrderSuccess] = useState(false);

  const DELIVERY_FEE = 2500;
  const categories = ["Tous", "Logiciels", "Templates", "Formations", "Services"];

  const products: Product[] = [
    { id: 1, category: "Logiciels", title: "Logiciel de caisse alimentation", description: "Gestion complète de votre alimentation — stocks, ventes, rapports journaliers", price: 150000, image: "🖥️", color: "#0099FF", badge: "BESTSELLER", features: ["Gestion stocks temps réel", "Impression tickets", "Rapports auto", "Multi-caisses"], digital: true },
    { id: 2, category: "Templates", title: "Template site restaurant", description: "Design premium prêt à l'emploi pour restaurants et bars", price: 45000, image: "🍽️", color: "#FF6B00", features: ["Menu interactif", "Réservation en ligne", "Galerie photos", "Responsive"], digital: true },
    { id: 3, category: "Formations", title: "Formation création site web", description: "10 heures de formation en ligne pour créer votre site web", price: 75000, image: "🎓", color: "#00C48C", features: ["10h de vidéos HD", "Exercices pratiques", "Certificat", "Support 3 mois"], digital: true },
    { id: 4, category: "Services", title: "Pack maintenance annuel", description: "Maintenance informatique complète pour votre entreprise", price: 120000, image: "🔧", color: "#9B93FF", features: ["Support 24/7", "Dépannage illimité", "Mises à jour", "Sauvegardes auto"] },
    { id: 5, category: "Templates", title: "Template app mobile", description: "UI/UX React Native prêt à l'emploi pour votre application", price: 80000, image: "📱", color: "#0066FF", features: ["Code source complet", "Android + iOS", "30+ écrans", "Design moderne"], digital: true },
    { id: 6, category: "Services", title: "Audit cybersécurité", description: "Rapport complet d'audit + recommandations personnalisées", price: 200000, image: "🔐", color: "#FF4757", badge: "POPULAIRE", features: ["Audit complet", "Rapport détaillé", "Plan d'action", "Suivi 1 mois"] },
    { id: 7, category: "Logiciels", title: "Logiciel CRM boutique", description: "Gérez vos clients, ventes et fidélité en un seul outil", price: 180000, image: "📊", color: "#0099FF", features: ["Base clients", "Suivi ventes", "Fidélité", "SMS marketing"], digital: true },
    { id: 8, category: "Templates", title: "Template e-commerce", description: "Boutique en ligne complète avec Mobile Money intégré", price: 120000, image: "🛒", color: "#FF6B00", badge: "NOUVEAU", features: ["Paiement Wave/OM", "Panier complet", "Gestion commandes", "Livraison GPS"], digital: true },
    { id: 9, category: "Formations", title: "Formation cybersécurité PME", description: "Protégez votre entreprise des cyberattaques", price: 90000, image: "🛡️", color: "#FF4757", features: ["8h de formation", "Cas pratiques", "Certificat", "Guide PDF"], digital: true },
  ];

  const filteredProducts = activeCategory === "Tous" ? products : products.filter(p => p.category === activeCategory);
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "Prix croissant") return a.price - b.price;
    if (sortBy === "Prix décroissant") return b.price - a.price;
    return 0;
  });

  const addToCart = (product: Product) => { setCart([...cart, product]); setCartOpen(true); };
  const removeFromCart = (id: number) => {
    const index = cart.findIndex(item => item.id === id);
    if (index > -1) { const newCart = [...cart]; newCart.splice(index, 1); setCart(newCart); }
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const deliveryFee = paymentMode === "cod" ? DELIVERY_FEE : 0;
  const cartTotal = cartSubtotal + deliveryFee;
  const formatPrice = (price: number) => price.toLocaleString("fr-FR").replace(/,/g, " ");

  const resetCheckout = () => {
    setCheckoutStep(0);
    setPaymentMode(null);
    setDeliveryInfo({ name: "", phone: "", address: "", quartier: "" });
    setOrderSuccess(false);
  };

  const confirmOrder = () => {
    setOrderSuccess(true);
    setTimeout(() => {
      setCart([]);
      setCartOpen(false);
      resetCheckout();
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#060D1F] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#FF6B00] rounded-full blur-[150px] opacity-15 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#0099FF] rounded-full blur-[150px] opacity-15 animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* NAV */}
      <nav className="relative border-b border-[#1a2540] px-6 md:px-12 py-4 flex items-center justify-between sticky top-0 bg-[#060D1F]/80 backdrop-blur-xl z-50">
        <Link href="/" className="text-xl font-black tracking-[3px]">
          SORA<span className="text-[#0099FF]">TECH</span>
        </Link>
        <div className="hidden lg:flex items-center gap-6">
          <Link href="/" className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Accueil</Link>
          <Link href="/services" className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Services</Link>
          <Link href="/about" className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">À propos</Link>
          <Link href="/blog" className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Blog</Link>
          <Link href="/projets" className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Projets</Link>
          <Link href="/boutique" className="text-xs uppercase tracking-widest text-[#0099FF] font-bold">Boutique</Link>
          <Link href="/devis" className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Devis & RDV</Link>
          <Link href="/contact" className="text-xs uppercase tracking-widest text-[#8899BB] hover:text-white transition">Contact</Link>
        </div>
        <div className="flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCartOpen(true)} className="relative bg-[#0066FF] hover:bg-[#0099FF] transition px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2">
            🛒 Panier
            {cart.length > 0 && <span className="bg-[#FF6B00] text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-black">{cart.length}</span>}
          </motion.button>
          <MobileMenu active="boutique" />
        </div>
      </nav>

      {/* HERO */}
      <section className="relative py-20 md:py-24 px-6 text-center z-10">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(#1a2540 1px, transparent 1px), linear-gradient(90deg, #1a2540 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block bg-[#0A1A3A] border border-[#FF6B00] text-[#FF6B00] text-xs tracking-[2px] px-4 py-1.5 rounded-full mb-6">
            ✨ BOUTIQUE DIGITALE
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-4xl md:text-6xl font-black leading-tight mb-6 tracking-tight">
            Nos produits<br /><motion.span animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 5, repeat: Infinity }} className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#0099FF] to-[#00C48C]" style={{ backgroundSize: "200% 200%" }}>prêts à l&apos;emploi</motion.span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-[#8899BB] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Logiciels, templates, formations et services — tout ce dont votre entreprise a besoin, disponible immédiatement.
          </motion.p>
        </div>
      </section>

      {/* AVANTAGES */}
      <section className="relative border-y border-[#1a2540] bg-[#080F20]/80 backdrop-blur py-8 px-6 z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { icon: "⚡", label: "Livraison instantanée" },
            { icon: "💳", label: "Mobile Money + Cash" },
            { icon: "🚚", label: "Livraison Abidjan 2500F" },
            { icon: "🎯", label: "Support 24/7" },
          ].map((a, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="text-2xl mb-1">{a.icon}</div>
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
              <motion.button key={cat} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setActiveCategory(cat)} className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition ${activeCategory === cat ? "bg-[#0066FF] text-white" : "bg-[#0A1525] border border-[#1a2540] text-[#8899BB] hover:border-[#0066FF] hover:text-white"}`}>
                {cat}
              </motion.button>
            ))}
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-[#0A1525] border border-[#1a2540] rounded-lg px-4 py-2 text-xs text-white outline-none focus:border-[#0066FF] cursor-pointer">
            <option>Populaire</option>
            <option>Prix croissant</option>
            <option>Prix décroissant</option>
          </select>
        </div>
      </section>

      {/* GRILLE PRODUITS */}
      <section className="relative py-8 px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} whileHover={{ y: -8, boxShadow: `0 20px 40px ${product.color}30` }} className="bg-[#0A1525]/80 backdrop-blur border border-[#1a2540] rounded-2xl overflow-hidden transition group">
                <div className="relative h-44 flex items-center justify-center text-7xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${product.color}30, ${product.color}05)` }}>
                  <div className="group-hover:scale-110 transition-transform duration-500">{product.image}</div>
                  {product.badge && <div className="absolute top-3 right-3 bg-[#FF6B00] text-white px-2 py-1 rounded text-[9px] font-black tracking-wider">{product.badge}</div>}
                  <div className="absolute top-3 left-3 bg-[#060D1F]/80 backdrop-blur px-2 py-1 rounded text-[10px] tracking-widest" style={{ color: product.color }}>{product.category}</div>
                  {product.digital && <div className="absolute bottom-3 left-3 bg-[#00C48C]/20 border border-[#00C48C] text-[#00C48C] px-2 py-0.5 rounded text-[9px] font-bold">📥 DIGITAL</div>}
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold mb-2 group-hover:text-[#0099FF] transition">{product.title}</h3>
                  <p className="text-xs text-[#8899BB] leading-relaxed mb-4">{product.description}</p>
                  <div className="space-y-1 mb-4">
                    {product.features.slice(0, 3).map((f, k) => (
                      <div key={k} className="flex items-start gap-2 text-xs text-[#8899BB]">
                        <span style={{ color: product.color }} className="font-bold text-xs">✓</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[#1a2540]">
                    <div>
                      <div className="text-[10px] text-[#8899BB]">À partir de</div>
                      <div className="text-xl font-black" style={{ color: product.color }}>{formatPrice(product.price)} F</div>
                    </div>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => addToCart(product)} className="px-4 py-2.5 rounded-lg font-bold text-xs transition" style={{ backgroundColor: product.color, color: "#fff" }}>+ Panier</motion.button>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setCartOpen(false); resetCheckout(); }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 20 }} className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-[#060D1F] border-l border-[#1a2540] z-[101] flex flex-col">

              {/* HEADER PANIER */}
              <div className="flex items-center justify-between p-6 border-b border-[#1a2540]">
                <div>
                  {checkoutStep > 0 && !orderSuccess && (
                    <button onClick={() => setCheckoutStep(checkoutStep - 1)} className="text-xs text-[#0099FF] mb-1">← Retour</button>
                  )}
                  <h3 className="text-lg font-black">
                    {orderSuccess ? "✅ Commande confirmée !" :
                     checkoutStep === 0 ? `🛒 Votre panier (${cart.length})` :
                     checkoutStep === 1 ? "💳 Mode de paiement" :
                     checkoutStep === 2 ? "📝 Vos informations" :
                     "✓ Récapitulatif"}
                  </h3>
                </div>
                <button onClick={() => { setCartOpen(false); resetCheckout(); }} className="text-[#8899BB] hover:text-white text-2xl">×</button>
              </div>

              {/* CONTENU */}
              <div className="flex-1 overflow-y-auto p-6">

                {/* SUCCESS */}
                {orderSuccess && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                    <div className="text-7xl mb-4">🎉</div>
                    <h4 className="text-xl font-black mb-3">Commande validée !</h4>
                    <p className="text-sm text-[#8899BB] mb-4">Un message de confirmation vient d&apos;être envoyé par email et WhatsApp à <span className="text-[#0099FF] font-bold">{deliveryInfo.phone}</span></p>
                    <div className="bg-[#00C48C]/10 border border-[#00C48C] rounded-xl p-4 text-left">
                      <div className="text-xs text-[#00C48C] font-bold mb-2">📧 Email envoyé</div>
                      <div className="text-xs text-[#8899BB]">📎 Facture PDF</div>
                      <div className="text-xs text-[#8899BB]">📎 Reçu de paiement</div>
                    </div>
                    <div className="bg-[#25D366]/10 border border-[#25D366] rounded-xl p-4 text-left mt-3">
                      <div className="text-xs text-[#25D366] font-bold mb-2">💬 WhatsApp envoyé</div>
                      <div className="text-xs text-[#8899BB]">Confirmation avec suivi de commande</div>
                    </div>
                  </motion.div>
                )}

                {/* ÉTAPE 0 : PANIER */}
                {!orderSuccess && checkoutStep === 0 && (
                  <>
                    {cart.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">🛒</div>
                        <p className="text-[#8899BB]">Votre panier est vide</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {cart.map((item, i) => (
                          <motion.div key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="bg-[#0A1525] border border-[#1a2540] rounded-xl p-4 flex items-center gap-3">
                            <div className="text-3xl flex-shrink-0">{item.image}</div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-bold truncate">{item.title}</div>
                              <div className="text-xs font-bold" style={{ color: item.color }}>{formatPrice(item.price)} FCFA</div>
                              {item.digital && <div className="text-[10px] text-[#00C48C] mt-1">📥 Produit digital</div>}
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-[#FF4757] hover:bg-[#FF4757]/10 w-8 h-8 rounded-lg flex items-center justify-center">🗑</button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* ÉTAPE 1 : PAIEMENT */}
                {!orderSuccess && checkoutStep === 1 && (
                  <div className="space-y-3">
                    <p className="text-xs text-[#8899BB] mb-4">Choisissez votre mode de paiement préféré :</p>

                    <motion.div whileHover={{ scale: 1.02 }} onClick={() => setPaymentMode("online")} className={`border rounded-xl p-5 cursor-pointer transition ${paymentMode === "online" ? "border-[#0066FF] bg-[#0066FF]/10" : "border-[#1a2540] bg-[#0A1525]"}`}>
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">💳</div>
                        <div className="flex-1">
                          <div className="font-bold text-sm mb-1 flex items-center gap-2">
                            Paiement en ligne
                            <span className="text-[9px] bg-[#00C48C] text-white px-2 py-0.5 rounded-full font-black">RECOMMANDÉ</span>
                          </div>
                          <div className="text-xs text-[#8899BB] mb-2">Wave, Orange Money, MTN Money, carte bancaire</div>
                          <div className="flex gap-1 flex-wrap">
                            <span className="text-[9px] bg-[#1a2540] px-2 py-0.5 rounded">Wave</span>
                            <span className="text-[9px] bg-[#1a2540] px-2 py-0.5 rounded">Orange Money</span>
                            <span className="text-[9px] bg-[#1a2540] px-2 py-0.5 rounded">MTN Money</span>
                            <span className="text-[9px] bg-[#1a2540] px-2 py-0.5 rounded">Visa/Mastercard</span>
                          </div>
                          <div className="text-xs text-[#00C48C] font-bold mt-2">✓ Livraison gratuite + Accès immédiat</div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} onClick={() => setPaymentMode("cod")} className={`border rounded-xl p-5 cursor-pointer transition ${paymentMode === "cod" ? "border-[#FF6B00] bg-[#FF6B00]/10" : "border-[#1a2540] bg-[#0A1525]"}`}>
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">🚚</div>
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

                {/* ÉTAPE 2 : INFOS */}
                {!orderSuccess && checkoutStep === 2 && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-[#8899BB] tracking-wide uppercase font-bold">Nom complet *</label>
                      <input type="text" value={deliveryInfo.name} onChange={(e) => setDeliveryInfo({...deliveryInfo, name: e.target.value})} placeholder="Kofi Mensah" className="w-full mt-1 bg-[#0A1525] border border-[#1a2540] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#0066FF]" />
                    </div>
                    <div>
                      <label className="text-xs text-[#8899BB] tracking-wide uppercase font-bold">Téléphone WhatsApp *</label>
                      <input type="tel" value={deliveryInfo.phone} onChange={(e) => setDeliveryInfo({...deliveryInfo, phone: e.target.value})} placeholder="+225 07 00 00 00 00" className="w-full mt-1 bg-[#0A1525] border border-[#1a2540] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#0066FF]" />
                    </div>
                    {paymentMode === "cod" && (
                      <>
                        <div>
                          <label className="text-xs text-[#8899BB] tracking-wide uppercase font-bold">Quartier *</label>
                          <select value={deliveryInfo.quartier} onChange={(e) => setDeliveryInfo({...deliveryInfo, quartier: e.target.value})} className="w-full mt-1 bg-[#0A1525] border border-[#1a2540] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#0066FF] cursor-pointer">
                            <option value="">Sélectionnez...</option>
                            <option>Cocody</option>
                            <option>Plateau</option>
                            <option>Marcory</option>
                            <option>Treichville</option>
                            <option>Yopougon</option>
                            <option>Abobo</option>
                            <option>Adjamé</option>
                            <option>Riviera</option>
                            <option>Angré</option>
                            <option>Port-Bouët</option>
                            <option>Koumassi</option>
                            <option>Autre</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-[#8899BB] tracking-wide uppercase font-bold">Adresse précise *</label>
                          <textarea value={deliveryInfo.address} onChange={(e) => setDeliveryInfo({...deliveryInfo, address: e.target.value})} placeholder="Ex: Rue des jardins, près de la pharmacie du coin..." rows={3} className="w-full mt-1 bg-[#0A1525] border border-[#1a2540] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#0066FF] resize-none" />
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* ÉTAPE 3 : RÉCAP */}
                {!orderSuccess && checkoutStep === 3 && (
                  <div className="space-y-4">
                    <div className="bg-[#0A1525] border border-[#1a2540] rounded-xl p-4">
                      <div className="text-xs text-[#8899BB] font-bold mb-3 uppercase tracking-wider">Articles commandés</div>
                      {cart.map((item, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-[#1a2540] last:border-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{item.image}</span>
                            <span className="text-xs">{item.title}</span>
                          </div>
                          <span className="text-xs font-bold" style={{ color: item.color }}>{formatPrice(item.price)} F</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-[#0A1525] border border-[#1a2540] rounded-xl p-4">
                      <div className="text-xs text-[#8899BB] font-bold mb-3 uppercase tracking-wider">Mode de paiement</div>
                      <div className="text-sm">
                        {paymentMode === "online" ? "💳 Paiement en ligne (Wave, OM, MTN...)" : "🚚 Paiement à la livraison"}
                      </div>
                    </div>

                    <div className="bg-[#0A1525] border border-[#1a2540] rounded-xl p-4">
                      <div className="text-xs text-[#8899BB] font-bold mb-3 uppercase tracking-wider">Client</div>
                      <div className="text-sm">{deliveryInfo.name}</div>
                      <div className="text-xs text-[#8899BB]">{deliveryInfo.phone}</div>
                      {paymentMode === "cod" && deliveryInfo.address && (
                        <div className="text-xs text-[#8899BB] mt-1">📍 {deliveryInfo.quartier} · {deliveryInfo.address}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* FOOTER / BOUTONS */}
              {cart.length > 0 && !orderSuccess && (
                <div className="p-6 border-t border-[#1a2540] bg-[#060D1F]">

                  {/* TOTAL */}
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-xs text-[#8899BB]">
                      <span>Sous-total</span>
                      <span>{formatPrice(cartSubtotal)} FCFA</span>
                    </div>
                    {deliveryFee > 0 && (
                      <div className="flex justify-between text-xs text-[#FF6B00]">
                        <span>🚚 Livraison Abidjan</span>
                        <span>+ {formatPrice(deliveryFee)} FCFA</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t border-[#1a2540]">
                      <span className="text-sm font-bold">Total</span>
                      <span className="text-2xl font-black text-[#0099FF]">{formatPrice(cartTotal)} FCFA</span>
                    </div>
                  </div>

                  {checkoutStep === 0 && (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setCheckoutStep(1)} className="w-full bg-[#0066FF] py-3.5 rounded-lg font-bold text-sm">
                      Commander →
                    </motion.button>
                  )}
                  {checkoutStep === 1 && (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => paymentMode && setCheckoutStep(2)} disabled={!paymentMode} className={`w-full py-3.5 rounded-lg font-bold text-sm transition ${paymentMode ? "bg-[#0066FF]" : "bg-[#1a2540] text-[#8899BB] cursor-not-allowed"}`}>
                      Continuer →
                    </motion.button>
                  )}
                  {checkoutStep === 2 && (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => {
                      const valid = deliveryInfo.name && deliveryInfo.phone && (paymentMode === "online" || (deliveryInfo.quartier && deliveryInfo.address));
                      if (valid) setCheckoutStep(3);
                    }} className="w-full bg-[#0066FF] py-3.5 rounded-lg font-bold text-sm">
                      Vérifier la commande →
                    </motion.button>
                  )}
                  {checkoutStep === 3 && (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={confirmOrder} className={`w-full py-3.5 rounded-lg font-bold text-sm ${paymentMode === "online" ? "bg-[#0066FF]" : "bg-[#FF6B00]"}`}>
                      {paymentMode === "online" ? "💳 Payer maintenant" : "✓ Confirmer la commande"}
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
          {[
            { icon: "✅", title: "Garantie 1 an", desc: "Sur tous nos produits digitaux, support inclus" },
            { icon: "🔄", title: "Satisfait ou remboursé", desc: "14 jours pour changer d'avis, sans justification" },
            { icon: "🚚", title: "Livraison Abidjan", desc: "24-48h pour les produits physiques · 2500 FCFA" },
          ].map((g, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-[#0A1525]/80 border border-[#1a2540] rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">{g.icon}</div>
              <h3 className="text-base font-bold mb-2">{g.title}</h3>
              <p className="text-xs text-[#8899BB] leading-relaxed">{g.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 px-6 text-center z-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-3xl mx-auto bg-gradient-to-br from-[#FF6B00]/20 via-[#0099FF]/10 to-[#00C48C]/10 border border-[#FF6B00] rounded-3xl p-10 md:p-14 backdrop-blur">
          <h2 className="text-3xl md:text-5xl font-black mb-4">Besoin d&apos;une solution personnalisée ?</h2>
          <p className="text-[#8899BB] mb-8">Pas trouvé ce que vous cherchez ? Nous créons des solutions sur mesure</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-[#0066FF] px-8 py-3.5 rounded-lg font-bold text-sm">Demander un devis</motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-[#25D366] px-8 py-3.5 rounded-lg font-bold text-sm">💬 WhatsApp direct</motion.button>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="relative bg-[#040A14] border-t border-[#1a2540] py-12 px-6 z-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-lg font-black tracking-widest mb-3">SORA<span className="text-[#0099FF]">TECH</span></div>
            <p className="text-xs text-[#8899BB] leading-relaxed mb-4">Entreprise tech panafricaine qui digitalise les entreprises d&apos;Abidjan et de toute l&apos;Afrique de l&apos;Ouest.</p>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-[#1a2540] hover:bg-[#0066FF] rounded-lg flex items-center justify-center cursor-pointer transition text-xs">f</div>
              <div className="w-8 h-8 bg-[#1a2540] hover:bg-[#0066FF] rounded-lg flex items-center justify-center cursor-pointer transition text-xs">in</div>
              <div className="w-8 h-8 bg-[#1a2540] hover:bg-[#0066FF] rounded-lg flex items-center justify-center cursor-pointer transition text-xs">ig</div>
              <div className="w-8 h-8 bg-[#1a2540] hover:bg-[#25D366] rounded-lg flex items-center justify-center cursor-pointer transition text-xs">wa</div>
            </div>
          </div>
          <div>
            <h4 className="text-xs tracking-wider text-white mb-3 font-bold">SERVICES</h4>
            <ul className="space-y-2 text-xs text-[#8899BB]">
              <li className="hover:text-[#0099FF] cursor-pointer transition">Sites web</li>
              <li className="hover:text-[#0099FF] cursor-pointer transition">Logiciels de gestion</li>
              <li className="hover:text-[#0099FF] cursor-pointer transition">Applications mobiles</li>
              <li className="hover:text-[#0099FF] cursor-pointer transition">ERP entreprise</li>
              <li className="hover:text-[#0099FF] cursor-pointer transition">Cybersécurité</li>
              <li className="hover:text-[#0099FF] cursor-pointer transition">Maintenance</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs tracking-wider text-white mb-3 font-bold">ENTREPRISE</h4>
            <ul className="space-y-2 text-xs text-[#8899BB]">
              <li className="hover:text-[#0099FF] cursor-pointer transition">À propos de nous</li>
              <li className="hover:text-[#0099FF] cursor-pointer transition">Blog SORA TECH</li>
              <li className="hover:text-[#0099FF] cursor-pointer transition">Nos réalisations</li>
              <li className="hover:text-[#0099FF] cursor-pointer transition">Boutique digitale</li>
              <li className="hover:text-[#0099FF] cursor-pointer transition">Devis & RDV</li>
              <li className="hover:text-[#0099FF] cursor-pointer transition">Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs tracking-wider text-white mb-3 font-bold">CONTACT</h4>
            <ul className="space-y-2 text-xs text-[#8899BB]">
              <li>📍 Abidjan, Côte d&apos;Ivoire</li>
              <li>📞 +225 07 00 00 00</li>
              <li>✉️ contact@soratech.ci</li>
              <li>💬 WhatsApp Business</li>
              <li>🕐 Lun-Ven : 8h-18h</li>
              <li>🕐 Sam : 9h-14h</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#1a2540] pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="text-xs text-[#8899BB]">© 2025 SORA TECH COMPANY — Tous droits réservés</div>
          <div className="text-xs text-[#8899BB]">Fait avec ❤️ à Abidjan par Sissoko Abdoulaye</div>
        </div>
      </footer>
    </div>
  );
}