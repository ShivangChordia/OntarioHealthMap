import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const TermsOfService = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen">
        {/* Hero Section */}
        <section className="py-16 bg-blue-50">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-4xl font-extrabold text-blue-700 mb-4">
              Terms of Service
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
                Welcome to{" "}
                <span className="font-semibold">Ontario Health Maps</span>. By
                using our services, you agree to comply with these Terms of
                Service.
              </p>
            </section>

            {/* ✅ User Responsibilities */}
            <section>
              <h2 className="text-3xl font-bold text-blue-700">
                2. User Responsibilities
              </h2>
              <ul className="list-disc pl-6 mt-4 text-lg text-gray-700 space-y-2">
                <li>Users must provide accurate registration information.</li>
                <li>
                  Users must not misuse health data or violate privacy laws.
                </li>
                <li>Unauthorized redistribution of data is prohibited.</li>
              </ul>
            </section>

            {/* ✅ Data Usage Restrictions */}
            <section>
              <h2 className="text-3xl font-bold text-blue-700">
                3. Data Usage Restrictions
              </h2>
              <p className="mt-4 text-lg text-gray-700">
                Data provided is for{" "}
                <span className="font-semibold">
                  research and educational purposes only
                </span>
                . Unauthorized commercial use is strictly prohibited.
              </p>
            </section>

            {/* ✅ Liability Limitation */}
            <section>
              <h2 className="text-3xl font-bold text-blue-700">
                4. Liability Limitation
              </h2>
              <p className="mt-4 text-lg text-gray-700">
                <span className="font-semibold">Ontario Health Maps</span>
                is not responsible for any decisions made based on the provided
                health data. Users should consult professionals before making
                health-related decisions.
              </p>
            </section>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-700 text-white text-center">
          <h2 className="text-3xl font-bold">Need More Information?</h2>
          <p className="mt-4 text-lg">
            Contact our support team if you have questions about our Terms of
            Service.
          </p>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default TermsOfService;
