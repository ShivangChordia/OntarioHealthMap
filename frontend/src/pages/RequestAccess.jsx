import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  db,
  auth,
  collection,
  addDoc,
  createUserWithEmailAndPassword,
} from "../firebase";
import { doc, setDoc } from "firebase/firestore"; // Ensure Firestore functions are imported
const RequestAccess = () => {
  // State to store form values
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    organization: "",
    role: "",
    licenseNumber: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Create User in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // 2️⃣ Save user details in Firestore using their UID
      await setDoc(doc(db, "users", user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        organization: formData.organization,
        role: formData.role,
        licenseNumber: formData.licenseNumber,
        reason: formData.reason,
        createdAt: new Date(),
      });

      alert("User created & details saved successfully!");
      navigate("/home");
    } catch (error) {
      console.error("Error creating user: ", error);
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4 py-10">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl w-full border border-gray-300">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-blue-700 mt-2">
            Request Access
          </h1>
          <p className="text-gray-600 mt-2 text-sm">
            Complete this form to request access to Ontario Health Maps. For
            healthcare professionals and authorized personnel only.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Personal Information */}
          <fieldset className="border-t border-gray-300 pt-4">
            <legend className="text-lg font-semibold text-blue-700">
              📄 Personal Information
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  className="input-field"
                  required
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="input-field"
                required
              />
            </div>
            <div className="mt-3">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="input-field"
                required
              />
            </div>
          </fieldset>

          {/* Professional Information */}
          <fieldset className="border-t border-gray-300 pt-4">
            <legend className="text-lg font-semibold text-blue-700">
              🏥 Professional Information
            </legend>
            <div className="mt-3">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Healthcare Organization
              </label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="Enter your organization name"
                className="input-field"
                required
              />
            </div>
            <div className="mt-3">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Professional Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select your role</option>
                <option>Student</option>
                <option>Healthcare Professional</option>
                <option>Researcher</option>
                <option>Other</option>
              </select>
            </div>
          </fieldset>

          {/* Access Request Details */}
          <fieldset className="border-t border-gray-300 pt-4">
            <legend className="text-lg font-semibold text-blue-700">
              ✉️ Access Request Details
            </legend>
            <div className="mt-3">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Reason for Request
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Describe why you need access..."
                className="input-field h-24"
                required
              ></textarea>
            </div>
          </fieldset>

          {/* Submit Button */}
          <div className="text-center mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition w-full"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <Link to="/" className="text-blue-600 hover:underline">
            ← Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RequestAccess;
