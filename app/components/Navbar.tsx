"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useApp } from "../i18n/AppContext";
import MobileMenu from "./MobileMenu";

type NavId = "home" | "services" | "about" | "blog" | "projets" | "boutique" | "devis" | "contact" | "suivi";

export default function Navbar({ active }: { active: NavId }) {
  const { t, lang, theme, toggleLang, toggleTheme } = useApp();

  const links: { href: string; label: string; id: NavId; highlight?: string }[] = [
    { href: "/",         label: t.nav.home,     id: "home" },
    { href: "/services", label: t.nav.services,  id: "services" },
    { href: "/about",    label: t.nav.about,     id: "about" },
    { href: "/blog",     label: t.nav.blog,      id: "blog" },
    { href: "/projets",  label: t.nav.projets,   id: "projets" },
    { href: "/boutique", label: t.nav.boutique,  id: "boutique" },
    { href: "/devis",    label: t.nav.devis,     id: "devis" },
    { href: "/contact",  label: t.nav.contact,   id: "contact" },
    { href: "/suivi",    label: t.nav.suivi,     id: "suivi", highlight: "#00C48C" },
  ];

  return (
    <nav
      className="relative border-b px-6 md:px-12 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-xl"
      style={{ borderColor: "var(--border)", background: "var(--nav-bg)" }}
    >
      <Link href="/" className="text-xl font-black tracking-[3px]" style={{ color: "var(--text)" }}>
        SORA<span className="text-[#0099FF]">TECH</span>
      </Link>

      <div className="hidden lg:flex items-center gap-5">
        {links.map((l) => (
          <Link
            key={l.id}
            href={l.href}
            className="text-xs uppercase tracking-widest transition font-bold"
            style={{
              color: active === l.id
                ? (l.highlight || "#0099FF")
                : (l.highlight && active !== l.id ? l.highlight : "var(--muted)"),
            }}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {/* Lang toggle */}
        <button
          onClick={toggleLang}
          className="text-xs font-black tracking-widest px-3 py-1.5 rounded-lg border transition"
          style={{
            color: "#0099FF",
            borderColor: "var(--border)",
            background: "var(--card)",
          }}
          aria-label="Switch language"
        >
          {lang === "fr" ? "EN" : "FR"}
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-lg border transition"
          style={{ borderColor: "var(--border)", background: "var(--card)", color: "var(--muted)" }}
          aria-label="Toggle theme"
        >
          {theme === "dark"
            ? <Sun className="w-4 h-4 text-yellow-400" />
            : <Moon className="w-4 h-4 text-[#0099FF]" />
          }
        </button>

        <motion.a
          href="tel:+2250704928068"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden sm:block bg-[#0066FF] hover:bg-[#0099FF] transition px-4 py-2 rounded-md text-xs font-bold text-white tracking-wide"
        >
          +225 07 04 92 80 68
        </motion.a>

        <MobileMenu active={active} />
      </div>
    </nav>
  );
}
