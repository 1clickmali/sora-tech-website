'use client';
import { useEffect, useState } from 'react';
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

function SidebarContent({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  return (
    <>
      <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: '#1E2D4A' }}>
        <div>
          <div className="text-xl font-black" style={{ color: '#00E5FF' }}>SORA TECH</div>
          <div className="text-xs text-gray-500 mt-0.5">Admin ERP</div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none lg:hidden">✕</button>
        )}
      </div>
      <nav className="flex-1 py-3 overflow-y-auto">
        {NAV.map(item => {
          const active = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} onClick={onClose}
              className="flex items-center gap-3 px-5 py-3 text-sm transition-all"
              style={{
                color: active ? '#00E5FF' : '#94A3B8',
                background: active ? 'rgba(0,229,255,0.08)' : 'transparent',
                borderLeft: active ? '3px solid #00E5FF' : '3px solid transparent',
              }}
            >
              <span className="text-base">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t" style={{ borderColor: '#1E2D4A' }}>
        <div className="text-xs text-gray-400 truncate mb-2">{user?.name}</div>
        <button onClick={() => { logout(); router.push('/admin/login'); }}
          className="w-full text-xs py-2 px-3 rounded text-gray-400 hover:text-white transition-colors"
          style={{ background: '#1E2D4A' }}>
          Déconnexion
        </button>
      </div>
    </>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // L'admin est toujours en dark mode — le thème public (light/dark) ne doit pas s'appliquer ici
  useEffect(() => {
    const prev = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', 'dark');
    return () => {
      if (prev) document.documentElement.setAttribute('data-theme', prev);
    };
  }, []);

  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [user, loading, pathname, router]);

  /* close drawer on route change */
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#060D1F' }}>
      <div className="text-gray-400">Chargement...</div>
    </div>
  );

  return (
    <div className="admin-shell flex h-screen overflow-hidden" style={{ background: '#060D1F', color: '#E2E8F0' }}>

      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex w-56 flex-shrink-0 flex-col" style={{ background: '#0B1628', borderRight: '1px solid #1E2D4A' }}>
        <SidebarContent pathname={pathname} />
      </aside>

      {/* ── Mobile drawer backdrop ── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className="fixed left-0 top-0 bottom-0 z-50 flex flex-col w-64 transition-transform duration-300 lg:hidden"
        style={{
          background: '#0B1628',
          borderRight: '1px solid #1E2D4A',
          transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <SidebarContent pathname={pathname} onClose={() => setDrawerOpen(false)} />
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Mobile top bar */}
        <div className="flex lg:hidden items-center gap-3 px-4 py-3 border-b" style={{ background: '#0B1628', borderColor: '#1E2D4A' }}>
          <button
            onClick={() => setDrawerOpen(true)}
            className="text-gray-400 hover:text-white text-xl leading-none p-1"
            aria-label="Menu"
          >
            ☰
          </button>
          <span className="font-black text-base" style={{ color: '#00E5FF' }}>SORA TECH</span>
          <span className="ml-auto text-xs text-gray-500">Admin</span>
        </div>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider><AdminShell>{children}</AdminShell></AuthProvider>;
}
