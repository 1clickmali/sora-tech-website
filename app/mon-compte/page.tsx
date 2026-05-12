"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useApp } from "../i18n/AppContext";
import { api } from "@/lib/api";

type User = { id: string; name: string; email: string; role: string };

type Devis = {
  _id: string; reference: string; serviceType: string; status: string;
  estimatedPrice?: number; estimatedDays?: number;
  rdvDate?: string; rdvSlot?: string; rdvType?: string; createdAt: string;
  options?: Record<string, boolean>;
};

type Commande = {
  _id: string; reference: string; trackingCode?: string; trackingUrl?: string;
  items: { title: string; quantity: number; price: number }[];
  total: number; status: string; paymentStatus: string; paymentMode: string;
  refundRequested?: boolean; createdAt: string;
};

const SERVICE_LABEL: Record<string, string> = {
  web: 'Site web', soft: 'Logiciel gestion', app: 'App mobile',
  erp: 'ERP complet', cyber: 'Cybersécurité', maint: 'Maintenance',
};
const DEVIS_STATUS_LABEL: Record<string, string> = {
  nouveau: 'Nouveau', contacte: 'Contacté', accepte: 'Accepté', refuse: 'Refusé', complete: 'Complété',
};
const DEVIS_STATUS_COLOR: Record<string, string> = {
  nouveau: '#00E5FF', contacte: '#F59E0B', accepte: '#10B981', refuse: '#EF4444', complete: '#A855F7',
};
const CMD_STATUS_LABEL: Record<string, string> = {
  nouveau: 'Reçu', confirme: 'Confirmé', en_cours: 'En traitement',
  en_livraison: 'En livraison', livre: 'Livré', annule: 'Annulé',
};
const CMD_STATUS_COLOR: Record<string, string> = {
  nouveau: '#00E5FF', confirme: '#10B981', en_cours: '#F59E0B',
  en_livraison: '#0099FF', livre: '#A855F7', annule: '#EF4444',
};
const fmtPrice = (n?: number) => n ? new Intl.NumberFormat('fr-FR').format(n) + ' FCFA' : '—';
const fmtDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

type RdvEdit = { rdvDate: string; rdvSlot: string; rdvType: string };

const TIME_SLOTS = ["10:00", "11:00", "14:00", "15:00", "16:00"];

