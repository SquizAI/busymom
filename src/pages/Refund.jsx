import React from 'react';
import Layout from '../components/layout/Layout';
import { Link } from 'react-router-dom';

const Refund = () => {
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
            
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Refund Policy</h1>
            <p className="text-gray-600 mb-6">
              Last Updated: June 1, 2025
            </p>

            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Overview</h2>
                <p>
                  At BusyWomen, we strive to ensure your satisfaction with our meal planning services. This Refund Policy outlines our procedures and conditions regarding refunds for subscription cancellations.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Free Trial Period</h2>
                <p>
                  Our service begins with a 14-day free trial period. During this time, you can explore all features without charge. If you cancel before the end of the trial period, you will not be charged.
                </p>
                <p className="mt-2">
                  To cancel during the free trial, simply navigate to your Account Settings and select "Cancel Subscription" before the trial period ends. No refund is necessary as you have not been charged.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Monthly Subscription Refunds</h2>
                <p>
                  For monthly subscriptions, we offer refunds under the following conditions:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><strong>First-time subscribers:</strong> Full refund if requested within 7 days of your first payment after the free trial period.</li>
                  <li><strong>Technical issues:</strong> Full or partial refund may be issued if you experience persistent technical problems that significantly impair your ability to use our service, and our technical team is unable to resolve the issues within a reasonable timeframe.</li>
                  <li><strong>Standard cancellations:</strong> For all other situations, cancellation will stop future billing but will not result in a refund for the current billing period. You will continue to have access to the service until the end of the current billing period.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Annual Subscription Refunds</h2>
                <p>
                  For annual subscriptions, our refund policy is as follows:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><strong>Within 14 days of purchase:</strong> Full refund if you cancel within 14 days of your annual subscription payment.</li>
                  <li><strong>After 14 days:</strong> Partial refund based on the remaining unused months of service, minus a 15% administrative fee. Refund amount = (Original payment amount ÷ 12) × Unused months × 0.85</li>
                  <li><strong>Technical issues:</strong> Full or prorated refund may be issued if you experience persistent technical problems that significantly impair your ability to use our service.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">5. How to Request a Refund</h2>
                <p>
                  To request a refund, please contact our Customer Support team through one of these channels:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Email: support@busywomen.com with the subject line "Refund Request"</li>
                  <li>Customer Support Portal: Log into your account and submit a refund request ticket</li>
                  <li>Phone: Call (123) 456-7890 during our business hours (Monday-Friday, 9 AM - 5 PM EST)</li>
                </ul>
                <p className="mt-2">
                  Please include the following information in your refund request:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Your full name</li>
                  <li>Email address associated with your account</li>
                  <li>Reason for the refund request</li>
                  <li>Date of purchase</li>
                  <li>Any relevant information supporting your request</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Processing Time</h2>
                <p>
                  We will process eligible refund requests within 5-7 business days of approval. The actual time for the refunded amount to appear in your account depends on your payment method and financial institution, typically 3-10 business days.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">7. No Refund Scenarios</h2>
                <p>
                  Refunds will not be issued in the following circumstances:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>If you simply change your mind after the applicable refund period</li>
                  <li>If the cancellation is due to a violation of our <Link to="/terms" className="text-indigo-600 hover:underline">Terms of Service</Link></li>
                  <li>For partial months of service</li>
                  <li>If you've previously received a discretionary refund from us within the past 12 months</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Changes to This Policy</h2>
                <p>
                  We reserve the right to modify this refund policy at any time. Changes and clarifications will take effect immediately upon posting on the website. We encourage users to check this page periodically for updates.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Contact Us</h2>
                <p>
                  If you have any questions about our Refund Policy, please contact us at:
                </p>
                <ul className="list-disc list-inside mt-2">
                  <li>Email: billing@busywomen.com</li>
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

export default Refund;
