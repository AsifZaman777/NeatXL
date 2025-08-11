// components/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Neat<span className="text-gray-900">Sheet</span>
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Features
            </button>
            <button className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Pricing
            </button>
            <button className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Contact
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
