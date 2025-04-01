import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen">
        {/* Hero Section */}
        <section className="py-16 bg-blue-50">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-4xl font-extrabold text-blue-700 mb-4">
              Ontario Health Maps - Privacy Policy
            </h1>
            <p className="text-lg text-gray-700">
              Effective Date: 03/03/2025 | Last Updated: 03/03/2025
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 text-gray-800 space-y-10">
            {/* ✅ Introduction */}
            <section>
              <h2 className="text-3xl font-bold text-blue-700">
                1. Introduction
              </h2>
              <p className="mt-4 text-lg text-gray-700">
                Ontario Health Maps ("we," "our," or "us") values your privacy.
                This Privacy Policy explains how we collect, use, and protect
                your personal information in compliance with the{" "}
                <span className="font-semibold">
                  Personal Information Protection and Electronic Documents Act
                  (PIPEDA)
                </span>
                .
              </p>
            </section>

            {/* ✅ Information We Collect */}
            <section>
              <h2 className="text-3xl font-bold text-blue-700">
                2. Information We Collect
              </h2>

              {/* A. Voluntarily Provided Information */}
              <h3 className="text-xl font-semibold mt-6">
                A. Voluntarily Provided Information
              </h3>
              <ul className="list-disc pl-6 mt-2 text-lg text-gray-700 space-y-2">
                <li>First Name, Last Name, Email, Password</li>
                <li>Healthcare Organization, Professional Role</li>
                <li>Access Request Details</li>
              </ul>

              {/* B. Automatically Collected Information */}
              <h3 className="text-xl font-semibold mt-6">
                B. Automatically Collected Information
              </h3>
              <ul className="list-disc pl-6 mt-2 text-lg text-gray-700 space-y-2">
                <li>
                  IP address, browser type, device information, pages visited
                </li>
                <li>Usage data and engagement patterns</li>
              </ul>
            </section>

            {/* ✅ How We Use Your Information */}
            <section>
              <h2 className="text-3xl font-bold text-blue-700">
                3. How We Use Your Information
              </h2>
              <ul className="list-disc pl-6 mt-4 text-lg text-gray-700 space-y-2">
                <li>To process registration and access requests</li>
                <li>To verify professional background</li>
                <li>To improve security and user experience</li>
                <li>To respond to support requests</li>
                <li>To comply with legal requirements</li>
              </ul>
            </section>

            {/* ✅ Data Protection */}
            <section>
              <h2 className="text-3xl font-bold text-blue-700">
                4. Data Protection and Security
              </h2>
              <p className="mt-4 text-lg text-gray-700">
                We implement reasonable security measures to protect against
                unauthorized access, data breaches, and loss. Sensitive data
                like passwords are{" "}
                <span className="font-semibold">encrypted before storage</span>.
              </p>
            </section>

            {/* ✅ Data Retention */}
            <section>
              <h2 className="text-3xl font-bold text-blue-700">
                5. Retention of Data
              </h2>
              <p className="mt-4 text-lg text-gray-700">
                We keep your data only as long as necessary for providing
                services, verifying requests, and fulfilling legal obligations.
              </p>
            </section>

            {/* ✅ Your Rights Under PIPEDA */}
            <section>
              <h2 className="text-3xl font-bold text-blue-700">
                6. Your Rights Under PIPEDA
              </h2>
              <ul className="list-disc pl-6 mt-4 text-lg text-gray-700 space-y-2">
                <li>Access to your stored personal data</li>
                <li>Request for correction of inaccurate information</li>
                <li>Request for deletion (except where legally required)</li>
              </ul>
            </section>

            {/* ✅ Contact */}
            <section>
              <h2 className="text-3xl font-bold text-blue-700">
                7. Contact Us
              </h2>
              <p className="mt-4 text-lg text-gray-700">
                If you have any questions about our Privacy Policy, please
                contact us at:
              </p>
              <p className="mt-2 text-lg">
                📧 Email:{" "}
                <a
                  href="mailto:ontariohealthmaps@gmail.com"
                  className="text-blue-600 hover:underline"
                >
                  ontariohealthmaps@gmail.com
                </a>
              </p>
            </section>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicy;
