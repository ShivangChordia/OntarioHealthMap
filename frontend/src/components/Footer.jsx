import { Link } from "react-router-dom";



const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-200 py-12">
      <div className="container mx-auto px-6">
        {/* Footer Grid - Improved layout with better spacing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left items-start">
          {/* Ontario Health Maps Section */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-sm">
            <h3 className="font-semibold text-white text-lg mb-3">
              Ontario Health Maps
            </h3>
            <p className="text-sm leading-relaxed text-gray-400">
              A comprehensive tool for visualizing health data across Ontario
              regions. Explore patterns, trends, and disparities in health
              outcomes.
            </p>
          </div>

          {/* Resources Section */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold text-white text-lg mb-3">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-white transition duration-300"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
              <Link
                  to="/terms-of-service"
                  className="hover:text-white transition duration-300"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold text-white text-lg mb-3">
              Get in Touch
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  to="/contact"
                  className="hover:text-white transition duration-300"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Copyright */}
        <div className="mt-10 pt-6 border-t border-slate-800 text-sm text-center text-gray-400">
          <p>
            © {new Date().getFullYear()} Ontario Health Maps. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
