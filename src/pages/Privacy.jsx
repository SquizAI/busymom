import React from 'react';
import Layout from '../components/layout/Layout';
import { Link } from 'react-router-dom';

const Privacy = () => {
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
            
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
            <p className="text-gray-600 mb-6">
              Last Updated: June 1, 2025
            </p>

            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
                <p>
                  At BusyWomen ("Company", "we", "our", "us"), we respect your privacy and are committed to protecting it through our compliance with this policy.
                </p>
                <p className="mt-2">
                  This Privacy Policy describes the types of information we may collect from you or that you may provide when you visit the website busywomen.com (our "Website") and our practices for collecting, using, maintaining, protecting, and disclosing that information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
                <p>
                  We collect several types of information from and about users of our Website, including information:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>By which you may be personally identified, such as name, postal address, email address, telephone number, or any other identifier by which you may be contacted online or offline ("personal information");</li>
                  <li>About your internet connection, the equipment you use to access our Website, and usage details;</li>
                  <li>Dietary preferences and restrictions;</li>
                  <li>Health and fitness goals;</li>
                  <li>Payment and subscription information.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Collect Your Information</h2>
                <p>
                  We collect information from you and about you in the following ways:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Directly from you when you provide it to us, such as when you register on our site, subscribe to our services, or fill out forms;</li>
                  <li>Automatically as you navigate through the site, including usage details, IP addresses, and information collected through cookies and other tracking technologies;</li>
                  <li>From third parties, for example, our business partners or service providers.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">4. How We Use Your Information</h2>
                <p>
                  We use information that we collect about you or that you provide to us, including any personal information:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>To present our Website and its contents to you;</li>
                  <li>To provide you with information, products, or services that you request from us;</li>
                  <li>To personalize your meal plans and recommendations;</li>
                  <li>To process and manage your subscription and payments;</li>
                  <li>To fulfill any other purpose for which you provide it;</li>
                  <li>To notify you about changes to our Website or any products or services we offer;</li>
                  <li>To improve our Website, products, services, marketing, and customer relationships;</li>
                  <li>In any other way we may describe when you provide the information;</li>
                  <li>For any other purpose with your consent.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Disclosure of Your Information</h2>
                <p>
                  We may disclose aggregated information about our users, and information that does not identify any individual, without restriction.
                </p>
                <p className="mt-2">
                  We may disclose personal information that we collect or you provide as described in this privacy policy:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>To our subsidiaries and affiliates;</li>
                  <li>To contractors, service providers, and other third parties we use to support our business;</li>
                  <li>To a buyer or other successor in the event of a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of our assets;</li>
                  <li>To fulfill the purpose for which you provide it;</li>
                  <li>For any other purpose disclosed by us when you provide the information;</li>
                  <li>With your consent;</li>
                  <li>To comply with any court order, law, or legal process, including to respond to any government or regulatory request;</li>
                  <li>To enforce or apply our terms of use and other agreements;</li>
                  <li>If we believe disclosure is necessary or appropriate to protect the rights, property, or safety of BusyWomen, our customers, or others.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Data Security</h2>
                <p>
                  We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. All information you provide to us is stored on our secure servers behind firewalls. Any payment transactions will be encrypted using SSL technology.
                </p>
                <p className="mt-2">
                  Unfortunately, the transmission of information via the internet is not completely secure. Although we do our best to protect your personal information, we cannot guarantee the security of your personal information transmitted to our Website. Any transmission of personal information is at your own risk.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Your Choices About Our Use of Your Information</h2>
                <p>
                  We strive to provide you with choices regarding the personal information you provide to us. We have created mechanisms to provide you with the following control over your information:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Tracking Technologies and Advertising. You can set your browser to refuse all or some browser cookies, or to alert you when cookies are being sent.</li>
                  <li>Promotional Offers from the Company. If you do not wish to have your email address used by the Company to promote our own or third parties' products or services, you can opt-out by adjusting your user preferences in your account profile or by sending us an email stating your request.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Changes to Our Privacy Policy</h2>
                <p>
                  It is our policy to post any changes we make to our privacy policy on this page. If we make material changes to how we treat our users' personal information, we will notify you through a notice on the Website home page. The date the privacy policy was last revised is identified at the top of the page.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Contact Information</h2>
                <p>
                  To ask questions or comment about this privacy policy and our privacy practices, contact us at:
                </p>
                <ul className="list-disc list-inside mt-2">
                  <li>Email: privacy@busywomen.com</li>
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

export default Privacy;
