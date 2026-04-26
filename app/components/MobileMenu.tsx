"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  Home, Wrench, Info, BookOpen, FolderOpen,
  ShoppingBag, Calendar, Mail, X, Menu, Phone, MessageCircle, Package,
  type LucideIcon
} from "lucide-react";
import { useApp } from "../i18n/AppContext";

type NavId = "home" | "services" | "about" | "blog" | "projets" | "boutique" | "devis" | "contact" | "suivi";

export default function MobileMenu({ active }: { active: NavId | string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useApp();

  const links: { href: string; label: string; id: NavId; icon: LucideIcon; color: string }[] = [
    { href: "/",          label: t.mobile.home,      id: "home",     icon: Home,        color: "#0099FF" },
    { href: "/services",  label: t.mobile.services,  id: "services", icon: Wrench,      color: "#FF6B00" },
    { href: "/about",     label: t.mobile.about,     id: "about",    icon: Info,        color: "#0099FF" },
    { href: "/blog",      label: t.mobile.blog,      id: "blog",     icon: BookOpen,    color: "#9B93FF" },
    { href: "/projets",   label: t.mobile.projets,   id: "projets",  icon: FolderOpen,  color: "#00C48C" },
    { href: "/boutique",  label: t.mobile.boutique,  id: "boutique", icon: ShoppingBag, color: "#FF6B00" },
    { href: "/devis",     label: t.mobile.devis,     id: "devis",    icon: Calendar,    color: "#0066FF" },
    { href: "/contact",   label: t.mobile.contact,   id: "contact",  icon: Mail,        color: "#00FF88" },
    { href: "/suivi",     label: t.mobile.suivi,     id: "suivi",    icon: Package,     color: "#00C48C" },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl hover:border-[#0099FF] hover:shadow-[0_0_15px_rgba(0,153,255,0.3)] transition-all duration-200 border"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
        aria-label="Menu"
      >
        <motion.div className="absolute" animate={isOpen ? { opacity: 0, rotate: 90, scale: 0.5 } : { opacity: 1, rotate: 0, scale: 1 }} transition={{ duration: 0.2 }}>
          <Menu className="w-5 h-5 text-[#0099FF]" />
        </motion.div>
        <motion.div className="absolute" animate={isOpen ? { opacity: 1, rotate: 0, scale: 1 } : { opacity: 0, rotate: -90, scale: 0.5 }} transition={{ duration: 0.2 }}>
          <X className="w-5 h-5 text-[#FF4757]" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md z-[100] lg:hidden"
            />
            <motion.div
              initial={{ x: "100%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="fixed right-0 top-0 h-screen w-[88%] max-w-[340px] z-[101] lg:hidden flex flex-col"
              style={{ background: "var(--bg)", borderLeft: "1px solid rgba(0,153,255,0.25)", boxShadow: "-10px 0 50px rgba(0,153,255,0.12)" }}
            >
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#0099FF] to-transparent" />
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div animate={{ y: ["-5%", "105%"] }} transition={{ duration: 10, repeat: Infinity, ease: "linear", repeatDelay: 5 }}
                  className="absolute left-0 right-0 h-[1px]" style={{ background: "linear-gradient(90deg, transparent, rgba(0,153,255,0.5), transparent)" }} />
              </div>

              <div className="flex items-center justify-between px-5 py-4 flex-shrink-0 border-b" style={{ borderColor: "var(--border)" }}>
                <div>
                  <div className="text-lg font-black tracking-[3px]" style={{ color: "var(--text)" }}>
                    SORA<span className="text-[#0099FF]">TECH</span>
                  </div>
                  <div className="text-[9px] font-mono text-[#0099FF]/60 tracking-[3px] mt-0.5">NAVIGATION_SYS_v2.5</div>
                </div>
                <button onClick={() => setIsOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl hover:border-[#FF4757]/60 hover:bg-[#FF4757]/10 transition-all border"
                  style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  <X className="w-4 h-4" style={{ color: "var(--muted)" }} />
                </button>
              </div>

              <nav className="flex-1 px-3 py-3 space-y-1 overflow-hidden">
                {links.map((link, i) => {
                  const isActive = active === link.id;
                  const Icon = link.icon;
                  return (
                    <motion.div key={link.id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04, duration: 0.3, ease: "easeOut" }}>
                      <Link href={link.href} onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group"
                        style={isActive ? { backgroundColor: `${link.color}12`, border: `1px solid ${link.color}50`, boxShadow: `0 0 15px ${link.color}15` } : { border: "1px solid transparent" }}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
                          style={isActive ? { backgroundColor: `${link.color}20`, border: `1px solid ${link.color}40`, boxShadow: `0 0 12px ${link.color}25` } : { background: "var(--card)", border: "1px solid var(--border)" }}>
                          <Icon className="w-4 h-4 transition-all duration-200" style={{ color: isActive ? link.color : "var(--muted)" }} />
                        </div>
                        <span className="text-sm font-bold tracking-wide flex-1 transition-colors duration-200" style={{ color: isActive ? "var(--text)" : "var(--muted)" }}>
                          {link.label}
                        </span>
                        {isActive && (
                          <motion.div layoutId="activeIndicator" className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: link.color, boxShadow: `0 0 8px ${link.color}` }} />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="px-3 pb-4 pt-3 space-y-2 flex-shrink-0 border-t" style={{ borderColor: "var(--border)" }}>
                <a href="tel:+2250704928068"
                  className="flex items-center gap-3 w-full bg-[#0066FF] hover:bg-[#0099FF] transition-all py-3 px-4 rounded-xl font-bold text-sm text-white"
                  style={{ boxShadow: "0 4px 20px rgba(0,102,255,0.35)" }}>
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>+225 07 04 92 80 68</span>
                </a>
                <a href="https://wa.me/2250704928068" target="_blank" rel="noopener"
                  className="flex items-center gap-3 w-full bg-[#25D366] hover:bg-[#1fb857] transition-all py-3 px-4 rounded-xl font-bold text-sm text-white">
                  <MessageCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{t.mobile.whatsapp}</span>
                </a>
                <div className="text-[9px] text-center font-mono tracking-[2px] pt-1" style={{ color: "var(--muted)" }}>
                  SORA_TECH_COMPANY © 2025
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
