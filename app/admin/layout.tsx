'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { AuthProvider, useAuth } from '@/lib/auth';

const NAV = [
  { href: '/admin/dashboard',   label: 'Dashboard',   icon: '▦' },
  { href: '/admin/commandes',   label: 'Commandes',   icon: '🛒' },
  { href: '/admin/devis',       label: 'Devis',       icon: '📋' },
  { href: '/admin/contacts',    label: 'Contacts',    icon: '✉' },
  { href: '/admin/factures',    label: 'Factures',    icon: '🧾' },
  { href: '/admin/produits',    label: 'Produits',    icon: '📦' },
  { href: '/admin/stock',       label: 'Stock',       icon: '▣' },
  { href: '/admin/blog',        label: 'Blog',        icon: '📝' },
  { href: '/admin/projets',     label: 'Projets',     icon: '🗂' },
  { href: '/admin/equipe',      label: 'Équipe',      icon: '👥' },
  { href: '/admin/parametres',  label: 'Paramètres',  icon: '⚙' },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') {
      // Double-check: if token still in localStorage, don't redirect yet
      // (state may not have committed from a concurrent login)
      const hasToken = typeof window !== 'undefined' && localStorage.getItem('sora_token');
      if (!hasToken) {
        router.replace('/admin/login');
      }
    }
  }, [user, loading, pathname, router]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#060D1F' }}>
      <div className="text-gray-400">Chargement...</div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#060D1F', color: '#E2E8F0' }}>
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col" style={{ background: '#0B1628', borderRight: '1px solid #1E2D4A' }}>
        <div className="p-5 border-b" style={{ borderColor: '#1E2D4A' }}>
          <div className="text-xl font-black" style={{ color: '#00E5FF' }}>SORA TECH</div>
          <div className="text-xs text-gray-500 mt-0.5">Admin ERP</div>
        </div>
        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV.map(item => {
            const active = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}
                className="flex items-center gap-3 px-5 py-2.5 text-sm transition-all"
                style={{
                  color: active ? '#00E5FF' : '#94A3B8',
                  background: active ? 'rgba(0,229,255,0.08)' : 'transparent',
                  borderLeft: active ? '3px solid #00E5FF' : '3px solid transparent',
                }}
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t" style={{ borderColor: '#1E2D4A' }}>
          <div className="text-xs text-gray-400 truncate mb-2">{user.name}</div>
          <button onClick={() => { logout(); router.push('/admin/login'); }}
            className="w-full text-xs py-1.5 px-3 rounded text-gray-400 hover:text-white transition-colors"
            style={{ background: '#1E2D4A' }}>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider><AdminShell>{children}</AdminShell></AuthProvider>;
}
