import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import React from "react";

// Login form component with email, password, CAPTCHA validation, and success feedback.
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [captcha, setCaptcha] = useState(false); // CAPTCHA check result
  const [message, setMessage] = useState("");    // Feedback message to the user
  const navigate = useNavigate();

  // Login handler
  const handleLogin = () => {
    if (!captcha) {
      setMessage("⚠️ Please complete the CAPTCHA verification!");
      return;
    }

    // Retrieve stored user info from localStorage
    const stored = JSON.parse(localStorage.getItem("user") || "{}");

    // Check if email and password match
    if (email === stored.email && pwd === stored.password) {
      setMessage("✅ Login successful!");
      setTimeout(() => navigate("/lecturer"), 1000);
    } else {
      setMessage("❌ Login failed. Please check your email or password.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-10 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>

      {/* Email input */}
      <input
        type="email"
        placeholder="Email"
        className="border p-2 mb-3 w-full rounded"
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Password input */}
      <input
        type="password"
        placeholder="Password"
        className="border p-2 mb-3 w-full rounded"
        onChange={(e) => setPwd(e.target.value)}
      />

      {/* CAPTCHA Component */}
      <div className="mb-3">
        <ReCAPTCHA
          sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Google test site key
          onChange={() => setCaptcha(true)}
        />
      </div>

      {/* Submit button */}
      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        onClick={handleLogin}
      >
        Sign In
      </button>

      {/* Feedback message */}
      {message && <p className="mt-3 text-center text-sm">{message}</p>}
    </div>
  );
};

export default LoginForm;
