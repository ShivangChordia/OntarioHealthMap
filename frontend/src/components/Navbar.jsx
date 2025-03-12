import { Link } from "react-router-dom";
import { auth } from "../firebase"; // Import Firebase Auth
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth"; // Import auth state listener & sign out

const Navbar = () => {
  const [user, setUser] = useState(null);

  // Check if user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set user state if authenticated
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // Handle sign out
  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <div className="bg-blue-700 text-white shadow-md">
      <div className="flex items-center justify-between py-4 px-6">
        <Link to="/home">
          <h1 className="text-2xl font-bold">Ontario Health Maps</h1>
        </Link>

        <nav className="space-x-6">
          {/* Show these links only if user is authenticated */}
          {user ? (
            <>
              <Link to="/about" className="hover:text-gray-300">
                About
              </Link>
              <Link to="/contact" className="hover:text-gray-300">
                Contact
              </Link>
              <button
                onClick={handleSignOut}
                className="text-red-300 font-semibold hover:text-red-500"
              >
                Sign Out
              </button>
            </>
          ) : (
            // Show Sign In only if user is NOT authenticated
            <Link to="/signin" className="font-semibold hover:text-gray-300">
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
