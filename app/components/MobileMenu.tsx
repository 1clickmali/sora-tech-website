"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function MobileMenu({ active }: { active: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Accueil", id: "home" },
    { href: "/services", label: "Services", id: "services" },
    { href: "/about", label: "À propos", id: "about" },
    { href: "/blog", label: "Blog", id: "blog" },
    { href: "/projets", label: "Projets", id: "projets" },
    { href: "/boutique", label: "Boutique", id: "boutique" },
    { href: "/devis", label: "Devis & RDV", id: "devis" },
    { href: "/contact", label: "Contact", id: "contact" },
  ];

  return (
    <>
      {/* BOUTON HAMBURGER */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 bg-[#0A1525] border border-[#1a2540] rounded-lg hover:border-[#0066FF] transition"
        aria-label="Menu"
      >
        <motion.span
          animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
          className="w-5 h-0.5 bg-white block"
        />
        <motion.span
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          className="w-5 h-0.5 bg-white block"
        />
        <motion.span
          animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
          className="w-5 h-0.5 bg-white block"
        />
      </button>

      {/* MENU PLEIN ÉCRAN */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-[#060D1F] border-l border-[#1a2540] z-[101] lg:hidden flex flex-col"
            >
              {/* HEADER */}
              <div className="flex items-center justify-between p-6 border-b border-[#1a2540]">
                <div className="text-lg font-black tracking-[3px]">
                  SORA<span className="text-[#0099FF]">TECH</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 flex items-center justify-center bg-[#0A1525] border border-[#1a2540] rounded-lg text-xl hover:bg-[#1a2540] transition"
                >
                  ×
                </button>
              </div>

              {/* LIENS */}
              <nav className="flex-1 overflow-y-auto p-6">
                <div className="space-y-2">
                  {links.map((link, i) => (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`block px-4 py-4 rounded-xl text-base font-bold tracking-wide transition ${
                          active === link.id
                            ? "bg-[#0066FF] text-white"
                            : "bg-[#0A1525] border border-[#1a2540] text-[#8899BB] hover:border-[#0066FF] hover:text-white"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </nav>

              {/* FOOTER CTA */}
              <div className="p-6 border-t border-[#1a2540] space-y-3">
                <a href="tel:+2250700000000" className="block">
                  <motion.button whileTap={{ scale: 0.98 }} className="w-full bg-[#0066FF] py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2">
                    📞 +225 07 00 00 00
                  </motion.button>
                </a>
                <a href="https://wa.me/22507000000" target="_blank" rel="noopener" className="block">
                  <motion.button whileTap={{ scale: 0.98 }} className="w-full bg-[#25D366] py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2">
                    💬 WhatsApp Business
                  </motion.button>
                </a>
                <div className="text-[10px] text-[#8899BB] text-center pt-2">
                  SORA TECH COMPANY © 2025
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}