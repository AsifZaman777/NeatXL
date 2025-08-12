

'use client';

export default function PricingPage() {
	return (
		<div className="bg-gradient-to-br from-green-50 to-emerald-100 py-16">
			<div className="max-w-6xl mx-auto px-4">
				<div className="text-center mb-12">
					<h2 className="text-4xl font-bold text-green-800 mb-4">
						💰 Choose Your Plan
					</h2>
					<p className="text-xl text-green-700 max-w-2xl mx-auto">
						Select the perfect plan for your data processing needs
					</p>
				</div>
				<div className="grid md:grid-cols-3 gap-8">
					{/* Free Plan */}
					<div className="bg-white rounded-2xl shadow-lg border-2 border-green-200 p-8 relative overflow-hidden">
						<div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-400"></div>
						<div className="text-center mb-6">
							<h3 className="text-2xl font-bold text-green-800 mb-2">🆓 Free</h3>
							<div className="text-4xl font-bold text-green-700">$0</div>
							<div className="text-green-600 text-sm">per month</div>
						</div>
						<ul className="space-y-4 mb-8">
							<li className="flex items-center text-green-700"><span className="text-green-500 mr-3">✅</span>Up to 10,000 rows</li>
							<li className="flex items-center text-green-700"><span className="text-green-500 mr-3">✅</span>Basic cleaning tools</li>
							<li className="flex items-center text-green-700"><span className="text-green-500 mr-3">✅</span>CSV & Excel support</li>
							<li className="flex items-center text-green-700"><span className="text-green-500 mr-3">✅</span>JSON export</li>
							<li className="flex items-center text-gray-400"><span className="text-gray-300 mr-3">❌</span>Advanced analytics</li>
							<li className="flex items-center text-gray-400"><span className="text-gray-300 mr-3">❌</span>Priority support</li>
						</ul>
						<button className="w-full py-3 px-6 bg-green-100 hover:bg-green-200 text-green-700 font-bold rounded-xl border-2 border-green-300 transition-all transform hover:scale-105">Current Plan</button>
					</div>
					{/* Pro Plan */}
					<div className="bg-white rounded-2xl shadow-2xl border-2 border-emerald-400 p-8 relative overflow-hidden transform scale-105">
						<div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-green-500"></div>
						<div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold">POPULAR</div>
						<div className="text-center mb-6">
							<h3 className="text-2xl font-bold text-emerald-800 mb-2">🚀 Pro</h3>
							<div className="text-4xl font-bold text-emerald-700">$19</div>
							<div className="text-emerald-600 text-sm">per month</div>
						</div>
						<ul className="space-y-4 mb-8">
							<li className="flex items-center text-emerald-700"><span className="text-emerald-500 mr-3">✅</span>Unlimited rows</li>
							<li className="flex items-center text-emerald-700"><span className="text-emerald-500 mr-3">✅</span>Advanced cleaning tools</li>
							<li className="flex items-center text-emerald-700"><span className="text-emerald-500 mr-3">✅</span>All file formats</li>
							<li className="flex items-center text-emerald-700"><span className="text-emerald-500 mr-3">✅</span>Advanced analytics</li>
							<li className="flex items-center text-emerald-700"><span className="text-emerald-500 mr-3">✅</span>Data visualization</li>
							<li className="flex items-center text-emerald-700"><span className="text-emerald-500 mr-3">✅</span>Priority support</li>
						</ul>
						<button className="w-full py-3 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-105">Upgrade Now</button>
					</div>
					{/* Enterprise Plan */}
					<div className="bg-white rounded-2xl shadow-lg border-2 border-green-600 p-8 relative overflow-hidden">
						<div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-600 to-green-700"></div>
						<div className="text-center mb-6">
							<h3 className="text-2xl font-bold text-green-800 mb-2">🏢 Enterprise</h3>
							<div className="text-4xl font-bold text-green-700">$99</div>
							<div className="text-green-600 text-sm">per month</div>
						</div>
						<ul className="space-y-4 mb-8">
							<li className="flex items-center text-green-700"><span className="text-green-500 mr-3">✅</span>Everything in Pro</li>
							<li className="flex items-center text-green-700"><span className="text-green-500 mr-3">✅</span>Team collaboration</li>
							<li className="flex items-center text-green-700"><span className="text-green-500 mr-3">✅</span>API access</li>
							<li className="flex items-center text-green-700"><span className="text-green-500 mr-3">✅</span>Custom integrations</li>
							<li className="flex items-center text-green-700"><span className="text-green-500 mr-3">✅</span>24/7 phone support</li>
							<li className="flex items-center text-green-700"><span className="text-green-500 mr-3">✅</span>SLA guarantee</li>
						</ul>
						<button className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-105">Contact Sales</button>
					</div>
				</div>
				{/* Additional Info */}
				<div className="text-center mt-12 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
					<h4 className="text-lg font-bold text-green-800 mb-2">🎯 All plans include:</h4>
					<div className="flex flex-wrap justify-center gap-6 text-sm text-green-700">
						<span className="flex items-center"><span className="text-green-500 mr-1">🔒</span> Secure processing</span>
						<span className="flex items-center"><span className="text-green-500 mr-1">☁️</span> Cloud storage</span>
						<span className="flex items-center"><span className="text-green-500 mr-1">📱</span> Mobile friendly</span>
						<span className="flex items-center"><span className="text-green-500 mr-1">🔄</span> Regular updates</span>
					</div>
				</div>
			</div>
		</div>
	);
}

