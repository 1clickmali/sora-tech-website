'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

interface Item { title: string; price: number; quantity: number; digital?: boolean; }
interface Commande {
  _id: string; reference: string; trackingCode: string;
  clientName: string; clientPhone: string; clientEmail?: string;
  clientQuartier?: string; clientAddress?: string;
  quartier?: string; address?: string;
  items: Item[]; total: number; deliveryFee: number;
  paymentMode: string; status: string; createdAt: string;
}

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';

export default function LivreurPage() {
  const { trackingCode } = useParams<{ trackingCode: string }>();
  const [commande, setCommande] = useState<Commande | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [done, setDone] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const quartier = (c: Commande) => c.clientQuartier || c.quartier || '';
  const address = (c: Commande) => c.clientAddress || c.address || '';

  useEffect(() => {
    if (!trackingCode) return;
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${base}/api/commandes/tracking/${trackingCode}`)
      .then(r => r.json())
      .then(r => {
        if (r.success) {
          setCommande(r.data);
          if (r.data.status === 'livre') setDone(true);
        } else {
          setError('Commande introuvable pour ce code.');
        }
      })
      .catch(() => setError('Impossible de contacter le serveur.'))
      .finally(() => setLoading(false));
  }, [trackingCode]);

  const updateStatus = async (status: string) => {
    if (!commande) return;
    setUpdating(true);
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('sora_token') : null;
      const r = await fetch(`${base}/api/commandes/${commande._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status }),
      });
      const data = await r.json();
      if (data.success) {
        setCommande(data.data);
        if (status === 'livre') setDone(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#060D1F' }}>
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Chargement...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#060D1F' }}>
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-4">🚚</div>
        <h2 className="text-xl font-bold text-white mb-2">Commande introuvable</h2>
        <p className="text-gray-400 text-sm">{error}</p>
        <p className="text-gray-500 text-xs mt-3 font-mono">{trackingCode}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: '#060D1F', color: '#E2E8F0' }}>
      {/* Nav */}
      <nav className="border-b px-5 py-4 flex items-center gap-3" style={{ borderColor: '#1E2D4A', background: '#0B1628' }}>
        <div className="text-lg font-black">SORA<span className="text-[#FF6B00]">TECH</span></div>
        <div className="ml-auto text-xs px-3 py-1 rounded-full font-bold" style={{ background: '#FF6B0020', color: '#FF6B00', border: '1px solid #FF6B0040' }}>
          🚚 Interface Livreur
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-5">
        {done ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 rounded-2xl" style={{ background: '#0B1628', border: '1px solid #10B98140' }}>
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-black text-white mb-2">Livraison confirmée !</h2>
            <p className="text-gray-400 text-sm">La commande {commande?.reference} a été marquée comme livrée.</p>
            <div className="mt-4 text-xs text-green-400">✅ Le client et l&apos;admin ont été notifiés.</div>
          </motion.div>
        ) : (
          <>
            {/* En-tête commande */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-5" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-[10px] text-gray-500 uppercase font-semibold tracking-widest">Commande</div>
                  <div className="text-2xl font-black font-mono text-orange-400">{commande?.reference}</div>
                  <div className="text-xs text-gray-500 font-mono">{commande?.trackingCode}</div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: commande?.status === 'en_livraison' ? '#FF6B0020' : '#F59E0B20', color: commande?.status === 'en_livraison' ? '#FF6B00' : '#F59E0B', border: `1px solid ${commande?.status === 'en_livraison' ? '#FF6B00' : '#F59E0B'}40` }}>
                  {commande?.status === 'en_livraison' ? '🚚 En livraison' : '⏳ En attente'}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {new Date(commande?.createdAt || '').toLocaleString('fr-FR')}
              </div>
            </motion.div>

            {/* Infos client */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="rounded-2xl p-5" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
              <h3 className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">👤 Client</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-bold text-lg">{commande?.clientName}</div>
                    <div className="text-gray-400 text-sm">{commande?.clientPhone}</div>
                    {commande?.clientEmail && <div className="text-gray-500 text-xs">{commande.clientEmail}</div>}
                  </div>
                </div>

                {commande && quartier(commande) && (
                  <div className="rounded-xl p-3" style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}>
                    <div className="text-[10px] text-gray-500 uppercase mb-1">Adresse de livraison</div>
                    <div className="text-white font-semibold">📍 {quartier(commande)}</div>
                    {address(commande) && <div className="text-gray-400 text-xs mt-1">{address(commande)}</div>}
                  </div>
                )}

                {/* Boutons d'action client */}
                <div className="flex gap-2">
                  <a href={`tel:${commande?.clientPhone}`}
                    className="flex-1 py-3 rounded-xl text-sm font-bold text-center transition"
                    style={{ background: '#0099FF20', color: '#0099FF', border: '1px solid #0099FF40' }}>
                    📞 Appeler
                  </a>
                  <a href={`https://wa.me/225${commande?.clientPhone.replace(/\D/g,'')}?text=Bonjour%20${encodeURIComponent(commande?.clientName || '')},%20je%20suis%20votre%20livreur%20SORA%20TECH.%20Je%20suis%20en%20route%20avec%20votre%20commande%20${commande?.reference}`}
                    target="_blank" rel="noreferrer"
                    className="flex-1 py-3 rounded-xl text-sm font-bold text-center transition"
                    style={{ background: '#25D36620', color: '#25D366', border: '1px solid #25D36640' }}>
                    💬 WhatsApp
                  </a>
                  {commande && (quartier(commande) || address(commande)) && (
                    <a href={`https://www.google.com/maps/search/${encodeURIComponent(((quartier(commande) || '') + ' ' + (address(commande) || '')).trim() + ', Abidjan, Côte d\'Ivoire')}`}
                      target="_blank" rel="noreferrer"
                      className="flex-1 py-3 rounded-xl text-sm font-bold text-center transition"
                      style={{ background: '#10B98120', color: '#10B981', border: '1px solid #10B98140' }}>
                      🗺️ Maps
                    </a>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Articles */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="rounded-2xl overflow-hidden" style={{ border: '1px solid #1E2D4A' }}>
              <div className="px-5 py-3 border-b" style={{ background: '#0B1628', borderColor: '#1E2D4A' }}>
                <h3 className="text-xs text-gray-500 uppercase tracking-widest font-semibold">📦 Contenu du colis</h3>
              </div>
              {commande?.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center px-5 py-3 text-sm border-b last:border-0"
                  style={{ background: i % 2 === 0 ? '#060D1F' : '#070E1F', borderColor: '#1E2D4A' }}>
                  <div>
                    <div className="text-white">{item.title}</div>
                    {item.digital && <div className="text-[10px] text-yellow-400">⚠️ Produit digital — vérifier accès</div>}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">× {item.quantity || 1}</div>
                    <div className="font-mono font-bold text-orange-400">{fmt((item.price || 0) * (item.quantity || 1))}</div>
                  </div>
                </div>
              ))}
              <div className="px-5 py-3 flex justify-between" style={{ background: '#0B1628' }}>
                <span className="text-gray-400 text-sm">
                  {commande?.paymentMode === 'cod'
                    ? <span className="text-orange-400 font-bold">💰 À PERCEVOIR DU CLIENT</span>
                    : <span className="text-green-400 font-bold">✅ Déjà payé en ligne</span>}
                </span>
                <span className="text-xl font-black font-mono text-orange-400">{fmt(commande?.total || 0)}</span>
              </div>
            </motion.div>

            {/* Actions livreur */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="rounded-2xl p-5 space-y-3" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
              <h3 className="text-xs text-gray-500 uppercase tracking-widest font-semibold">⚡ Actions</h3>

              {commande?.status !== 'en_livraison' && (
                <button onClick={() => updateStatus('en_livraison')} disabled={updating}
                  className="w-full py-4 rounded-xl font-bold text-base transition-all"
                  style={{ background: updating ? '#1E2D4A' : '#FF6B00', color: updating ? '#64748B' : '#fff', opacity: updating ? 0.7 : 1 }}>
                  {updating ? 'Mise à jour...' : '🚚 J\'ai pris la commande — En livraison'}
                </button>
              )}

              {commande?.status === 'en_livraison' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl text-center text-sm" style={{ background: '#FF6B0015', border: '1px solid #FF6B0040', color: '#FF6B00' }}>
                    🚚 Vous êtes en route avec cette commande
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-widest font-semibold block mb-2">
                      Confirmer la livraison — tapez &quot;LIVRÉ&quot; pour valider
                    </label>
                    <input
                      value={confirmText}
                      onChange={e => setConfirmText(e.target.value.toUpperCase())}
                      placeholder='Tapez "LIVRÉ"'
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none font-mono"
                      style={{ background: '#060D1F', border: '1px solid #1E2D4A', color: '#E2E8F0' }}
                    />
                  </div>

                  <button
                    onClick={() => confirmText === 'LIVRÉ' && updateStatus('livre')}
                    disabled={updating || confirmText !== 'LIVRÉ'}
                    className="w-full py-4 rounded-xl font-bold text-base transition-all"
                    style={{
                      background: confirmText === 'LIVRÉ' ? '#10B981' : '#1E2D4A',
                      color: confirmText === 'LIVRÉ' ? '#fff' : '#64748B',
                      opacity: updating ? 0.7 : 1,
                    }}>
                    {updating ? 'Confirmation...' : '✅ Confirmer la livraison'}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
