"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, MessageCircle, Clock } from "lucide-react";
import { useApp } from "../i18n/AppContext";

const SOCIAL = [
  { label: "f",  href: "https://facebook.com/soratechci",        hoverColor: "#1877F2" },
  { label: "in", href: "https://linkedin.com/company/soratech",  hoverColor: "#0A66C2" },
  { label: "ig", href: "https://instagram.com/soratechci",       hoverColor: "#E4405F" },
  { label: "wa", href: "https://wa.me/2250704928068",            hoverColor: "#25D366" },
];

export default function Footer() {
  const { t } = useApp();
  const f = t.footer;

  return (
    <footer className="relative border-t py-12 px-6 z-10" style={{ background: "var(--footer-bg)", borderColor: "var(--border)" }}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="text-lg font-black tracking-widest mb-3" style={{ color: "var(--text)" }}>
            SORA<span className="text-[#0099FF]">TECH</span>
          </div>
          <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--muted)" }}>{f.tagline}</p>
          <div className="flex gap-3">
            {SOCIAL.map((s) => (
              <motion.a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.15, backgroundColor: s.hoverColor }} whileTap={{ scale: 0.9 }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer"
                style={{ background: "var(--border)", color: "var(--text)" }}>
                {s.label}
              </motion.a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs tracking-wider mb-3 font-bold" style={{ color: "var(--text)" }}>{f.services}</h4>
          <ul className="space-y-2 text-xs" style={{ color: "var(--muted)" }}>
            {f.serviceLinks.map((s) => (
              <li key={s}><Link href="/services" className="hover:text-[#0099FF] transition">{s}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs tracking-wider mb-3 font-bold" style={{ color: "var(--text)" }}>{f.company}</h4>
          <ul className="space-y-2 text-xs" style={{ color: "var(--muted)" }}>
            {f.companyLinks.map((s) => (
              <li key={s.label}><Link href={s.href} className="hover:text-[#0099FF] transition">{s.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs tracking-wider mb-3 font-bold" style={{ color: "var(--text)" }}>{f.contact}</h4>
          <ul className="space-y-2 text-xs" style={{ color: "var(--muted)" }}>
            <li className="flex items-center gap-2"><MapPin className="w-3 h-3 text-[#0099FF] shrink-0" />Abidjan, Côte d&apos;Ivoire</li>
            <li className="flex items-center gap-2"><Phone className="w-3 h-3 text-[#0099FF] shrink-0" />
              <a href="tel:+2250704928068" className="hover:text-[#0099FF] transition">+225 07 04 92 80 68</a>
            </li>
            <li className="flex items-center gap-2"><Mail className="w-3 h-3 text-[#0099FF] shrink-0" />
              <a href="mailto:contact@soratech.ci" className="hover:text-[#0099FF] transition">contact@soratech.ci</a>
            </li>
            <li className="flex items-center gap-2"><MessageCircle className="w-3 h-3 text-[#25D366] shrink-0" />
              <a href="https://wa.me/2250704928068" target="_blank" rel="noopener" className="hover:text-[#25D366] transition">WhatsApp Business</a>
            </li>
            <li className="flex items-center gap-2"><Clock className="w-3 h-3 shrink-0" style={{ color: "var(--muted)" }} />{f.hours1}</li>
            <li className="flex items-center gap-2"><Clock className="w-3 h-3 shrink-0" style={{ color: "var(--muted)" }} />{f.hours2}</li>
          </ul>
        </div>
      </div>

      <div className="border-t pt-6 text-center" style={{ borderColor: "var(--border)" }}>
        <div className="text-xs" style={{ color: "var(--muted)" }}>{f.rights}</div>
      </div>
    </footer>
  );
}
