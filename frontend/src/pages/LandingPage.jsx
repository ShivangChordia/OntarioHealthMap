import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const LandingPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md fixed w-full z-10">
        <Navbar />
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-blue-700">
              Mapping Ontario's Health Resources
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Access comprehensive, interactive maps of healthcare facilities,
              services, and health indicators across Ontario.
            </p>
            <div className="mt-6 space-x-4">
              <Link
                to="/signin"
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                Sign In
              </Link>
              <Link
                to="/request-access"
                className="px-6 py-3 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition"
              >
                Request Access
              </Link>
            </div>
          </div>
          <div className="mt-10 md:mt-0">
            <img
              src="/assets/landingPage1.jpg"
              alt="Healthcare Map"
              className="rounded-lg w-300 shadow-md"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-blue-700">
              About Ontario Health Maps
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Ontario Health Maps is a platform designed to help healthcare
              professionals, researchers, and policymakers visualize and analyze
              health data across the province.
            </p>
            <p className="mt-2 text-lg text-gray-600">
              Our mission is to improve healthcare planning and delivery by
              providing accurate, up-to-date healthcare data and insights.
            </p>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <img
              src="/assets/landingPage2.jpg"
              alt="Healthcare Data"
              className="py-10 pl-10 rounded-lg shadow-md"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-700 text-white text-center">
        <h2 className="text-3xl font-bold">
          Ready to explore Ontario’s health landscape?
        </h2>
        <p className="mt-4 text-lg">
          Join healthcare professionals across Ontario who are using our
          platform to make data-driven decisions.
        </p>
        <div className="mt-6 space-x-4">
          <Link
            to="/signin"
            className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition"
          >
            Sign In
          </Link>
          <Link
            to="/request-access"
            className="px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-700 transition"
          >
            Request Access
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default LandingPage;
