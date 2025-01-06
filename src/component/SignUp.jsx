/**
 * SignUp Component
 *
 * This component provides a user interface for new users to register for the application.
 * It adapts styles dynamically based on the theme ("dark" or "light").
 *
 * Props:
 * - theme: The current theme of the application to adjust the styling.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; // ShadCN Button
import { Input } from "@/components/ui/input"; // ShadCN Input
import BASE_API_URL from "@/config/config";

const SignUp = ({ theme }) => {
  // State variables to manage user input
  const [email, setEmail] = useState(""); // State for the user's email
  const [password, setPassword] = useState(""); // State for the user's password
  const [name, setName] = useState(""); // State for the user's name
  const navigate = useNavigate(); // Hook for navigation between routes

  /**
   * Handles the form submission for user registration.
   * - Sends a POST request to the server with the user's registration details.
   * - On success, navigates to the Sign In page.
   * - Displays an error message if the registration fails.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${BASE_API_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }), // User details sent in the request body
    });

    if (response.ok) {
      // Registration successful
      alert("Registration successful! Please log in.");
      navigate("/signin"); // Redirect to Sign In page
    } else {
      // Registration failed, display error message
      const errorMessage = await response.text();
      alert(errorMessage);
    }
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      }`}
    >
      {/* Form Container */}
      <div
        className={`form-container max-w-md w-full p-6 border rounded-md shadow-md ${
          theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
        }`}
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>
        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input for Name */}
          <div>
            <Input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)} // Update name state
              required
              className={`${
                theme === "dark"
                  ? "bg-gray-700 text-white placeholder-gray-400"
                  : "bg-white text-black placeholder-gray-500"
              }`}
            />
          </div>
          {/* Input for Email */}
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update email state
              required
              className={`${
                theme === "dark"
                  ? "bg-gray-700 text-white placeholder-gray-400"
                  : "bg-white text-black placeholder-gray-500"
              }`}
            />
          </div>
          {/* Input for Password */}
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password state
              required
              className={`${
                theme === "dark"
                  ? "bg-gray-700 text-white placeholder-gray-400"
                  : "bg-white text-black placeholder-gray-500"
              }`}
            />
          </div>
          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              variant="default"
              className={`w-full ${
                theme === "dark"
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Sign Up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
