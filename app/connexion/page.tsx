"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useApp } from "../i18n/AppContext";
import { postPublicApi } from "@/lib/public-api";

export default function ConnexionPage() {
  const { lang } = useApp();
  const isFr = lang === "fr";
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await postPublicApi<{ success: boolean; user: { role: string } }>("/api/auth/login", {
        email: form.email,
        password: form.password,
      });
      if (res.user.role === "client") {
        router.push("/mon-compte");
      } else {
        router.push("/admin");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : (isFr ? "Email ou mot de passe incorrect." : "Incorrect email or password."));
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
            <h1 className="text-xl font-bold mt-4">{isFr ? "Se connecter" : "Log in"}</h1>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              {isFr ? "Accédez à votre espace personnel" : "Access your personal dashboard"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              type="password"
              required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder={isFr ? "Mot de passe *" : "Password *"}
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
              {loading ? (isFr ? "Connexion..." : "Logging in...") : (isFr ? "Se connecter" : "Log in")}
            </motion.button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              {isFr ? "Pas encore de compte ?" : "No account yet?"}{" "}
              <Link href="/inscription" className="text-[#0099FF] font-bold hover:underline">
                {isFr ? "S'inscrire" : "Sign up"}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
