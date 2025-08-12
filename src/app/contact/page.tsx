export default function ContactPage() {
	const email = 'asifzaman3123@gmail.com';
	const subject = encodeURIComponent('NeatSheet Contact');
	const body = encodeURIComponent('Hi NeatSheet team,\n\nI would like to...');

	return (
		<div className="max-w-3xl mx-auto w-full p-6">
			<h1 className="text-3xl font-bold text-green-800 mb-2">📫 Contact Us</h1>
			<p className="text-green-700 mb-6">We'd love to hear from you. Choose any method below.</p>

			<div className="grid md:grid-cols-2 gap-6">
				<div className="bg-white rounded-xl border border-green-200 p-5 shadow-sm">
					<h2 className="text-lg font-bold text-green-800 mb-2">Email</h2>
					<p className="text-green-700 mb-4">Send us an email and we'll get back within 1–2 business days.</p>
					<a
						href={`mailto:${email}?subject=${subject}&body=${body}`}
						className="inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold border-2 border-emerald-300 hover:from-green-600 hover:to-emerald-700"
					>
						✉️ Email {email}
					</a>
				</div>

				<div className="bg-white rounded-xl border border-green-200 p-5 shadow-sm">
					<h2 className="text-lg font-bold text-green-800 mb-2">Support</h2>
					<ul className="text-green-700 space-y-2">
						<li>• Docs: Coming soon</li>
						<li>• Twitter: @neatsheet (placeholder)</li>
						<li>• Address: Remote-first</li>
					</ul>
				</div>
			</div>


		</div>
	);
}
