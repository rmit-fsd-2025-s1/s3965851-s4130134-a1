import React from "react";
import { Link } from "react-router-dom";

// Navigation bar component displayed at the top of the app.
// Uses Tailwind CSS for styling and layout.
const Navbar = () => (
  <nav className="bg-blue-600 text-white p-4 shadow flex justify-center">
    <div className="flex gap-6">
      {/* Navigation links */}
      <Link className="hover:bg-blue-800 px-4 py-2 rounded transition" to="/">Home</Link>

      {/* Additional links can be added here if needed */}
      {/* <Link className="hover:bg-blue-800 px-4 py-2 rounded transition" to="/login">Sign In</Link>
      <Link className="hover:bg-blue-800 px-4 py-2 rounded transition" to="/signup">Register</Link> */}

      <Link className="hover:bg-blue-800 px-4 py-2 rounded transition" to="/lecturer">Lecturer Panel</Link>
    </div>
  </nav>
);

export default Navbar;
