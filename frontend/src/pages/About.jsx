import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const About = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen">
        {/* Hero Section */}
        <section className="py-16 bg-blue-50">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-4xl font-extrabold text-blue-700 mb-6">
              About Ontario Health Maps
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Empowering healthcare professionals, researchers, and policymakers
              with
              <span className="font-semibold"> data-driven insights</span> to
              improve healthcare accessibility and transparency.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center">
            <div className="">
              <h2 className="text-3xl font-bold text-blue-700">
                Our Mission 🌍
              </h2>
              <p className="mt-4 text-lg text-gray-700 leading-relaxed">
                Ontario Health Maps provides{" "}
                <span className="font-semibold">
                  real-time health data visualization
                </span>
                to support research, policy-making, and healthcare planning.
              </p>
              <p className="mt-4 text-lg text-gray-700">
                We believe in using{" "}
                <span className="font-semibold">open data</span>
                to enhance healthcare accessibility, transparency, and
                efficiency.
              </p>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16 bg-blue-700 text-white text-center">
          <h2 className="text-3xl font-bold">🚀 Key Features</h2>
          <div className="max-w-5xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white text-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">
                📍 Interactive Health Map
              </h3>
              <p className="mt-2 text-lg">
                Visualizing disease prevalence across Ontario.
              </p>
            </div>
            <div className="p-6 bg-white text-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">📊 Data-Driven Insights</h3>
              <p className="mt-2 text-lg">
                Providing real-time analytics for research and policy support.
              </p>
            </div>
            <div className="p-6 bg-white text-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">
                🛠 User-Friendly Platform
              </h3>
              <p className="mt-2 text-lg">
                Designed for researchers, professionals, and the public.
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default About;
