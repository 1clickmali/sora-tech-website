'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { useApp } from '../i18n/AppContext';

export default function SuiviSearchPage() {
  const { t } = useApp();
  const s = t.suivi;
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = code.trim().toUpperCase();
    if (!clean) { setError(s.errEmpty); return; }
    if (!clean.startsWith('STC-') && !clean.startsWith('CMD-')) {
      setError(s.errFormat);
      return;
    }
    router.push(`/suivi/${clean}`);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.07]"
        style={{ backgroundImage: 'linear-gradient(#0099FF 1px,transparent 1px),linear-gradient(90deg,#0099FF 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

      <Navbar active="suivi" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-8"
            style={{ background: '#0099FF15', border: '1px solid #0099FF40', color: '#0099FF' }}>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            {s.badge}
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-4">{s.title}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0099FF] to-[#00C6FF]">{s.gradient}</span>
          </h1>
          <p className="text-[#8899BB] mb-10 text-sm leading-relaxed">
            {s.desc}
          </p>

          {/* Formulaire */}
          <form onSubmit={search} className="space-y-3">
            <div className="relative">
              <input
                value={code}
                onChange={e => { setCode(e.target.value); setError(''); }}
                placeholder={s.placeholder}
                className="w-full px-5 py-4 rounded-2xl text-white text-base outline-none font-mono text-center uppercase tracking-widest"
                style={{ background: '#0B1628', border: '2px solid #1E2D4A', fontSize: 16 }}
                autoFocus
              />
            </div>
            {error && (
              <p className="text-red-400 text-xs">{error}</p>
            )}
            <motion.button type="submit"
              whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,153,255,0.4)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-2xl text-sm font-bold"
              style={{ background: '#0066FF', color: '#fff' }}>
              {s.btn}
            </motion.button>
          </form>

          {/* Infos */}
          <div className="mt-10 grid grid-cols-3 gap-3 text-center">
            {[
              { icon: '📥', label: s.steps[0] },
              { icon: '🚚', label: s.steps[1] },
              { icon: '🎉', label: s.steps[2] },
            ].map((s, i) => (
              <div key={i} className="p-4 rounded-xl" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTA si pas de code */}
          <div className="mt-10 p-5 rounded-2xl" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
            <p className="text-xs text-gray-400 mb-3">{s.noOrder}</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/boutique"
                className="px-5 py-2.5 rounded-xl text-xs font-bold"
                style={{ background: '#FF6B0020', color: '#FF6B00', border: '1px solid #FF6B0040' }}>
                {s.goBoutique}
              </Link>
              <a href="https://wa.me/2250704928068?text=Bonjour%2C%20je%20voudrais%20connaître%20le%20statut%20de%20ma%20commande."
                target="_blank" rel="noreferrer"
                className="px-5 py-2.5 rounded-xl text-xs font-bold"
                style={{ background: '#25D36620', color: '#25D366', border: '1px solid #25D36640' }}>
                {s.goWa}
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
