import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Professional Housekeeping at Your Fingertips
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Book trusted housekeepers for your home. Quality service, flexible scheduling, transparent pricing.
            </p>
            <div className="flex gap-4">
              <Link href="/housekeepers" className="btn-primary bg-white text-blue-600 hover:bg-gray-100">
                Browse Housekeepers
              </Link>
              <Link href="/register" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose CleanHome?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-bold mb-3">Verified Professionals</h3>
              <p className="text-gray-600">All housekeepers are verified and rated by customers. Book with confidence.</p>
            </div>
            <div className="card">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-3">Transparent Pricing</h3>
              <p className="text-gray-600">No hidden fees. See all rates upfront before booking your service.</p>
            </div>
            <div className="card">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-3">Secure Payments</h3>
              <p className="text-gray-600">Pay securely with Stripe. Your payment information is always safe.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Your Home Clean?</h2>
          <Link href="/housekeepers" className="btn-primary text-lg px-8 py-3">
            Browse Available Housekeepers
          </Link>
        </div>
      </section>
    </div>
  );
}
