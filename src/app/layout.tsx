// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AdProvider } from '../components/ads/AdContext';
import { DataProvider } from '../contexts/DataContext';
import LayoutWrapper from '../components/LayoutWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NeatXL - Advanced Data Processing & Analytics',
  description: 'Upload, clean, visualize, and export your data. Generate SQL queries, create dashboards, and export to CSV/JSON formats.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
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
