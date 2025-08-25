"use client";

import { useRouter } from "next/navigation";
import { useData } from "../contexts/DataContext";
import Image from "next/image";
import logo from '../../public/assets/ad-images/neatxl-logo.png';

export default function NavBar() {
  const router = useRouter();
  const { hasData, clearAllData } = useData();

  return (
    <header className="bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm border-b-2 border-green-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-2 hover:opacity-80 transition-all transform hover:scale-105 bg-transparent border-none cursor-pointer"
            >
              <Image
                src={logo}
                alt="NeatXL Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-2xl font-bold text-green-800 hover:text-green-900">
                <span className="text-emerald-600">Neat</span>
                <span className="text-green-700">XL</span>
              </span>
            </button>
          </div>

          <nav className="hidden sm:flex sm:items-center space-x-4">
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 text-sm font-bold rounded-lg transition-all transform hover:scale-105 text-green-600 hover:text-green-700 hover:bg-green-100 border-2 border-transparent hover:border-green-300 bg-transparent cursor-pointer"
            >
              🏠 Home
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 text-sm font-bold rounded-lg transition-all transform hover:scale-105 text-green-600 hover:text-green-700 hover:bg-green-100 border-2 border-transparent hover:border-green-300 bg-transparent cursor-pointer relative"
            >
              📊 Dashboard
              {hasData && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full"></span>
              )}
            </button>
            <button
              onClick={() => router.push("/sql")}
              className="px-4 py-2 text-sm font-bold rounded-lg transition-all transform hover:scale-105 text-blue-600 hover:text-blue-700 hover:bg-blue-100 border-2 border-transparent hover:border-blue-300 bg-transparent cursor-pointer relative"
            >
              🗄️ Generate SQL
              {hasData && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 rounded-full"></span>
              )}
            </button>
            <button
              onClick={() => router.push("/pricing")}
              className="px-4 py-2 text-sm font-bold rounded-lg transition-all transform hover:scale-105 text-green-600 hover:text-green-700 hover:bg-green-100 border-2 border-transparent hover:border-green-300 bg-transparent cursor-pointer"
            >
                💰 Pricing
            </button>

            <button
              onClick={() => router.push("/about")}
              className="px-4 py-2 text-sm font-bold rounded-lg transition-all transform hover:scale-105 text-blue-600 hover:text-blue-700 hover:bg-blue-100 border-2 border-transparent hover:border-blue-300 bg-transparent cursor-pointer"
            >
              ℹ️ About
            </button>

            <button
              onClick={() => router.push("/faq")}
              className="px-4 py-2 text-sm font-bold rounded-lg transition-all transform hover:scale-105 text-purple-600 hover:text-purple-700 hover:bg-purple-100 border-2 border-transparent hover:border-purple-300 bg-transparent cursor-pointer"
            >
              ❓ FAQ
            </button>

            <button
              onClick={() => router.push("/contact")}
              className="px-4 py-2 text-sm font-bold rounded-lg transition-all transform hover:scale-105 text-green-600 hover:text-green-700 hover:bg-green-100 border-2 border-transparent hover:border-green-300 bg-transparent cursor-pointer"
            >
              📞 Contact
            </button>
            
            {/* {hasData && (
              <button
                onClick={() => {
                  clearAllData();
                  router.push("/");
                }}
                className="px-4 py-2 text-sm font-bold rounded-lg transition-all transform hover:scale-105 text-red-600 hover:text-red-700 hover:bg-red-100 border-2 border-transparent hover:border-red-300 bg-transparent cursor-pointer"
                title="Clear uploaded data"
              >
                🗑️ Clear Data
              </button>
            )} */}
            
          </nav>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button className="text-green-600 hover:text-green-700 p-2">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
