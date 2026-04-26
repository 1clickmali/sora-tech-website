import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "./i18n/AppContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#060D1F",
};

export const metadata: Metadata = {
  title: {
    default: "SORA TECH — Solutions IT à Abidjan, Côte d'Ivoire",
    template: "%s | SORA TECH",
  },
  description:
    "Développement de sites web, logiciels de gestion, applications mobiles, ERP et cybersécurité à Abidjan. SORA TECH transforme votre entreprise avec des solutions digitales premium.",
  keywords: [
    "développement web abidjan",
    "logiciel gestion côte d'ivoire",
    "application mobile abidjan",
    "cybersécurité CI",
    "ERP entreprise abidjan",
    "sora tech",
  ],
  authors: [{ name: "SORA TECH", url: "https://soratech.ci" }],
  creator: "SORA TECH",
  openGraph: {
    type: "website",
    locale: "fr_CI",
    url: "https://soratech.ci",
    siteName: "SORA TECH",
    title: "SORA TECH — Solutions IT à Abidjan",
    description:
      "Sites web, logiciels, apps mobiles et ERP pour entreprises en Côte d'Ivoire.",
    images: [{ url: "/SORA_TECH_logo_clair.svg", width: 800, height: 600, alt: "SORA TECH" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SORA TECH — Solutions IT à Abidjan",
    description: "Sites web, logiciels, apps mobiles et ERP pour entreprises en Côte d'Ivoire.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://soratech.ci" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-theme="dark"
    >
      <head>
        {/* Apply saved theme before first paint — no flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',t);})();`,
          }}
        />
        <link rel="dns-prefetch" href="//sora-tech-website-production.up.railway.app" />
        <link
          rel="preconnect"
          href="https://sora-tech-website-production.up.railway.app"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col" style={{ background: "var(--bg)", color: "var(--text)" }}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
