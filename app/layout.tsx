import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from 'next/font/local';
import "./styles/globals.css";
import { AppProvider } from "./context/AppContext";

const disolveFont = localFont({
  src: [
    {
      path: '../public/fonts/Disolve_regular.ttf',
      weight: '400',
      style: 'normal',
    }
  ],
  variable: '--font-disolve',
  display: 'swap',
  preload: true,
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = 'https://www.tobiasmoscatelli.com'; 

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  title: {
    default: 'Tobias Moscatelli | Mobile & Full Stack Developer',
    template: '%s | Tobias Moscatelli',
  },
  description: 'Portfolio interactivo de Tobias Moscatelli. Desarrollador Mobile y Full Stack con experiencia en producción construyendo aplicaciones escalables con Flutter, React Native, Kotlin, React y Node.js.',
  keywords: ['Mobile Developer', 'Full Stack Developer', 'Flutter', 'React Native', 'Kotlin', 'React', 'Next.js', 'Spring Boot', 'TypeScript', 'Tobias Moscatelli'],
  authors: [{ name: 'Tobias Moscatelli', url: SITE_URL }],
  creator: 'Tobias Moscatelli',
  publisher: 'Tobias Moscatelli',
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  icons: {
    icon: '/svg/search-logo.svg',
    shortcut: '/svg/search-logo.svg',
    apple: '/svg/search-logo.svg',
  },
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'es_ES',
    url: SITE_URL,
    title: 'Tobias Moscatelli | Mobile & Full Stack Developer',
    description: 'Portfolio interactivo espacial de Tobias Moscatelli. Explorando arquitecturas móviles y desarrollo backend.',
    siteName: 'Tobias Moscatelli - Portfolio',
    images: [
      {
        url: '/img/personalPhoto.webp',
        width: 1200,
        height: 630,
        alt: 'Previsualización del Portfolio de Tobias Moscatelli',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tobias Moscatelli | Mobile & Full Stack Developer',
    description: 'Portfolio interactivo espacial construido con Next.js y Canvas.',
    images: ['/img/personalPhoto.webp'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${disolveFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Tobias Moscatelli",
              "url": "https://www.tobiasmoscatelli.com",
              "jobTitle": "Mobile & Full Stack Developer",
              "sameAs": [
                "https://github.com/BambuBlu",
                "https://www.linkedin.com/in/tobiasmoscatelli"
              ]
            })
          }}
        />
        
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}