import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="w-8 h-8" />
              <span className="text-2xl font-bold">CRB Check</span>
            </Link>
            <Link 
              to="/"
              className="flex items-center text-sm hover:text-blue-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing or using CRB Check services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">2. Service Description</h2>
              <p className="text-gray-600 leading-relaxed">
                CRB Check provides credit reporting and monitoring services. We obtain information from various sources, including credit bureaus, to provide you with credit reports and related services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">3. User Responsibilities</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Use the service only for lawful purposes</li>
                <li>Not attempt to gain unauthorized access to our systems</li>
                <li>Notify us immediately of any security breaches</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">4. Payment Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                Some services may require payment. All fees are non-refundable unless otherwise stated. We reserve the right to modify our pricing with appropriate notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">5. Intellectual Property</h2>
              <p className="text-gray-600 leading-relaxed">
                All content, features, and functionality of our service are owned by CRB Check and are protected by copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-600 leading-relaxed">
                CRB Check provides information "as is" without any warranties. We are not liable for any damages arising from your use of our services or any inaccuracies in the information provided.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">7. Termination</h2>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to terminate or suspend your account and access to our services at our discretion, without notice, for conduct that we believe violates these terms or is harmful to other users, us, or third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">8. Changes to Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                We may modify these terms at any time. Continued use of our services after such changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">9. Contact Information</h2>
              <p className="text-gray-600 leading-relaxed">
                For questions about these Terms of Service, please contact us at{' '}
                <a href="mailto:legal@crbcheck.co.ke" className="text-blue-600 hover:text-blue-800">
                  legal@crbcheck.co.ke
                </a>
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Terms;