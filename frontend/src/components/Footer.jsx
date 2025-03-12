import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <p>© 2025 Ontario Health Maps. All rights reserved.</p>
        <nav className="space-x-6">
          <Link to="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link to="/terms-of-service" className="hover:underline">
            Terms of Service
          </Link>
          <Link to="/contact" className="hover:underline">
            Contact
          </Link>
        </nav>
      </div>
            
    </footer>
  );
};

export default Footer;
