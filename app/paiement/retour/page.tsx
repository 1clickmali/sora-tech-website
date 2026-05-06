"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { fetchPublicApi } from "@/lib/public-api";

type PaymentReturnData = {
  reference: string;
  trackingCode?: string;
  trackingUrl?: string;
  total: number;
  status: string;
  paymentMode: string;
  paymentStatus: string;
  paymentProvider?: string;
  paymentMethod?: string;
  paymentReference?: string;
  paymentCheckoutUrl?: string;
  facturePublicToken?: string;
};

type PaymentReturnResponse = {
  success: boolean;
  data: PaymentReturnData;
};

const fmt = (value: number) => `${new Intl.NumberFormat("fr-FR").format(value || 0)} FCFA`;

function LoadingShell() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <Navbar active="boutique" />
      <section className="relative py-20 px-6">
        <div className="max-w-3xl mx-auto rounded-3xl border p-8 md:p-10" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="text-[11px] tracking-[4px] text-[#0099FF] font-mono mb-3">{"// RETOUR_PAIEMENT"}</div>
          <h1 className="text-3xl md:text-4xl font-black mb-3">Paiement de votre commande</h1>
          <p className="text-sm md:text-base" style={{ color: "var(--muted)" }}>
            Vérification du paiement en cours...
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function PaymentReturnContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const statusHint = searchParams.get("status") || "";

  const [data, setData] = useState<PaymentReturnData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetchPublicApi<PaymentReturnResponse>(`/api/commandes/payment-return/${token}`);
        if (cancelled) return;
        setData(response.data);

        if (
          response.data.paymentMode === "online" &&
          response.data.paymentStatus !== "paid" &&
          (statusHint === "success" || response.data.paymentStatus === "pending" || response.data.paymentStatus === "processing")
        ) {
          setRefreshing(true);
          const refreshed = await fetchPublicApi<PaymentReturnResponse>(`/api/commandes/payment-return/${token}/refresh`, {
            method: "POST",
          });
          if (cancelled) return;
          setData(refreshed.data);
        }
      } catch (reason) {
        if (!cancelled) {
          setError(reason instanceof Error ? reason.message : "Impossible de vérifier le paiement.");
        }
      } finally {
        if (!cancelled) {
          setRefreshing(false);
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [statusHint, token]);

  const refreshPayment = async () => {
    if (!token) return;
    try {
      setRefreshing(true);
      setError("");
      const response = await fetchPublicApi<PaymentReturnResponse>(`/api/commandes/payment-return/${token}/refresh`, {
        method: "POST",
      });
      setData(response.data);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Impossible de rafraîchir le paiement.");
    } finally {
      setRefreshing(false);
    }
  };

  const invalidToken = !token;
  const paid = data?.paymentStatus === "paid";
  const pending = data?.paymentStatus === "pending" || data?.paymentStatus === "processing";
  const failed = Boolean(data && ["failed", "cancelled", "expired", "refunded"].includes(data.paymentStatus));

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <Navbar active="boutique" />

      <section className="relative py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border p-8 md:p-10"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <div className="text-[11px] tracking-[4px] text-[#0099FF] font-mono mb-3">{"// RETOUR_PAIEMENT"}</div>
            <h1 className="text-3xl md:text-4xl font-black mb-3">Paiement de votre commande</h1>
            <p className="text-sm md:text-base" style={{ color: "var(--muted)" }}>
              Nous vérifions le statut réel du paiement côté serveur avant d’afficher le résultat.
            </p>

            {loading ? (
              <div className="mt-8 rounded-2xl border p-6 text-sm" style={{ borderColor: "var(--border2)", background: "var(--bg2)" }}>
                Vérification du paiement en cours...
              </div>
            ) : invalidToken ? (
              <div className="mt-8 rounded-2xl border p-6 text-sm text-red-300" style={{ borderColor: "rgba(239,68,68,0.35)", background: "rgba(127,29,29,0.18)" }}>
                Lien de retour de paiement invalide.
              </div>
            ) : error ? (
              <div className="mt-8 rounded-2xl border p-6 text-sm text-red-300" style={{ borderColor: "rgba(239,68,68,0.35)", background: "rgba(127,29,29,0.18)" }}>
                {error}
              </div>
            ) : data ? (
              <>
                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border p-4" style={{ borderColor: "var(--border2)", background: "var(--bg2)" }}>
                    <div className="text-[11px] uppercase tracking-widest text-[#8899BB] mb-1">Référence</div>
                    <div className="font-mono font-bold text-[#00E5FF]">{data.reference}</div>
                  </div>
                  <div className="rounded-2xl border p-4" style={{ borderColor: "var(--border2)", background: "var(--bg2)" }}>
                    <div className="text-[11px] uppercase tracking-widest text-[#8899BB] mb-1">Montant</div>
                    <div className="font-mono font-bold">{fmt(data.total)}</div>
                  </div>
                  <div className="rounded-2xl border p-4" style={{ borderColor: "var(--border2)", background: "var(--bg2)" }}>
                    <div className="text-[11px] uppercase tracking-widest text-[#8899BB] mb-1">Paiement</div>
                    <div
                      className="font-bold"
                      style={{
                        color: paid ? "#10B981" : pending ? "#00E5FF" : failed ? "#F97316" : "#E2E8F0",
                      }}
                    >
                      {paid ? "Confirmé" : pending ? "En attente" : failed ? "Non abouti" : data.paymentStatus}
                    </div>
                  </div>
                </div>

                {paid && (
                  <div className="mt-6 rounded-2xl border p-6" style={{ borderColor: "rgba(16,185,129,0.35)", background: "rgba(6,95,70,0.16)" }}>
                    <div className="text-xl font-black text-[#10B981] mb-2">Paiement confirmé</div>
                    <p className="text-sm" style={{ color: "var(--muted)" }}>
                      Votre commande est bien enregistrée. Vous pouvez suivre son évolution en temps réel.
                    </p>
                  </div>
                )}

                {pending && (
                  <div className="mt-6 rounded-2xl border p-6" style={{ borderColor: "rgba(0,229,255,0.35)", background: "rgba(8,47,73,0.22)" }}>
                    <div className="text-xl font-black text-[#00E5FF] mb-2">Paiement en cours de confirmation</div>
                    <p className="text-sm" style={{ color: "var(--muted)" }}>
                      Le paiement a été initié. Si vous venez juste de payer, attendez quelques secondes puis actualisez.
                    </p>
                  </div>
                )}

                {failed && (
                  <div className="mt-6 rounded-2xl border p-6" style={{ borderColor: "rgba(249,115,22,0.35)", background: "rgba(124,45,18,0.18)" }}>
                    <div className="text-xl font-black text-[#FB923C] mb-2">Paiement non confirmé</div>
                    <p className="text-sm" style={{ color: "var(--muted)" }}>
                      Le paiement n’a pas abouti ou a été annulé. Vous pouvez revenir à la boutique et relancer une nouvelle commande.
                    </p>
                  </div>
                )}

                <div className="mt-8 flex flex-wrap gap-3">
                  {paid && data.trackingUrl && (
                    <a
                      href={data.trackingUrl}
                      className="px-5 py-3 rounded-xl bg-[#0066FF] text-white text-sm font-bold"
                    >
                      Voir le suivi
                    </a>
                  )}

                  {paid && data.facturePublicToken && (
                    <a
                      href={`/api/factures/public/${data.facturePublicToken}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-3 rounded-xl border text-sm font-bold"
                      style={{ borderColor: "var(--border2)" }}
                    >
                      Télécharger la facture
                    </a>
                  )}

                  {pending && (
                    <button
                      onClick={refreshPayment}
                      disabled={refreshing}
                      className="px-5 py-3 rounded-xl bg-[#0066FF] text-white text-sm font-bold disabled:opacity-70"
                    >
                      {refreshing ? "Vérification..." : "Actualiser le paiement"}
                    </button>
                  )}

                  {pending && data.paymentCheckoutUrl && (
                    <a
                      href={data.paymentCheckoutUrl}
                      className="px-5 py-3 rounded-xl border text-sm font-bold"
                      style={{ borderColor: "var(--border2)" }}
                    >
                      Continuer le paiement
                    </a>
                  )}

                  <Link
                    href={paid && data.trackingCode ? `/suivi/${data.trackingCode}` : "/boutique"}
                    className="px-5 py-3 rounded-xl border text-sm font-bold"
                    style={{ borderColor: "var(--border2)" }}
                  >
                    {paid ? "Ouvrir le suivi" : "Retour à la boutique"}
                  </Link>
                </div>
              </>
            ) : null}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function PaiementRetourPage() {
  return (
    <Suspense fallback={<LoadingShell />}>
      <PaymentReturnContent />
    </Suspense>
  );
}
