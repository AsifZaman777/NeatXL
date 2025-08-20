import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Data Cleaning Tips & Tutorials - NeatXL Blog',
  description: 'Learn how to clean your data effectively with our comprehensive guides, tips, and tutorials for CSV and Excel data processing.',
  keywords: ['data cleaning tips', 'CSV tutorials', 'Excel data processing', 'data preprocessing guide'],
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav className="mb-8">
        <Link href="/" className="text-green-600 hover:text-green-800">&larr; Back to NeatXL</Link>
      </nav>
      {children}
    </div>
  );
}
