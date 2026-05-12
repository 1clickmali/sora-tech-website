"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useApp } from "../i18n/AppContext";
import { postPublicApi } from "@/lib/public-api";

export default function InscriptionPage() {
  const { lang } = useApp();
  const isFr = lang === "fr";
  const router = useRouter();

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError(isFr ? "Les mots de passe ne correspondent pas." : "Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError(isFr ? "Le mot de passe doit contenir au moins 6 caractères." : "Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await postPublicApi("/api/auth/client-register", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      router.push("/mon-compte");
    } catch (err) {
      setError(err instanceof Error ? err.message : (isFr ? "Erreur lors de l'inscription." : "Registration error."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <Navbar active="" />

      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-2xl p-8 border"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <div className="text-center mb-8">
            <div className="text-2xl font-black mb-1">
              SORA<span style={{ color: "#0099FF" }}>TECH</span>
            </div>
            <h1 className="text-xl font-bold mt-4">{isFr ? "Créer mon compte" : "Create my account"}</h1>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              {isFr ? "Suivez vos commandes et devis en temps réel" : "Track your orders and quotes in real time"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder={isFr ? "Nom complet *" : "Full name *"}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none border focus:border-[#0066FF] transition"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
            />
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="Email *"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none border focus:border-[#0066FF] transition"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
            />
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="+225 07 00 00 00 00"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none border focus:border-[#0066FF] transition"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
            />
            <input
              type="password"
              required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder={isFr ? "Mot de passe (min. 6 caractères) *" : "Password (min. 6 chars) *"}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none border focus:border-[#0066FF] transition"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
            />
            <input
              type="password"
              required
              value={form.confirm}
              onChange={e => setForm({ ...form, confirm: e.target.value })}
              placeholder={isFr ? "Confirmer le mot de passe *" : "Confirm password *"}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none border focus:border-[#0066FF] transition"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
            />

            {error && (
              <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/30 rounded-lg px-3 py-2">{error}</p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-3 rounded-xl font-bold text-sm text-white transition"
              style={{ background: loading ? "#1a2540" : "#0066FF" }}
            >
              {loading ? (isFr ? "Création..." : "Creating...") : (isFr ? "Créer mon compte" : "Create account")}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              {isFr ? "Déjà un compte ?" : "Already have an account?"}{" "}
              <Link href="/connexion" className="text-[#0099FF] font-bold hover:underline">
                {isFr ? "Se connecter" : "Log in"}
              </Link>
            </p>
          </div>

          <div className="mt-4 pt-4 border-t text-center" style={{ borderColor: "var(--border)" }}>
            <p className="text-[10px]" style={{ color: "var(--muted)" }}>
              {isFr
                ? "Utilisez le même email que lors de vos commandes pour retrouver l'historique."
                : "Use the same email as your orders to retrieve your history."}
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
