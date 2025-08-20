import type { Metadata } from 'next';

import Link from 'next/link';

export const metadata = {
  title: 'Frequently Asked Questions - NeatXL',
  description: 'Find answers to common questions about using NeatXL for CSV and Excel data cleaning, processing, and analysis.',
  keywords: ['NeatXL FAQ', 'data cleaning questions', 'CSV help', 'Excel support'],
};

export default function FAQPage() {
  const faqs = [
    {
      question: "What file formats does NeatXL support?",
      answer: "NeatXL supports CSV (.csv) and Excel (.xlsx, .xls) files. You can upload files up to 10MB in size."
    },
    {
      question: "Is my data secure when using NeatXL?",
      answer: "Yes, your data is processed entirely in your browser. We don't store or transmit your data to our servers, ensuring complete privacy and security."
    },
    {
      question: "How do I remove duplicate rows from my data?",
      answer: "Simply upload your file and enable the 'Remove Duplicates' option in the cleaning controls. NeatXL will automatically identify and remove duplicate rows."
    },
    {
      question: "Can I undo changes made to my data?",
      answer: "Yes, NeatXL provides real-time preview so you can see changes before applying them. You can also re-upload your original file at any time."
    },
    {
      question: "What's the maximum file size I can upload?",
      answer: "The free version supports files up to 10,000 rows. For larger files, consider upgrading to our premium version."
    },
    {
      question: "How do I export my cleaned data?",
      answer: "After cleaning your data, click the 'Download Cleaned Data' button to export as CSV, or use the dashboard to export in different formats including Excel and JSON."
    },
    {
      question: "Does NeatXL work on mobile devices?",
      answer: "Yes, NeatXL is fully responsive and works on desktop, tablet, and mobile devices through your web browser."
    },
    {
      question: "Can I use NeatXL for commercial purposes?",
      answer: "Yes, NeatXL can be used for both personal and commercial data cleaning tasks. Check our pricing page for enterprise features."
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <nav className="mb-8">
          <Link href="/" className="text-green-600 hover:text-green-800">&larr; Back to NeatXL</Link>
        </nav>
        
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about using NeatXL for your data cleaning needs.
          </p>
        </header>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                {faq.question}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-6">
            Can&apos;t find what you&apos;re looking for? Feel free to reach out to us.
          </p>
          <a 
            href="/contact" 
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </>
  );
}
