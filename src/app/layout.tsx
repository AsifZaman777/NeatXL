// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AdProvider } from '../components/ads/AdContext';
import { DataProvider } from '../contexts/DataContext';
import LayoutWrapper from '../components/LayoutWrapper';
import Analytics from '../components/Analytics';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://neatxl.com'),
  title: {
    default: 'NeatXL - Free Online CSV & Excel Data Cleaning Tool',
    template: '%s | NeatXL'
  },
  description: 'Clean, organize, and transform your CSV and Excel files online for free. Remove duplicates, handle missing values, standardize formats, and export clean data instantly.',
  keywords: [
    'CSV cleaner',
    'Excel data cleaning',
    'data cleaning tool',
    'remove duplicates',
    'data preprocessing',
    'clean CSV online',
    'data transformation',
    'Excel file cleaner',
    'free data tools',
    'online data cleaning',
    'NeatXL',
    'spreadsheet cleaner',
    'data quality',
    'batch data processing'
  ],
  authors: [{ name: 'Asif Zaman', url: 'https://neatxl.com' }],
  creator: 'Asif Zaman',
  publisher: 'NeatXL',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://neatxl.com',
    title: 'NeatXL - Free Online CSV & Excel Data Cleaning Tool',
    description: 'Clean, organize, and transform your CSV and Excel files online for free. Remove duplicates, handle missing values, standardize formats, and export clean data instantly.',
    siteName: 'NeatXL',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NeatXL - CSV & Excel Data Cleaning Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NeatXL - Free Online CSV & Excel Data Cleaning Tool',
    description: 'Clean, organize, and transform your CSV and Excel files online for free. Remove duplicates, handle missing values, standardize formats.',
    images: ['/og-image.png'],
    creator: '@neatxl',
  },
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
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'technology',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://neatxl.com/#webapp",
        "name": "NeatXL",
        "alternateName": "NeatXL Data Cleaner",
        "url": "https://neatxl.com",
        "description": "Free online CSV and Excel data cleaning tool. Remove duplicates, handle missing values, standardize formats, and export clean data instantly.",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "creator": {
          "@type": "Person",
          "name": "Asif Zaman",
          "email": "asifzaman3123@gmail.com"
        },
        "datePublished": "2025-01-01",
        "inLanguage": "en-US",
        "isAccessibleForFree": true,
        "browserRequirements": "Modern web browser with JavaScript enabled"
      },
      {
        "@type": "Organization",
        "@id": "https://neatxl.com/#organization",
        "name": "NeatXL",
        "url": "https://neatxl.com",
        "logo": "https://neatxl.com/logo.png",
        "description": "Providing free online data cleaning tools for CSV and Excel files.",
        "founder": {
          "@type": "Person",
          "name": "Asif Zaman"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "email": "asifzaman3123@gmail.com",
          "contactType": "customer service"
        }
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <link rel="canonical" href="https://neatxl.com" />
        <meta name="theme-color" content="#10b981" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="NeatXL" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="NeatXL" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} bg-gray-50`}>
        <Analytics />
        <DataProvider>
          <AdProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </AdProvider>
        </DataProvider>
      </body>
    </html>
  );
}
