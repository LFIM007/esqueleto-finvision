import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import Script from "next/script"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FinVision - Sistema de Gestão Financeira Inteligente",
  description:
    "Plataforma completa de gestão financeira com IA, método 50/30/20, controle de gastos, metas, investimentos e painel corporativo para empresas",
  keywords: [
    "gestão financeira",
    "controle de gastos",
    "finanças pessoais",
    "MEI",
    "corporativo",
    "investimentos",
    "orçamento",
  ],
  authors: [{ name: "FinVision" }],
  creator: "FinVision",
  publisher: "FinVision",
  generator: "v0.app",
  manifest: "/manifest.json",
  applicationName: "FinVision",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FinVision",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://finvision.app",
    title: "FinVision - Gestão Financeira Inteligente",
    description: "Transforme sua vida financeira com dashboard inteligente, metas, investimentos e assistente IA",
    siteName: "FinVision",
  },
  twitter: {
    card: "summary_large_image",
    title: "FinVision - Gestão Financeira Inteligente",
    description: "Transforme sua vida financeira com dashboard inteligente, metas, investimentos e assistente IA",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192x192.jpg",
  },
}

export const viewport: Viewport = {
  themeColor: "#10B981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-192x192.jpg" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FinVision" />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Toaster />
        <Analytics />

        {/* PWA Registration Script */}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/service-worker.js').then(
                  function(registration) {
                    console.log('[v0] ServiceWorker registration successful');
                  },
                  function(err) {
                    console.log('[v0] ServiceWorker registration failed: ', err);
                  }
                );
              });
            }
          `}
        </Script>
      </body>
    </html>
  )
}
