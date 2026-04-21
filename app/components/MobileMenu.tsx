"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  Home, Wrench, Info, BookOpen, FolderOpen,
  ShoppingBag, Calendar, Mail, X, Menu, Phone, MessageCircle,
  type LucideIcon
} from "lucide-react";

const links: { href: string; label: string; id: string; icon: LucideIcon; color: string }[] = [
  { href: "/",          label: "Accueil",    id: "home",     icon: Home,        color: "#0099FF" },
  { href: "/services",  label: "Services",   id: "services", icon: Wrench,      color: "#FF6B00" },
  { href: "/about",     label: "À propos",   id: "about",    icon: Info,        color: "#0099FF" },
  { href: "/blog",      label: "Blog",       id: "blog",     icon: BookOpen,    color: "#9B93FF" },
  { href: "/projets",   label: "Projets",    id: "projets",  icon: FolderOpen,  color: "#00C48C" },
  { href: "/boutique",  label: "Boutique",   id: "boutique", icon: ShoppingBag, color: "#FF6B00" },
  { href: "/devis",     label: "Devis & RDV",id: "devis",    icon: Calendar,    color: "#0066FF" },
  { href: "/contact",   label: "Contact",    id: "contact",  icon: Mail,        color: "#00FF88" },
];

export default function MobileMenu({ active }: { active: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* BOUTON HAMBURGER */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden relative w-10 h-10 flex items-center justify-center bg-[#0A1525] border border-[#1a2540] rounded-xl hover:border-[#0099FF] hover:shadow-[0_0_15px_rgba(0,153,255,0.3)] transition-all duration-200"
        aria-label="Menu"
      >
        <motion.div
          className="absolute"
          animate={isOpen ? { opacity: 0, rotate: 90, scale: 0.5 } : { opacity: 1, rotate: 0, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Menu className="w-5 h-5 text-[#0099FF]" />
        </motion.div>
        <motion.div
          className="absolute"
          animate={isOpen ? { opacity: 1, rotate: 0, scale: 1 } : { opacity: 0, rotate: -90, scale: 0.5 }}
          transition={{ duration: 0.2 }}
        >
          <X className="w-5 h-5 text-[#FF4757]" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* OVERLAY */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md z-[100] lg:hidden"
            />

            {/* PANEL */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="fixed right-0 top-0 h-screen w-[88%] max-w-[340px] bg-[#060D1F] z-[101] lg:hidden flex flex-col"
              style={{ borderLeft: "1px solid rgba(0,153,255,0.25)", boxShadow: "-10px 0 50px rgba(0,153,255,0.12)" }}
            >
              {/* LIGNE NÉON TOP */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#0099FF] to-transparent" />

              {/* SCAN LINE */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                  animate={{ y: ["-5%", "105%"] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear", repeatDelay: 5 }}
                  className="absolute left-0 right-0 h-[1px]"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(0,153,255,0.5), transparent)" }}
                />
              </div>

              {/* HEADER */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a2540]/80 flex-shrink-0">
                <div>
                  <div className="text-lg font-black tracking-[3px]">
                    SORA<span className="text-[#0099FF]">TECH</span>
                  </div>
                  <div className="text-[9px] font-mono text-[#0099FF]/60 tracking-[3px] mt-0.5">
                    NAVIGATION_SYS_v2.5
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 flex items-center justify-center bg-[#0A1525] border border-[#1a2540] rounded-xl hover:border-[#FF4757]/60 hover:bg-[#FF4757]/10 transition-all"
                >
                  <X className="w-4 h-4 text-[#8899BB] hover:text-[#FF4757]" />
                </button>
              </div>

              {/* LIENS DE NAVIGATION */}
              <nav className="flex-1 px-3 py-3 space-y-1 overflow-hidden">
                {links.map((link, i) => {
                  const isActive = active === link.id;
                  const Icon = link.icon;
                  return (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3, ease: "easeOut" }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group"
                        style={isActive ? {
                          backgroundColor: `${link.color}12`,
                          border: `1px solid ${link.color}50`,
                          boxShadow: `0 0 15px ${link.color}15`,
                        } : {
                          border: "1px solid transparent",
                        }}
                      >
                        {/* ICÔNE */}
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
                          style={isActive ? {
                            backgroundColor: `${link.color}20`,
                            border: `1px solid ${link.color}40`,
                            boxShadow: `0 0 12px ${link.color}25`,
                          } : {
                            backgroundColor: "#0A1525",
                            border: "1px solid #1a2540",
                          }}
                        >
                          <Icon
                            className="w-4 h-4 transition-all duration-200"
                            style={{ color: isActive ? link.color : "#8899BB" }}
                          />
                        </div>

                        {/* LABEL */}
                        <span
                          className="text-sm font-bold tracking-wide flex-1 transition-colors duration-200"
                          style={{ color: isActive ? "#fff" : "#8899BB" }}
                        >
                          {link.label}
                        </span>

                        {/* INDICATEUR ACTIF */}
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: link.color, boxShadow: `0 0 8px ${link.color}` }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* FOOTER CTA */}
              <div className="px-3 pb-4 pt-3 border-t border-[#1a2540]/80 space-y-2 flex-shrink-0">
                <a href="tel:+22507000000" className="flex items-center gap-3 w-full bg-[#0066FF] hover:bg-[#0099FF] transition-all py-3 px-4 rounded-xl font-bold text-sm" style={{ boxShadow: "0 4px 20px rgba(0,102,255,0.35)" }}>
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>+225 07 00 00 00</span>
                </a>
                <a href="https://wa.me/22507000000" target="_blank" rel="noopener" className="flex items-center gap-3 w-full bg-[#25D366] hover:bg-[#1fb857] transition-all py-3 px-4 rounded-xl font-bold text-sm">
                  <MessageCircle className="w-4 h-4 flex-shrink-0" />
                  <span>WhatsApp Business</span>
                </a>
                <div className="text-[9px] text-[#8899BB] text-center font-mono tracking-[2px] pt-1">
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