export default function MonComptePage() {
  const { lang } = useApp();
  const isFr = lang === "fr";
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<'devis' | 'commandes'>('devis');
  const [devis, setDevis] = useState<Devis[]>([]);
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // RDV edit modal
  const [editingRdv, setEditingRdv] = useState<Devis | null>(null);
  const [rdvEdit, setRdvEdit] = useState<RdvEdit>({ rdvDate: "", rdvSlot: "", rdvType: "visio" });
  const [rdvSaving, setRdvSaving] = useState(false);
  const [rdvError, setRdvError] = useState("");

  // Refund modal
  const [refundCommande, setRefundCommande] = useState<Commande | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const [refundSaving, setRefundSaving] = useState(false);
  const [refundSuccess, setRefundSuccess] = useState(false);

  useEffect(() => {
    api.get<{ success: boolean; user: User }>("/api/auth/me")
      .then(res => {
        if (res.user.role !== "client") {
          router.replace("/admin");
          return;
        }
        setUser(res.user);
        setAuthChecked(true);
      })
      .catch(() => {
        router.replace("/connexion");
      });
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;
    Promise.all([
      api.get<{ success: boolean; data: Devis[] }>("/api/client/devis"),
      api.get<{ success: boolean; data: Commande[] }>("/api/client/commandes"),
    ]).then(([d, c]) => {
      setDevis(d.data || []);
      setCommandes(c.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [authChecked]);

  const logout = async () => {
    await api.post("/api/auth/logout", {}).catch(() => {});
    router.push("/connexion");
  };

  const openRdvEdit = (d: Devis) => {
    setEditingRdv(d);
    setRdvEdit({ rdvDate: d.rdvDate || "", rdvSlot: d.rdvSlot || "10:00", rdvType: d.rdvType || "visio" });
    setRdvError("");
  };

  const saveRdv = async () => {
    if (!editingRdv || !rdvEdit.rdvDate) {
      setRdvError(isFr ? "Veuillez choisir une date." : "Please choose a date.");
      return;
    }
    setRdvSaving(true);
    setRdvError("");
    try {
      const res = await api.patch<{ success: boolean; data: Devis }>(`/api/client/devis/${editingRdv._id}/rdv`, rdvEdit);
      setDevis(prev => prev.map(d => d._id === editingRdv._id ? res.data : d));
      setEditingRdv(null);
    } catch (err) {
      setRdvError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setRdvSaving(false);
    }
  };

  const submitRefund = async () => {
    if (!refundCommande) return;
    setRefundSaving(true);
    try {
      await api.post(`/api/client/commandes/${refundCommande._id}/refund`, { reason: refundReason });
      setCommandes(prev => prev.map(c => c._id === refundCommande._id ? { ...c, refundRequested: true } : c));
      setRefundSuccess(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    } finally {
      setRefundSaving(false);
    }
  };

  const cancelDevis = async (d: Devis) => {
    if (!confirm(isFr ? "Annuler cette demande de devis ?" : "Cancel this quote request?")) return;
    try {
      await api.delete(`/api/client/devis/${d._id}`);
      setDevis(prev => prev.map(x => x._id === d._id ? { ...x, status: "refuse" } : x));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  if (!authChecked || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="text-[#0099FF] font-mono text-sm animate-pulse">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <Navbar active="" />

      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black">{isFr ? "Mon espace client" : "My account"}</h1>
            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>{user?.name} — {user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg text-xs font-medium border transition hover:border-red-400 hover:text-red-400"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
          >
            {isFr ? "Déconnexion" : "Log out"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b pb-2" style={{ borderColor: "var(--border)" }}>
          {(["devis", "commandes"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition"
              style={{
                background: tab === t ? "#0066FF" : "transparent",
                color: tab === t ? "#fff" : "var(--muted)",
              }}
            >
              {t === "devis" ? (isFr ? "Mes devis" : "My quotes") : (isFr ? "Mes commandes" : "My orders")}
              <span className="ml-2 text-[10px] opacity-60">
                ({t === "devis" ? devis.length : commandes.length})
              </span>
            </button>
          ))}
        </div>

        {/* DEVIS TAB */}
        {tab === "devis" && (
          <div className="space-y-3">
            {devis.length === 0 ? (
              <div className="text-center py-20" style={{ color: "var(--muted)" }}>
                <div className="text-4xl mb-3">📋</div>
                <p className="text-sm">{isFr ? "Aucun devis pour le moment." : "No quotes yet."}</p>
                <Link href="/devis" className="mt-4 inline-block text-[#0099FF] text-sm font-bold hover:underline">
                  {isFr ? "Faire une demande →" : "Request a quote →"}
                </Link>
              </div>
            ) : devis.map(d => (
              <motion.div
                key={d._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-5 border"
                style={{ background: "var(--card)", borderColor: "var(--border)" }}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-[#0099FF]">{d.reference}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ background: (DEVIS_STATUS_COLOR[d.status] || '#888') + '22', color: DEVIS_STATUS_COLOR[d.status] || '#888' }}>
                        {DEVIS_STATUS_LABEL[d.status] || d.status}
                      </span>
                    </div>
                    <div className="font-bold">{SERVICE_LABEL[d.serviceType] || d.serviceType}</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                      {isFr ? "Estimé" : "Estimated"} : {fmtPrice(d.estimatedPrice)} — {d.estimatedDays} {isFr ? "j." : "d."}
                    </div>
                    {d.rdvDate && (
                      <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                        📅 {d.rdvDate} {d.rdvSlot ? `à ${d.rdvSlot}` : ""} {d.rdvType === "visio" ? "📹 Visio" : "🏢 Présentiel"}
                      </div>
                    )}
                    <div className="text-[10px] mt-1" style={{ color: "var(--muted)" }}>{fmtDate(d.createdAt)}</div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {!["complete", "refuse"].includes(d.status) && (
                      <button
                        onClick={() => openRdvEdit(d)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition"
                        style={{ background: "#0066FF22", color: "#0099FF", border: "1px solid #0066FF40" }}
                      >
                        ✏️ {isFr ? "Modifier RDV" : "Edit RDV"}
                      </button>
                    )}
                    {["nouveau", "contacte"].includes(d.status) && (
                      <button
                        onClick={() => cancelDevis(d)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition"
                        style={{ background: "#EF444422", color: "#EF4444", border: "1px solid #EF444440" }}
                      >
                        {isFr ? "Annuler" : "Cancel"}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* COMMANDES TAB */}
        {tab === "commandes" && (
          <div className="space-y-3">
            {commandes.length === 0 ? (
              <div className="text-center py-20" style={{ color: "var(--muted)" }}>
                <div className="text-4xl mb-3">🛒</div>
                <p className="text-sm">{isFr ? "Aucune commande pour le moment." : "No orders yet."}</p>
                <Link href="/boutique" className="mt-4 inline-block text-[#0099FF] text-sm font-bold hover:underline">
                  {isFr ? "Voir la boutique →" : "Visit the shop →"}
                </Link>
              </div>
            ) : commandes.map(c => (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-5 border"
                style={{ background: "var(--card)", borderColor: "var(--border)" }}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-[#0099FF]">{c.reference}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ background: (CMD_STATUS_COLOR[c.status] || '#888') + '22', color: CMD_STATUS_COLOR[c.status] || '#888' }}>
                        {CMD_STATUS_LABEL[c.status] || c.status}
                      </span>
                      {c.refundRequested && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-400/20 text-yellow-400 border border-yellow-400/40">
                          {isFr ? "Remboursement demandé" : "Refund requested"}
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-sm">{c.items.map(i => `${i.title} ×${i.quantity}`).join(", ")}</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                      {isFr ? "Total" : "Total"} : {fmtPrice(c.total)}
                    </div>
                    {c.trackingCode && (
                      <Link href={`/suivi/${c.trackingCode}`} className="text-xs text-[#0099FF] hover:underline mt-1 inline-block">
                        📦 {isFr ? "Suivre ma commande" : "Track order"} — {c.trackingCode}
                      </Link>
                    )}
                    <div className="text-[10px] mt-1" style={{ color: "var(--muted)" }}>{fmtDate(c.createdAt)}</div>
                  </div>
                  <div className="flex gap-2">
                    {!["livre", "annule"].includes(c.status) && !c.refundRequested && (
                      <button
                        onClick={() => { setRefundCommande(c); setRefundReason(""); setRefundSuccess(false); }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition"
                        style={{ background: "#F59E0B22", color: "#F59E0B", border: "1px solid #F59E0B40" }}
                      >
                        💸 {isFr ? "Remboursement" : "Refund"}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* RDV Edit Modal */}
      <AnimatePresence>
        {editingRdv && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.75)" }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md rounded-2xl p-6 border"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold">{isFr ? "Modifier mon RDV" : "Edit my RDV"}</h3>
                <button onClick={() => setEditingRdv(null)} className="text-gray-400 hover:text-white">✕</button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide mb-1 block" style={{ color: "var(--muted)" }}>
                    {isFr ? "Nouvelle date" : "New date"}
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={rdvEdit.rdvDate}
                    onChange={e => setRdvEdit({ ...rdvEdit, rdvDate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none border focus:border-[#0066FF] transition"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wide mb-1 block" style={{ color: "var(--muted)" }}>
                    {isFr ? "Créneau horaire" : "Time slot"}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map(slot => (
                      <button
                        key={slot}
                        onClick={() => setRdvEdit({ ...rdvEdit, rdvSlot: slot })}
                        className={`py-2 rounded-lg text-xs font-bold transition border font-mono ${
                          rdvEdit.rdvSlot === slot ? "bg-[#0066FF] text-white border-transparent" : "border-[#1a2540] text-[#8899BB] hover:border-[#0066FF]"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wide mb-1 block" style={{ color: "var(--muted)" }}>
                    {isFr ? "Type de rendez-vous" : "Meeting type"}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["visio", "presentiel"] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => setRdvEdit({ ...rdvEdit, rdvType: type })}
                        className={`py-2.5 rounded-lg text-xs font-bold transition border ${
                          rdvEdit.rdvType === type ? "bg-[#0066FF] text-white border-transparent" : "border-[#1a2540] text-[#8899BB] hover:border-[#0066FF]"
                        }`}
                      >
                        {type === "visio" ? "📹 Vidéo conférence" : "🏢 Présentiel"}
                      </button>
                    ))}
                  </div>
                </div>

                {rdvError && <p className="text-red-400 text-xs">{rdvError}</p>}

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setEditingRdv(null)}
                    className="flex-1 py-2.5 rounded-lg text-xs font-bold border transition"
                    style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                  >
                    {isFr ? "Annuler" : "Cancel"}
                  </button>
                  <button
                    onClick={saveRdv}
                    disabled={rdvSaving}
                    className="flex-1 py-2.5 rounded-lg text-xs font-bold text-white transition"
                    style={{ background: rdvSaving ? "#1a2540" : "#0066FF" }}
                  >
                    {rdvSaving ? "..." : (isFr ? "Sauvegarder" : "Save")}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Refund Modal */}
      <AnimatePresence>
        {refundCommande && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.75)" }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md rounded-2xl p-6 border"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              {refundSuccess ? (
                <div className="text-center py-4">
                  <div className="text-4xl mb-3">✅</div>
                  <h3 className="font-bold text-[#00C48C] mb-2">{isFr ? "Demande envoyée !" : "Request sent!"}</h3>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    {isFr ? "Notre équipe vous contactera sous 24h pour traiter votre remboursement." : "Our team will contact you within 24h to process your refund."}
                  </p>
                  <button
                    onClick={() => setRefundCommande(null)}
                    className="mt-4 px-6 py-2 rounded-lg text-xs font-bold bg-[#0066FF] text-white"
                  >
                    OK
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold">{isFr ? "Demander un remboursement" : "Request a refund"}</h3>
                    <button onClick={() => setRefundCommande(null)} className="text-gray-400 hover:text-white">✕</button>
                  </div>

                  <div className="rounded-xl p-3 mb-4 border" style={{ background: "#F59E0B10", borderColor: "#F59E0B40" }}>
                    <p className="text-xs text-yellow-400 font-medium">
                      ⚠️ {isFr ? "Le remboursement est uniquement possible avant la livraison." : "Refunds are only possible before delivery."}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wide mb-1 block" style={{ color: "var(--muted)" }}>
                        {isFr ? "Raison (facultatif)" : "Reason (optional)"}
                      </label>
                      <textarea
                        value={refundReason}
                        onChange={e => setRefundReason(e.target.value)}
                        rows={3}
                        placeholder={isFr ? "Expliquez pourquoi vous souhaitez un remboursement..." : "Explain why you want a refund..."}
                        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none border focus:border-[#F59E0B] transition resize-none"
                        style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => setRefundCommande(null)}
                        className="flex-1 py-2.5 rounded-lg text-xs font-bold border transition"
                        style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                      >
                        {isFr ? "Annuler" : "Cancel"}
                      </button>
                      <button
                        onClick={submitRefund}
                        disabled={refundSaving}
                        className="flex-1 py-2.5 rounded-lg text-xs font-bold text-white transition"
                        style={{ background: refundSaving ? "#1a2540" : "#F59E0B" }}
                      >
                        {refundSaving ? "..." : (isFr ? "Envoyer la demande" : "Send request")}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
