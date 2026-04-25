"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, MessageCircle, Clock } from "lucide-react";

const SOCIAL = [
  { label: "f",  href: "https://facebook.com/soratechci",        hoverColor: "#1877F2" },
  { label: "in", href: "https://linkedin.com/company/soratech",  hoverColor: "#0A66C2" },
  { label: "ig", href: "https://instagram.com/soratechci",       hoverColor: "#E4405F" },
  { label: "wa", href: "https://wa.me/2250704928068",            hoverColor: "#25D366" },
];

const SERVICES_LINKS = [
  "Sites web", "Logiciels de gestion", "Applications mobiles",
  "ERP entreprise", "Cybersécurité", "Maintenance",
];

const COMPANY_LINKS = [
  { label: "À propos de nous",  href: "/about"    },
  { label: "Blog SORA TECH",    href: "/blog"     },
  { label: "Nos réalisations",  href: "/projets"  },
  { label: "Boutique digitale", href: "/boutique" },
  { label: "Devis & RDV",       href: "/devis"    },
  { label: "Contact",           href: "/contact"  },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#040A14] border-t border-[#1a2540] py-12 px-6 z-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="text-lg font-black tracking-widest mb-3">SORA<span className="text-[#0099FF]">TECH</span></div>
          <p className="text-xs text-[#8899BB] leading-relaxed mb-4">
            Entreprise tech panafricaine qui digitalise les entreprises d&apos;Abidjan et de toute l&apos;Afrique de l&apos;Ouest.
          </p>
          <div className="flex gap-3">
            {SOCIAL.map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.15, backgroundColor: s.hoverColor }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 bg-[#1a2540] rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                {s.label}
              </motion.a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs tracking-wider text-white mb-3 font-bold">SERVICES</h4>
          <ul className="space-y-2 text-xs text-[#8899BB]">
            {SERVICES_LINKS.map((s) => (
              <li key={s}>
                <Link href="/services" className="hover:text-[#0099FF] transition">{s}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs tracking-wider text-white mb-3 font-bold">ENTREPRISE</h4>
          <ul className="space-y-2 text-xs text-[#8899BB]">
            {COMPANY_LINKS.map((s) => (
              <li key={s.label}>
                <Link href={s.href} className="hover:text-[#0099FF] transition">{s.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs tracking-wider text-white mb-3 font-bold">CONTACT</h4>
          <ul className="space-y-2 text-xs text-[#8899BB]">
            <li className="flex items-center gap-2">
              <MapPin className="w-3 h-3 text-[#0099FF] shrink-0" />
              Abidjan, Côte d&apos;Ivoire
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-3 h-3 text-[#0099FF] shrink-0" />
              <a href="tel:+2250704928068" className="hover:text-[#0099FF] transition">+225 07 04 92 80 68</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-3 h-3 text-[#0099FF] shrink-0" />
              <a href="mailto:contact@soratech.ci" className="hover:text-[#0099FF] transition">contact@soratech.ci</a>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="w-3 h-3 text-[#25D366] shrink-0" />
              <a href="https://wa.me/2250704928068" target="_blank" rel="noopener" className="hover:text-[#25D366] transition">WhatsApp Business</a>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-[#8899BB] shrink-0" />
              Lun-Ven : 8h-18h
            </li>
            <li className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-[#8899BB] shrink-0" />
              Sam : 9h-14h
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#1a2540] pt-6 text-center">
        <div className="text-xs text-[#8899BB]">© 2026 SORA TECH COMPANY — Tous droits réservés</div>
      </div>
    </footer>
  );
}
