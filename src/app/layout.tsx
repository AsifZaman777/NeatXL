// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AdProvider } from '../components/ads/AdContext';
import { DataProvider } from '../contexts/DataContext';
import LayoutWrapper from '../components/LayoutWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NeatSheet - Clean Your CSV Files',
  description: 'Upload, clean, and download your CSV files with ease',
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
