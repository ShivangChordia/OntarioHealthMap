import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { db } from "../firebase"; // Import Firestore
import { collection, addDoc } from "firebase/firestore";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setStatusMessage("⚠️ Please fill in all fields.");
      return;
    }

    try {
      await addDoc(collection(db, "messages"), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        timestamp: new Date(),
      });

      setStatusMessage("✅ Your message has been sent successfully!");
      setFormData({ name: "", email: "", message: "" }); // Clear form
    } catch (error) {
      console.error("Error adding message to Firestore:", error);
      setStatusMessage("❌ Failed to send message. Try again later.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen">
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

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
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
                  href="mailto:ontariohealthmaps@gmail.com"
                  className="text-blue-600 hover:underline"
                >
                  ontariohealthmaps@gmail.com
                </a>
              </p>
              <h2 className="text-3xl font-bold text-blue-700 border-b pb-3 mb-4 mt-8">
                📍 Address
              </h2>
              <p className="text-lg text-gray-700">Conestoga College</p>
              <p className="text-lg text-gray-700">
                108 University Avenue East, Waterloo, Ontario
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-3xl font-bold text-blue-700 border-b pb-3 mb-4">
                📩 Send Us a Message
              </h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-lg font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
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
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg shadow-sm"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
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
              {statusMessage && (
                <p className="mt-4 text-lg text-center font-semibold">
                  {statusMessage}
                </p>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ContactPage;
