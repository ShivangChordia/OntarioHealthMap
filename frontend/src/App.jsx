import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignIn from "./pages/Signin";
import RequestAccess from "./pages/RequestAccess";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Contact from "./pages/ContactPage";
import About from "./pages/About";
import Home from "./pages/Home";
import DiseaseAnalysis from "./pages/DiseaseAnalysis";
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/request-access" element={<RequestAccess />} />
      <Route path="/home" element={<Home />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/analysis" element={<DiseaseAnalysis />} />
    </Routes>
  );
}

export default App;
