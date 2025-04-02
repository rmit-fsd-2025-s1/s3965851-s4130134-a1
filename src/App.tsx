import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import Navbar from "./components/Navbar.tsx";
import LoginForm from "./components/LoginForm.tsx";
import ApplicantList from "./components/ApplicantList.tsx";

// Home landing page component
const Home = () => (
  <div className="p-8 max-w-3xl mx-auto text-center">
    {/* Avatar image */}
    {/* <img
      // src="https://uifaces.co/our-content/donated/1H_7AxP0.jpg"
      alt="Welcome"
      className="mx-auto w-32 h-32 rounded-full shadow mb-6"
    /> */}

    {/* Welcome title */}
    <h1 className="text-4xl font-bold mb-4 text-gray-800">
      Welcome to the <span className="text-blue-600">TeachTeam</span> System
    </h1>

    {/* System introduction */}
    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
      TeachTeam is an internal system used by the School of Computing to recruit part-time tutors.
      Lecturers can view and evaluate applications, and tutors can submit detailed role applications.
    </p>

    {/* Action buttons (non-functional placeholders) */}
    <div className="flex justify-center gap-4 mt-6">
      <a
        href="/login"
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow"
      >
        Sign In
      </a>
      <a
        href="/signup"
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded shadow"
      >
        Register
      </a>
    </div>
  </div>
);

// Main App component with routes and layout
function App() {
  useEffect(() => {
    // Store a dummy user in localStorage if not already present
    const existingUser = localStorage.getItem("user");
    if (!existingUser) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: "test@rmit.edu.au",
          password: "StrongPass123",
        })
      );
    }
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/lecturer" element={<ApplicantList />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
