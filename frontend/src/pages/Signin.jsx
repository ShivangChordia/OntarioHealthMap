import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle sign-in process
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home"); // Redirect to home page after successful login
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full border border-gray-200">
        {/* Header with Icon */}
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-blue-700 mt-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 mt-2 text-sm">
            Sign in to access Ontario Health Maps
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm text-center mt-3">{error}</p>
        )}

        {/* Sign-In Form */}
        <form onSubmit={handleSignIn} className="mt-6 space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="name@healthorg.ca"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-4"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-4"
                required
              />
            </div>
            <div className="text-right mt-1">
              <Link
                to="/forgot-password"
                className="text-blue-600 text-sm hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Sign In Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition w-full"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/request-access"
            className="text-blue-600 font-semibold hover:underline"
          >
            Request access
          </Link>
        </div>

        {/* Security Note */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Protected by enterprise-grade security
        </p>
      </div>
    </div>
  );
};

export default SignIn;
