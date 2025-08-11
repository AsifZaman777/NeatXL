// components/ads/ModalAd.tsx
'use client';

import { useAdContext } from './AdContext';

export default function ModalAd() {
  const { showModalAd, triggerModalAd } = useAdContext();

  if (!showModalAd) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-40" onClick={() => triggerModalAd(false)} />
      
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 m-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Unlock Premium Features
          </h3>
          
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 flex items-center justify-center text-gray-500 mb-4">
            <span>Premium Ad Image</span>
          </div>
          
          <p className="text-gray-600 mb-4">
            Upgrade to NeatSheet Pro for unlimited processing, advanced cleaning options, and an ad-free experience.
          </p>
          
          <ul className="text-left space-y-2 mb-6">
            <li className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Unlimited file processing
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Advanced cleaning tools
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Ad-free experience
            </li>
          </ul>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              className="flex-1 px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              onClick={() => triggerModalAd(false)}
            >
              Continue with Free Version
            </button>
            <button
              type="button"
              className="flex-1 px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              onClick={() => triggerModalAd(false)}
            >
              Upgrade to Pro ($9.99/mo)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
