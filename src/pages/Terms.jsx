import React from 'react';
import Layout from '../components/layout/Layout';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <Layout>
      <div className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-md rounded-lg p-8">
            <div className="mb-8">
              <Link to="/" className="text-indigo-600 hover:text-indigo-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back to Home
              </Link>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>
            <p className="text-gray-600 mb-6">
              Last Updated: June 1, 2025
            </p>

            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
                <p>
                  Welcome to BusyWomen ("Company", "we", "our", "us")! These Terms of Service ("Terms") govern your use of our website located at busywomen.com (together or individually "Service") operated by BusyWomen.
                </p>
                <p className="mt-2">
                  Our Privacy Policy also governs your use of our Service and explains how we collect, safeguard and disclose information that results from your use of our web pages. Please read it here: <Link to="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>.
                </p>
                <p className="mt-2">
                  By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Subscriptions</h2>
                <p>
                  Some parts of the Service are billed on a subscription basis ("Subscription(s)"). You will be billed in advance on a recurring and periodic basis ("Billing Cycle"). Billing cycles are set on a monthly or annual basis, depending on the type of subscription plan you select.
                </p>
                <p className="mt-2">
                  At the end of each Billing Cycle, your Subscription will automatically renew under the exact same conditions unless you cancel it or BusyWomen cancels it. You may cancel your Subscription renewal either through your online account management page or by contacting BusyWomen customer support team.
                </p>
                <p className="mt-2">
                  A valid payment method, including credit card, is required to process the payment for your Subscription. You shall provide BusyWomen with accurate and complete billing information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Free Trial</h2>
                <p>
                  BusyWomen may, at its sole discretion, offer a Subscription with a free trial for a limited period of time ("Free Trial").
                </p>
                <p className="mt-2">
                  You may be required to enter your billing information in order to sign up for the Free Trial. If you do enter your billing information when signing up for the Free Trial, you will not be charged by BusyWomen until the Free Trial has expired. On the last day of the Free Trial period, unless you cancelled your Subscription, you will be automatically charged the applicable subscription fee for the type of Subscription you have selected.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Fee Changes</h2>
                <p>
                  BusyWomen, in its sole discretion and at any time, may modify the Subscription fees for the Subscriptions. Any Subscription fee change will become effective at the end of the then-current Billing Cycle.
                </p>
                <p className="mt-2">
                  BusyWomen will provide you with a reasonable prior notice of any change in Subscription fees to give you an opportunity to terminate your Subscription before such change becomes effective.
                </p>
                <p className="mt-2">
                  Your continued use of the Service after the Subscription fee change comes into effect constitutes your agreement to pay the modified Subscription fee amount.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Refunds</h2>
                <p>
                  Except when required by law, paid Subscription fees are non-refundable. However, at our discretion, we may offer partial refunds for unused portions of your subscription if you have a legitimate concern with our service.
                </p>
                <p className="mt-2">
                  For details about our refund policy, please visit our Refund Policy page: <Link to="/refund" className="text-indigo-600 hover:underline">Refund Policy</Link>.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Content</h2>
                <p>
                  Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.
                </p>
                <p className="mt-2">
                  By posting Content to the Service, you grant us the right and license to use, modify, perform, display, reproduce, and distribute such Content on and through the Service. You retain any and all of your rights to any Content you submit, post or display on or through the Service and you are responsible for protecting those rights.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Limitation of Liability</h2>
                <p>
                  In no event shall BusyWomen, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Changes to Terms</h2>
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                </p>
                <p className="mt-2">
                  By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Contact Us</h2>
                <p>
                  If you have any questions about these Terms, please contact us at:
                </p>
                <ul className="list-disc list-inside mt-2">
                  <li>Email: legal@busywomen.com</li>
                  <li>Phone: (123) 456-7890</li>
                  <li>Address: 123 Healthy Street, Fitness City, FC 12345</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
