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
    },
    {
      path: '../public/fonts/Disolve_light.ttf',
      weight: '300',
      style: 'normal',
    },
  ],
  variable: '--font-disolve',
  display: 'swap',
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
    default: 'Tobias | Software Engineer & Game Developer',
    template: '%s | Tobias',
  },
  description: 'Portfolio interactivo de Tobias. Construyendo universos digitales a través de código escalable y experiencias inmersivas.',
  keywords: ['Software Engineer', 'Game Developer', 'React', 'Next.js', 'Godot', 'Portfolio', 'TypeScript'],
  authors: [{ name: 'Tobias Moscatelli' }],
  creator: 'Tobias Moscatelli',
  icons: {
    icon: '/search-logo.svg',
    shortcut: '/search-logo.svg',
    apple: '/search-logo.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: SITE_URL,
    title: 'Tobias | Software Engineer & Game Developer',
    description: 'Portfolio interactivo espacial construido con Next.js y Canvas.',
    siteName: 'Tobias Portfolio',
    images: [
      {
        url: '/og-image.jpg', 
        width: 1200,
        height: 630,
        alt: 'Previsualización del Portfolio de Tobias',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tobias | Software Engineer & Game Developer',
    description: 'Portfolio interactivo espacial construido con Next.js y Canvas.',
    images: ['/og-image.jpg'],
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
              "jobTitle": "Software Engineer & Game Developer",
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