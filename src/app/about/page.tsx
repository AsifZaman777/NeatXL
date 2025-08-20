import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About NeatXL - Free Online Data Cleaning Tool',
  description: 'Learn about NeatXL, the free online tool for cleaning and processing CSV and Excel files. Discover our mission to make data cleaning accessible to everyone.',
  keywords: ['about NeatXL', 'data cleaning tool', 'CSV processor', 'data preprocessing'],
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      <article className="prose prose-lg max-w-none">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About NeatXL
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Making data cleaning simple, fast, and accessible to everyone.
          </p>
        </header>

        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            At NeatXL, we believe that clean, well-organized data should be accessible to everyone. Whether you&apos;re a data analyst, researcher, business owner, or student, our free online tool empowers you to clean and transform your CSV and Excel files without the need for expensive software or technical expertise.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We&apos;ve built NeatXL to be intuitive, fast, and secure - processing your data entirely in your browser to ensure your privacy while delivering professional-grade results.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h3 className="text-xl font-bold text-green-800 mb-3">🎯 What We Do</h3>
            <ul className="text-green-700 space-y-2">
              <li>• Remove duplicate rows and clean messy data</li>
              <li>• Handle missing values and standardize formats</li>
              <li>• Transform and reorder your data columns</li>
              <li>• Export clean data in multiple formats</li>
              <li>• Provide real-time data insights and statistics</li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-xl font-bold text-blue-800 mb-3">🔒 Why Choose NeatXL</h3>
            <ul className="text-blue-700 space-y-2">
              <li>• 100% browser-based - your data never leaves your device</li>
              <li>• No registration required - start cleaning immediately</li>
              <li>• Free to use with professional-grade features</li>
              <li>• Works on any device with a modern web browser</li>
              <li>• Real-time preview of all changes</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Clean Your Data?</h2>
          <p className="text-gray-600 mb-6">
            Join thousands of users who trust NeatXL for their data cleaning needs.
          </p>
          <Link 
            href="/" 
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-block"
          >
            Start Cleaning Data
          </Link>
        </div>
      </article>
    </div>
  );
}
