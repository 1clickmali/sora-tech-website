'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useApp } from '../../i18n/AppContext';

interface Item { title: string; price: number; quantity: number; digital?: boolean; }
interface TimelineEvent { event: string; by: string; date: string; }
interface Commande {
  _id: string; reference: string; trackingCode: string;
  clientName: string; clientPhone: string; clientEmail?: string;
  clientQuartier?: string; clientAddress?: string;
  items: Item[]; subtotal: number; deliveryFee: number; total: number;
  paymentMode: string; status: string; createdAt: string;
  timeline?: TimelineEvent[];
}

const STATUS_INDEX: Record<string, number> = {
  nouveau: 0, en_cours: 0, confirme: 1, en_livraison: 2, livre: 3,
};

export default function SuiviPage() {
  const { lang } = useApp();
  const isFr = lang === 'fr';
  const { trackingCode } = useParams<{ trackingCode: string }>();
  const [commande, setCommande] = useState<Commande | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!trackingCode) return;
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${base}/api/commandes/tracking/${trackingCode}`)
      .then(r => r.json())
      .then(r => {
        if (r.success) setCommande(r.data);
        else setError(isFr ? 'Code de suivi introuvable.' : 'Tracking code not found.');
      })
      .catch(() => setError(isFr ? 'Impossible de contacter le serveur.' : 'Unable to contact the server.'))
      .finally(() => setLoading(false));
  }, [trackingCode, isFr]);

  const steps = [
    { key: 'nouveau', label: isFr ? 'Commande reçue' : 'Order received', icon: '📥', desc: isFr ? 'Votre commande a été enregistrée avec succès.' : 'Your order has been saved successfully.' },
    { key: 'confirme', label: isFr ? 'Confirmée' : 'Confirmed', icon: '✅', desc: isFr ? 'Notre équipe a validé votre commande.' : 'Our team has validated your order.' },
    { key: 'en_livraison', label: isFr ? 'En livraison' : 'Out for delivery', icon: '🚚', desc: isFr ? 'Votre colis est en route vers vous.' : 'Your package is on its way to you.' },
    { key: 'livre', label: isFr ? 'Livrée' : 'Delivered', icon: '🎉', desc: isFr ? 'Commande livrée. Merci pour votre achat !' : 'Order delivered. Thank you for your purchase!' },
  ];

  const fmt = (n: number) => new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US').format(n) + ' FCFA';

  const stepIndex = commande ? (STATUS_INDEX[commande.status] ?? 0) : 0;
  const isCancelled = commande?.status === 'annule';

  return (
    <div className="min-h-screen" style={{ background: '#060D1F', color: '#E2E8F0' }}>
      {/* Grid BG */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(#0099FF 1px, transparent 1px), linear-gradient(90deg, #0099FF 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Nav */}
      <nav className="relative border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: '#1E2D4A', background: '#060D1F/95' }}>
        <Link href="/" className="text-xl font-black tracking-widest">SORA<span className="text-[#0099FF]">TECH</span></Link>
        <div className="text-xs text-gray-500 uppercase tracking-widest">{isFr ? 'Suivi de commande' : 'Order tracking'}</div>
      </nav>

      <div className="relative max-w-2xl mx-auto px-4 py-12">
        {loading && (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">{isFr ? 'Chargement de votre commande...' : 'Loading your order...'}</p>
          </div>
        )}

        {error && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-white mb-2">{isFr ? 'Commande introuvable' : 'Order not found'}</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <p className="text-sm text-gray-500">{isFr ? 'Code recherché' : 'Searched code'} : <span className="font-mono text-cyan-400">{trackingCode}</span></p>
            <Link href="/" className="inline-block mt-6 px-6 py-2 rounded-xl text-sm font-bold"
              style={{ background: '#0066FF', color: '#fff' }}>
              {isFr ? "Retour à l'accueil" : "Back home"}
            </Link>
          </motion.div>
        )}

        {commande && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-4"
                style={{ background: '#0099FF20', border: '1px solid #0099FF40', color: '#0099FF' }}>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                {isFr ? 'Suivi en temps réel' : 'Real-time tracking'}
              </div>
              <h1 className="text-3xl font-black text-white mb-1">{isFr ? 'Commande' : 'Order'} {commande.reference}</h1>
              <p className="text-gray-400 text-sm">{isFr ? 'Code' : 'Code'} : <span className="font-mono text-cyan-400 font-bold">{commande.trackingCode}</span></p>
            </div>

            {/* Barre de progression */}
            {!isCancelled ? (
              <div className="rounded-2xl p-6" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
                <div className="relative">
                  {/* Ligne de fond */}
                  <div className="absolute top-5 left-6 right-6 h-0.5" style={{ background: '#1E2D4A' }} />
                  {/* Ligne remplie */}
                  <div className="absolute top-5 left-6 h-0.5 transition-all duration-700"
                    style={{ background: '#0099FF', width: `${(stepIndex / (steps.length - 1)) * 88}%` }} />

                  <div className="flex justify-between relative">
                    {steps.map((step, i) => {
                      const done = i <= stepIndex;
                      const active = i === stepIndex;
                      return (
                        <div key={step.key} className="flex flex-col items-center gap-2 flex-1">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg z-10 transition-all duration-500"
                            style={{
                              background: done ? '#0099FF' : '#1E2D4A',
                              border: `2px solid ${done ? '#0099FF' : '#1E2D4A'}`,
                              boxShadow: active ? '0 0 20px rgba(0,153,255,0.5)' : 'none',
                            }}>
                            {done ? step.icon : <span className="text-gray-500 text-xs font-bold">{i + 1}</span>}
                          </div>
                          <div className="text-center">
                            <div className="text-xs font-bold" style={{ color: done ? '#E2E8F0' : '#4B5563' }}>
                              {step.label}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Message statut actuel */}
                <div className="mt-6 p-4 rounded-xl text-center" style={{ background: '#060D1F', border: '1px solid #0099FF30' }}>
                  <div className="text-2xl mb-1">{steps[stepIndex]?.icon}</div>
                  <div className="text-white font-bold">{steps[stepIndex]?.label}</div>
                  <div className="text-sm text-gray-400 mt-1">{steps[stepIndex]?.desc}</div>
                  {commande.status === 'en_livraison' && commande.clientQuartier && (
                    <div className="text-xs text-orange-400 mt-2">📍 {isFr ? 'Livraison vers' : 'Delivery to'} : {commande.clientQuartier}</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl p-6 text-center" style={{ background: '#EF44441A', border: '1px solid #EF444440' }}>
                <div className="text-4xl mb-2">❌</div>
                <div className="text-red-400 font-bold text-lg">{isFr ? 'Commande annulée' : 'Order cancelled'}</div>
                <div className="text-sm text-gray-400 mt-1">{isFr ? "Cette commande a été annulée. Contactez-nous pour plus d'informations." : 'This order was cancelled. Contact us for more information.'}</div>
              </div>
            )}

            {/* Infos client */}
            <div className="rounded-2xl p-5" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
              <h3 className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">👤 {isFr ? 'Vos informations' : 'Your information'}</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-[10px] text-gray-500 uppercase mb-0.5">{isFr ? 'Nom' : 'Name'}</div>
                  <div className="text-white font-semibold">{commande.clientName}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase mb-0.5">{isFr ? 'Téléphone' : 'Phone'}</div>
                  <div className="text-white">{commande.clientPhone}</div>
                </div>
                {commande.clientQuartier && (
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase mb-0.5">{isFr ? 'Quartier' : 'District'}</div>
                    <div className="text-white">📍 {commande.clientQuartier}</div>
                  </div>
                )}
                <div>
                  <div className="text-[10px] text-gray-500 uppercase mb-0.5">{isFr ? 'Paiement' : 'Payment'}</div>
                  <div style={{ color: commande.paymentMode === 'online' ? '#00E5FF' : '#FF6B00' }}>
                    {commande.paymentMode === 'online' ? (isFr ? '💳 En ligne' : '💳 Online') : (isFr ? '🚚 À la livraison' : '🚚 On delivery')}
                  </div>
                </div>
              </div>
            </div>

            {/* Articles */}
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #1E2D4A' }}>
              <div className="px-5 py-3 border-b" style={{ background: '#0B1628', borderColor: '#1E2D4A' }}>
                <h3 className="text-xs text-gray-500 uppercase tracking-widest font-semibold">📦 {isFr ? 'Articles commandés' : 'Ordered items'}</h3>
              </div>
              {commande.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center px-5 py-3 border-b last:border-0 text-sm"
                  style={{ background: i % 2 === 0 ? '#060D1F' : '#080F20', borderColor: '#1E2D4A' }}>
                  <div>
                    <div className="text-white">{item.title}</div>
                    {item.digital && <div className="text-[10px] text-green-400">⚡ {isFr ? 'Livraison instantanée' : 'Instant delivery'}</div>}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">× {item.quantity || 1}</div>
                    <div className="font-mono font-bold text-cyan-400">{fmt((item.price || 0) * (item.quantity || 1))}</div>
                  </div>
                </div>
              ))}
              <div className="px-5 py-3" style={{ background: '#0B1628' }}>
                {commande.deliveryFee > 0 && (
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>{isFr ? 'Frais de livraison' : 'Delivery fee'}</span>
                    <span className="font-mono">+{fmt(commande.deliveryFee)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold">
                  <span className="text-white">TOTAL</span>
                  <span className="text-xl font-black font-mono text-cyan-400">{fmt(commande.total)}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            {commande.timeline && commande.timeline.length > 0 && (
              <div className="rounded-2xl p-5" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
                <h3 className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">📅 {isFr ? 'Historique' : 'History'}</h3>
                <div className="space-y-3">
                  {[...commande.timeline].reverse().map((ev, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex flex-col items-center mt-1">
                        <div className="w-2 h-2 rounded-full" style={{ background: i === 0 ? '#00E5FF' : '#1E2D4A' }} />
                        {i < commande.timeline!.length - 1 && <div className="w-0.5 h-4 mt-1" style={{ background: '#1E2D4A' }} />}
                      </div>
                      <div>
                        <div className="text-sm text-gray-300">{ev.event}</div>
                        <div className="text-[10px] text-gray-500">
                          {new Date(ev.date).toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US')} · {ev.by}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA contact */}
            <div className="rounded-2xl p-5 text-center" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
              <p className="text-sm text-gray-400 mb-4">{isFr ? 'Une question sur votre commande ?' : 'Question about your order?'}</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <a href={`https://wa.me/2250704928068?text=Bonjour,%20j%27ai%20une%20question%20sur%20ma%20commande%20${commande.reference}`}
                  target="_blank" rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl text-sm font-bold transition"
                  style={{ background: '#25D36620', color: '#25D366', border: '1px solid #25D36640' }}>
                  💬 WhatsApp
                </a>
                <a href="tel:+2250704928068"
                  className="px-5 py-2.5 rounded-xl text-sm font-bold transition"
                  style={{ background: '#0099FF20', color: '#0099FF', border: '1px solid #0099FF40' }}>
                  📞 {isFr ? 'Appeler' : 'Call'}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t py-6 px-6 text-center" style={{ borderColor: '#1E2D4A' }}>
        <p className="text-xs text-gray-500">© 2025 SORA TECH COMPANY — Cocody, Angré 8ème, Abidjan, Côte d&apos;Ivoire</p>
      </footer>
    </div>
  );
}
