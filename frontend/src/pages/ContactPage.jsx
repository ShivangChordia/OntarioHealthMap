import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Contact = () => {
  return (
    <>
      <Navbar />

      <div className="bg-gray-100 min-h-screen">
        {/* Hero Section */}
        <section className="py-16 bg-blue-50">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-4xl font-extrabold text-blue-700 mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-gray-700">
              We're here to help! Reach out to us with any questions or
              feedback.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Details */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-3xl font-bold text-blue-700 border-b pb-3 mb-4">
                📧 Support
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                If you have any questions, please contact our support team at:
              </p>
              <p className="text-lg">
                📩 Email:{" "}
                <a
                  href="mailto:support@ontariohealthmaps.com"
                  className="text-blue-600 hover:underline"
                >
                  support@ontariohealthmaps.com
                </a>
              </p>

              <h2 className="text-3xl font-bold text-blue-700 border-b pb-3 mb-4 mt-8">
                🕒 Business Hours
              </h2>
              <p className="text-lg text-gray-700">
                Monday – Friday: <strong>9 AM – 5 PM EST</strong>
              </p>
              <p className="text-lg text-gray-700">Saturday – Sunday: Closed</p>

              <h2 className="text-3xl font-bold text-blue-700 border-b pb-3 mb-4 mt-8">
                📍 Address
              </h2>
              <p className="text-lg text-gray-700">Conestoga College</p>
              <p className="text-lg text-gray-700">
                108 University Avenue East, Waterloo, Ontario
              </p>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-3xl font-bold text-blue-700 border-b pb-3 mb-4">
                📩 Send Us a Message
              </h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-lg font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg shadow-sm"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full p-3 border rounded-lg shadow-sm"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    className="w-full p-3 border rounded-lg shadow-sm"
                    rows="4"
                    placeholder="Your message..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-700 text-white text-center">
          <h2 className="text-3xl font-bold">Need Immediate Assistance?</h2>
          <p className="mt-4 text-lg">
            Our team is here to support you. Don't hesitate to reach out!
          </p>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Contact;
