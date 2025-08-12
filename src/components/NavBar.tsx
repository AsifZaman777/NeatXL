"use client";

import { useRouter } from "next/navigation";

export default function NavBar() {
  const router = useRouter();

  return (
    <header className="bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm border-b-2 border-green-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => router.push("/")}
              className="text-3xl font-bold text-green-800 hover:text-green-900 transition-all transform hover:scale-105 flex items-center bg-transparent border-none cursor-pointer"
            >
              <span className="text-emerald-600">📊 Neat</span>
              <span className="text-green-700">Sheet</span>
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
              onClick={() => router.push("/pricing")}
              className="px-4 py-2 text-sm font-bold rounded-lg transition-all transform hover:scale-105 text-green-600 hover:text-green-700 hover:bg-green-100 border-2 border-transparent hover:border-green-300 bg-transparent cursor-pointer"
            >
              💰 Pricing
            </button>

            <button
              onClick={() => router.push("/contact")}
              className="px-4 py-2 text-sm font-bold rounded-lg transition-all transform hover:scale-105 text-green-600 hover:text-green-700 hover:bg-green-100 border-2 border-transparent hover:border-green-300 bg-transparent cursor-pointer"
            >
              📞 Contact
            </button>
            <button
              onClick={() => router.push("/get-started")}
              className="ml-4 px-6 py-2 text-sm font-bold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg shadow-lg transition-all transform hover:scale-105 border-2 border-green-400 cursor-pointer"
            >
              🚀 Get Started
            </button>
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
