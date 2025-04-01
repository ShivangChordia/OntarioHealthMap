import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Map, Search } from "lucide-react";
import { auth } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Initialize navigation hook

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleLogoClick = () => {
    if (user) {
      navigate("/"); // If authenticated, go to home
    } else {
      navigate("/signin"); // If not authenticated, go to sign-in page
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#2563EB] text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left Side: Logo & Title - Click redirects based on auth status */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleLogoClick}
        >
          <Map className="h-6 w-6 text-white" />
          <h1 className="text-xl font-bold">Ontario Health Maps</h1>
        </div>

        {/* Right Side: Navigation Links */}
        <nav className="flex items-center gap-4">
          <Link to="/about" className="text-sm font-medium hover:underline">
            About
          </Link>
          <Link to="/contact" className="text-sm font-medium hover:underline">
            Contact
          </Link>

          {user ? (
            <button
              onClick={handleSignOut}
              className="bg-white text-[#2563EB] px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-200"
            >
              Sign Out
            </button>
          ) : (
            <Link
              to="/signin"
              className="bg-white text-[#2563EB] px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-200"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
