import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const About = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-4xl font-extrabold mb-6">
              About Ontario Health Maps
            </h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              Empowering healthcare professionals, researchers, and policymakers
              with <span className="font-semibold">data-driven insights</span>{" "}
              to improve healthcare accessibility and transparency across
              Ontario.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-stretch gap-10">
              {/* Left Side - Image */}
              <div className="md:w-1/2 flex">
                <img
                  src="/assets/about.jpg"
                  alt="Health data visualization"
                  className="rounded-lg shadow-lg w-full object-cover h-100"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/600x400?text=Ontario+Health+Maps";
                  }}
                />
              </div>

              {/* Right Side - Text */}
              <div className="md:w-1/2 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-blue-700 mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  Ontario Health Maps provides{" "}
                  <span className="font-semibold">
                    comprehensive health data visualization
                  </span>{" "}
                  to support evidence-based research, policy-making, and
                  healthcare planning across the province.
                </p>
                <p className="text-lg text-gray-700 mb-4">
                  We believe in using{" "}
                  <span className="font-semibold">open data</span> to enhance
                  healthcare accessibility, transparency, and efficiency for all
                  Ontarians.
                </p>
                <p className="text-lg text-gray-700">
                  By mapping health indicators and demographics, we aim to
                  identify disparities, track trends, and support targeted
                  interventions that improve health outcomes for communities
                  throughout Ontario.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white text-gray-800 rounded-lg shadow-lg p-8 transform transition-transform hover:scale-105">
                <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-4">
                  Interactive Health Map
                </h3>
                <p className="text-gray-600 text-center">
                  Visualize disease incidence, prevalence, mortality, and
                  demographic data across Ontario regions with our intuitive
                  mapping interface.
                </p>
              </div>

              <div className="bg-white text-gray-800 rounded-lg shadow-lg p-8 transform transition-transform hover:scale-105">
                <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-4">
                  Data-Driven Insights
                </h3>
                <p className="text-gray-600 text-center">
                  Access analytics, statistical trends, and comparative analyses
                  to support research and evidence-based policy decisions.
                </p>
              </div>

              <div className="bg-white text-gray-800 rounded-lg shadow-lg p-8 transform transition-transform hover:scale-105">
                <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-4">
                  User-Friendly Platform
                </h3>
                <p className="text-gray-600 text-center">
                  Designed for researchers, healthcare professionals,
                  policymakers, and the general public with intuitive filtering
                  and customizable views.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Sources */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-blue-700 text-center mb-12">
              Our Data Sources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Public Health Ontario */}
              <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-blue-600">
                <h3 className="text-xl font-semibold text-blue-700 mb-4">
                  Public Health Ontario
                </h3>
                <p className="text-gray-700">
                  Comprehensive health surveillance data, disease tracking, and
                  population health statistics from Ontario's public health
                  agency.
                </p>
                <a
                  href="https://www.publichealthontario.ca/en/Data-and-Analysis/Using-Data/Open-Data"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-semibold mt-4 inline-block hover:underline"
                >
                  Learn More →
                </a>
              </div>

              {/* Statistics Canada */}
              <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-blue-600">
                <h3 className="text-xl font-semibold text-blue-700 mb-4">
                  Statistics Canada
                </h3>
                <p className="text-gray-700">
                  Demographic information, socioeconomic indicators, and census
                  data to provide context for health outcomes.
                </p>
                <a
                  href="https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/index-eng.cfm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-semibold mt-4 inline-block hover:underline"
                >
                  Learn More →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-blue-600 text-center mb-12">
              Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Software Developers Section */}
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-blue-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="2"
                      y="3"
                      width="20"
                      height="14"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">Developers</h3>
                <p className="text-gray-600 mb-6">
                  Our development team builds and maintains the platform,
                  creating interactive visualizations and ensuring data
                  accuracy.
                </p>
                <ul className="text-gray-700 space-y-3">
                  <li>
                    <span className="font-medium">Shivang Chordia</span>
                    <br />
                    <a
                      href="mailto:shivang@ontariohealthmaps.ca"
                      className="text-blue-600 hover:underline"
                    >
                      schordia1092@conestogac.on.ca
                    </a>
                  </li>
                  <li>
                    <span className="font-medium">Urvish Motivaras</span>
                    <br />
                    <a
                      href="mailto:urvish@ontariohealthmaps.ca"
                      className="text-blue-600 hover:underline"
                    >
                      umotivaras6368@conestogac.on.ca
                    </a>
                  </li>
                  <li>
                    <span className="font-medium">Keval Patel</span>
                    <br />
                    <a
                      href="mailto:keval@ontariohealthmaps.ca"
                      className="text-blue-600 hover:underline"
                    >
                      kpatel4341@conestogac.on.ca
                    </a>
                  </li>
                  <li>
                    <span className="font-medium">Jaygiri Goswami</span>
                    <br />
                    <a
                      href="mailto:jaygiri@ontariohealthmaps.ca"
                      className="text-blue-600 hover:underline"
                    >
                      jgoswami6697@conestogac.on.ca
                    </a>
                  </li>
                </ul>
              </div>

              {/* Advisors Section */}
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-blue-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4 text-center">Advisors</h3>

                <div className="grid grid-cols-1 gap-6">
                  {/* Ed Barsalou */}
                  <div className="border-b pb-4">
                    <h4 className="font-semibold text-lg text-blue-700">
                      Prof. Ed Barsalou
                    </h4>
                    <p className="text-gray-600 mb-2">
                      Project Stakeholder & Capstone Professor
                    </p>
                    <p className="text-gray-700 mb-2">
                      Provides project oversight and guidance, ensuring the
                      platform meets academic standards and industry
                      requirements.
                    </p>
                    <a
                      href="mailto:ed@ontariohealthmaps.ca"
                      className="text-blue-600 hover:underline"
                    >
                      ebarsalou@conestogac.on.ca
                    </a>
                  </div>

                  {/* Brian Campbell */}
                  <div className="border-b pb-4">
                    <h4 className="font-semibold text-lg text-blue-700">
                      Prof. Brian Campbell
                    </h4>
                    <p className="text-gray-600 mb-2">
                      Project Manager & Capstone Professor
                    </p>
                    <p className="text-gray-700 mb-2">
                      Supervises project development and implementation,
                      offering technical expertise and strategic direction.
                    </p>
                    <a
                      href="mailto:brian@ontariohealthmaps.ca"
                      className="text-blue-600 hover:underline"
                    >
                      bdcampbell@conestogac.on.ca
                    </a>
                  </div>

                  {/* Wendy Pons */}
                  <div className="border-b pb-4">
                    <h4 className="font-semibold text-lg text-blue-700">
                      Dr. Wendy Pons
                    </h4>
                    <p className="text-gray-600 mb-2">
                      Professor, Health and Life Sciences
                    </p>
                    <p className="text-gray-700 mb-2">
                      Epidemiology expert specializing in drinking water,
                      vector-borne & zoonotic diseases, with a PhD in
                      Epidemiology.
                    </p>
                    <a
                      href="mailto:wpons@conestogac.on.ca"
                      className="text-blue-600 hover:underline"
                    >
                      wpons@conestogac.on.ca
                    </a>
                  </div>

                  {/* Peter Mazdiak */}
                  <div>
                    <h4 className="font-semibold text-lg text-blue-700">
                      Prof. Peter Mazdiak
                    </h4>
                    <p className="text-gray-600 mb-2">Health Data Specialist</p>
                    <p className="text-gray-700 mb-2">
                      Provided essential guidance during the project's initial
                      phase, helping to establish the technical structure and
                      framework.
                    </p>
                    <a
                      href="mailto:peter@ontariohealthmaps.ca"
                      className="text-blue-600 hover:underline"
                    >
                      pmadziak@conestogac.on.ca
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Explore Ontario's Health Data?
            </h2>
            <p className="text-xl mb-8">
              Discover insights, track trends, and support evidence-based
              healthcare decisions with our interactive mapping platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
              >
                Explore the Map
              </a>
              <a
                href="/contact"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default About;
