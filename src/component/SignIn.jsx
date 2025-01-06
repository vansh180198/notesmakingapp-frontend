/**
 * SignIn Component
 *
 * This component provides a user interface for signing into the application.
 * It includes theme-based styling, form inputs for email and password, 
 * and functionality to authenticate the user and fetch their details.
 *
 * Props:
 * - theme: The current theme ("dark" or "light") to apply dynamic styles.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; // ShadCN Button
import { Input } from "@/components/ui/input"; // ShadCN Input
import BASE_API_URL from "@/config/config";

const SignIn = ({ theme }) => {
  const [email, setEmail] = useState(""); // State to store the user's email
  const [password, setPassword] = useState(""); // State to store the user's password
  const navigate = useNavigate(); // Hook for navigation

  /**
   * Handles the form submission to authenticate the user.
   * - Sends a login request to the backend.
   * - Fetches user details on successful login.
   * - Stores token and user details in localStorage.
   * - Navigates to the notes page after successful login.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Authenticate user
      const loginResponse = await fetch(`${BASE_API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!loginResponse.ok) {
        alert("Invalid email or password!");
        return;
      }

      const loginData = await loginResponse.json();
      localStorage.setItem("token", loginData.token); // Store token in localStorage

      // Step 2: Fetch user details
      const userDetailsResponse = await fetch(`${BASE_API_URL}/users/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${loginData.token}`, // Pass token in Authorization header
        },
      });

      if (!userDetailsResponse.ok) {
        alert("Failed to fetch user details!");
        return;
      }

      const userDetails = await userDetailsResponse.json();

      // Step 3: Store user details in localStorage
      localStorage.setItem("userId", userDetails.id);
      localStorage.setItem("email", userDetails.email);
      localStorage.setItem("username", userDetails.name);

      // Navigate to notes page after successful login
      alert("Login successful!");
      navigate("/notes");
    } catch (error) {
      console.error("Login failed:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      }`}
    >
      {/* Sign In Form Container */}
      <div
        className={`max-w-md w-full p-8 shadow-lg rounded-md ${
          theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
        }`}
      >
        <h2 className="text-3xl font-semibold mb-6 text-center">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`${
              theme === "dark"
                ? "bg-gray-700 text-white placeholder-gray-400"
                : "bg-white text-black placeholder-gray-500"
            }`}
          />
          {/* Password Input */}
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={`${
              theme === "dark"
                ? "bg-gray-700 text-white placeholder-gray-400"
                : "bg-white text-black placeholder-gray-500"
            }`}
          />
          {/* Submit Button */}
          <Button
            type="submit"
            className={`w-full ${
              theme === "dark"
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            variant="default"
          >
            Sign In
          </Button>
        </form>
        {/* Navigation to Sign Up */}
        <p className="text-sm mt-4 text-center">
          Don't have an account?{" "}
          <Button
            variant="link"
            className={`p-2 ${
              theme === "dark" ? "text-blue-400 hover:underline" : "text-blue-600 hover:underline"
            }`}
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </Button>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
