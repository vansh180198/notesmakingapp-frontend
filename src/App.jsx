import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./component/SignIn";
import SignUp from "./component/SignUp";
import NotesList from "./component/NotesList";
import Navbar from "./component/Navbar";

// Helper function to check login status
// Returns true if a token exists in localStorage, otherwise false.
const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  return !!token; // Double negation to ensure boolean output
};

// PrivateRoute Component
// Ensures that only logged-in users can access protected routes.
// If the user is not logged in, they are redirected to the SignIn page.
const PrivateRoute = ({ children }) => {
  if (isLoggedIn()) {
    return children; // Render the protected component if logged in
  }
  return <Navigate to="/signin" replace />; // Redirect to SignIn if not logged in
};

// Main App Component
const App = () => {
  // State to manage the theme, initialized from localStorage or defaulting to "light"
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Effect to update the DOM class for the theme and save the current theme in localStorage
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark"); // Add "dark" class for dark mode
    } else {
      document.documentElement.classList.remove("dark"); // Remove "dark" class for light mode
    }
    localStorage.setItem("theme", theme); // Persist theme preference
  }, [theme]);

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <Router>
      {/* Navbar Component with theme toggling functionality */}
      <Navbar toggleTheme={toggleTheme} currentTheme={theme} />
      <div
        className={`app-container ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
      >
        <Routes>
          {/* Public Routes */}
          {/* Route for SignIn page */}
          <Route path="/signin" element={<SignIn theme={theme} />} />
          {/* Route for SignUp page */}
          <Route path="/signup" element={<SignUp theme={theme} />} />

          {/* Private Routes */}
          {/* Route for NotesList (protected, accessible only if logged in) */}
          <Route
            path="/notes"
            element={
              <PrivateRoute>
                <NotesList theme={theme} />
              </PrivateRoute>
            }
          />

          {/* Fallback for other routes */}
          {/* Redirect to NotesList if logged in or SignIn if not logged in */}
          <Route
            path="*"
            element={
              isLoggedIn() ? <Navigate to="/notes" replace /> : <Navigate to="/signin" replace />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
