import type { Metadata } from "next";
import "./globals.css";
import { AppStateProvider } from "@/context/AppState";
import SplashScreen from "@/components/SplashScreen";
import HealixSOSWrapper from "@/components/HealixSOSWrapper";

const BASE_URL = "https://www.avenixpharma.in";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Avenix Pharmaceuticals — India's Intelligent Online Pharmacy",
    template: "%s | Avenix Pharmaceuticals",
  },
  description:
    "Order medicines online with up to 25% off. AI prescription scan, same-day delivery, lab tests, emergency dispatch, and certified authentic drugs. CDSCO-compliant.",
  keywords: [
    "online pharmacy india",
    "buy medicines online",
    "order medicines",
    "lab tests at home",
    "prescription scanner",
    "generic medicines",
    "medicine delivery bangalore",
    "emergency medicine delivery",
    "diagnostics home collection",
    "consult doctor online",
    "avenix pharmaceuticals",
    "online chemist",
    "rx delivery india",
    "nabl lab tests",
    "telemedicine consult",
    "same day medicine delivery",
    "24 7 pharmacy online",
    "home diagnostics checkup",
    "health care packages",
    "certified drugs check"
  ],
  authors: [{ name: "Avenix Pharmaceuticals", url: BASE_URL }],
  creator: "Avenix Pharmaceuticals",
  publisher: "Avenix Pharmaceuticals",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "Avenix Pharmaceuticals",
    title: "Avenix Pharmaceuticals — India's Intelligent Online Pharmacy",
    description:
      "AI-powered medicine delivery, prescription scanning, lab tests & emergency dispatch. Get up to 25% off your first order.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Avenix Pharmaceuticals — Intelligent Healthcare Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Avenix Pharmaceuticals — India's Intelligent Online Pharmacy",
    description:
      "AI-powered medicine delivery, lab tests & emergency dispatch across India.",
    images: ["/og-image.png"],
    creator: "@avenixpharma",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/manifest.json",
  other: {
    "theme-color": "#FF6B00",
    "msapplication-TileColor": "#FF6B00",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "format-detection": "telephone=yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Pharmacy",
    name: "Avenix Pharmaceuticals",
    description:
      "India's intelligent online pharmacy with AI prescription scanning, same-day medicine delivery, lab tests and emergency dispatch.",
    url: BASE_URL,
    logo: `${BASE_URL}/favicon.ico`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bangalore",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English", "Hindi"],
    },
    sameAs: ["https://twitter.com/avenixpharma"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Medicines & Healthcare Services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Medicine Delivery" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Lab Tests" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Doctor Consultation" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Emergency Delivery" } },
      ],
    },
  };

  return (
    <html
      lang="en-IN"
      className="h-full antialiased"
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body
        className="min-h-full flex flex-col bg-white text-brand-dark selection:bg-brand-orange selection:text-white"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        <SplashScreen />
        <AppStateProvider>
          {children}

          {/* Floating WhatsApp Group Redirect Button */}
          <a 
            href="https://chat.whatsapp.com/LpY6NRFvizOKtIHxjI98ft?mode=gi_t" 
            target="_blank" 
            rel="noopener noreferrer"
            className="fixed bottom-6 left-6 z-[100] h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] flex items-center justify-center shadow-lg hover:shadow-emerald-500/20 hover:scale-110 active:scale-95 transition-all duration-300 group cursor-pointer border-2 border-white"
            title="Join our WhatsApp Group"
            aria-label="Join Avenix WhatsApp Group"
          >
            {/* WhatsApp Outline Vector SVG */}
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.967C16.58 1.97 14.102.945 11.5.947c-5.441 0-9.866 4.372-9.87 9.802 0 1.814.48 3.587 1.393 5.149l-1.006 3.676 3.791-.986zm11.23-7.234c-.3-.149-1.772-.864-2.046-.964-.275-.1-.475-.149-.675.149-.199.3-.773.964-.948 1.162-.175.199-.349.224-.649.075-.3-.149-1.264-.462-2.408-1.475-.89-.788-1.492-1.762-1.666-2.061-.175-.3-.019-.462.13-.611.135-.133.3-.349.45-.523.15-.174.199-.298.299-.497.1-.199.05-.373-.025-.523-.075-.149-.675-1.62-.924-2.218-.242-.58-.488-.5-.675-.51-.174-.007-.373-.008-.573-.008-.2 0-.523.075-.797.373-.275.3-1.047 1.011-1.047 2.471 0 1.46 1.071 2.87 1.22 3.069.15.199 2.107 3.195 5.1 4.466.713.303 1.27.484 1.702.62.716.226 1.368.194 1.882.118.573-.085 1.772-.715 2.022-1.406.25-.692.25-1.284.175-1.406-.075-.122-.275-.199-.575-.349z"/>
            </svg>

            {/* Hover Tooltip Label */}
            <span className="absolute left-16 bg-brand-dark text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md pointer-events-none whitespace-nowrap tracking-wider border border-gray-800">
              Join WhatsApp Group
            </span>
          </a>

          {/* Healix SOS emergency button and triage system */}
          <HealixSOSWrapper />

        </AppStateProvider>
      </body>
    </html>
  );
}

