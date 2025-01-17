import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; // ShadCN Button
import { Input } from "@/components/ui/input"; // ShadCN Input
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; // ShadCN Dialog
import axios from "axios";
import BASE_API_URL from "@/config/config";

const Navbar = ({ toggleTheme, currentTheme }) => {
  // Retrieve the username from localStorage
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  // State variables for managing the invite modal and input fields
  const [showModal, setShowModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteUsername, setInviteUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userid");
    localStorage.removeItem("username");
    localStorage.removeItem("email"); // Clear all stored user data
    navigate("/signin"); // Redirect to SignIn page
  };

  // Send an invitation email
  const sendInvite = async () => {
    // Validate that both email and username are provided
    if (!inviteEmail || !inviteUsername) {
      setMessage("Both fields are required!");
      return;
    }
  
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    // Check if both fields are valid emails
    if (!emailRegex.test(inviteEmail) || !emailRegex.test(inviteUsername)) {
      setMessage("Both fields must contain valid email addresses!");
      return;
    }
  

    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token"); // Retrieve the user's token
      const emailRequest = {
        to: inviteEmail,
        subject: "You're Invited to Collaborate on Notes App",
        body: `
          Hi there,

          You've been invited to join Notes App by ${username}.
          To collaborate on shared notes, please register using the following details:

          Username: ${inviteUsername}

          Click the link below to create your account and start collaborating:
          [Register Now](https://eclectic-gaufre-6ce38f.netlify.app/)

          Best regards,
          Notes App Team
        `,
      };

      // Send the invitation email via the backend
      await axios.post(`${BASE_API_URL}/email/sendinvite`, emailRequest, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Invitation sent successfully!");
      setInviteEmail(""); // Clear the email input
      setInviteUsername(""); // Clear the username input
    } catch (error) {
      setMessage("Failed to send the invitation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav
      className={`flex justify-between items-center p-4 shadow ${
        currentTheme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* Application title */}
      <h1 className="text-lg font-bold">Notes App</h1>

      <div className="flex items-center gap-4">
        {/* Theme toggle button */}
        <button
          onClick={toggleTheme}
          className={`p-2 border rounded text-sm flex items-center justify-center`}
          style={{
            backgroundColor: currentTheme === "light" ? "#f8f9fa" : "#1a1a2e",
            color: currentTheme === "light" ? "black" : "white",
          }}
          aria-label="Toggle Theme"
        >
          {currentTheme === "light" ? "🌙" : "🌞"}
        </button>

        {/* Conditional rendering for logged-in users */}
        {username ? (
          <>
            {/* Display logged-in username */}
            <p className="text-sm">
              Logged in as: <strong>{username}</strong>
            </p>
            {/* Invite button */}
            <Button
              variant="secondary"
              className={`${
                currentTheme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-black"
              }`}
              onClick={() => setShowModal(true)}
            >
              Invite
            </Button>
            {/* Logout button */}
            <Button
              variant="destructive"
              className={`${
                currentTheme === "dark"
                  ? "bg-red-700 hover:bg-red-600 text-white"
                  : "bg-red-500 hover:bg-red-400 text-white"
              }`}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            {/* If not logged in, show SignIn and SignUp buttons */}
            <Button
              variant="link"
              className={`${
                currentTheme === "dark" ? "text-blue-400 hover:underline" : "text-blue-600 hover:underline"
              }`}
              onClick={() => navigate("/signin")}
            >
              Sign In
            </Button>
            <Button
              variant="default"
              className={`${
                currentTheme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>
          </>
        )}
      </div>

      {/* Dialog for sending invitations */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent
          className={`${
            currentTheme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <DialogHeader>
            <DialogTitle>Send Invitation</DialogTitle>
            <DialogDescription>
              Invite a user to collaborate by providing their email and username.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Input for invitee's email */}
            <Input
              type="email"
              placeholder="Recipient Email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className={`${
                currentTheme === "dark"
                  ? "bg-gray-700 text-white placeholder-gray-400"
                  : "bg-white text-black placeholder-gray-500"
              }`}
            />
            {/* Input for invitee's username */}
            <Input
              type="email"
              placeholder="Username for Registration"
              value={inviteUsername}
              onChange={(e) => setInviteUsername(e.target.value)}
              className={`${
                currentTheme === "dark"
                  ? "bg-gray-700 text-white placeholder-gray-400"
                  : "bg-white text-black placeholder-gray-500"
              }`}
            />
          </div>
          <DialogHeader>
            {/* Send Invite button */}
            <Button
              variant="default"
              onClick={sendInvite}
              disabled={loading}
              className={`${
                currentTheme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {loading ? "Sending..." : "Send Invite"}
            </Button>
            {/* Cancel button */}
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              className={`${
                currentTheme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-black"
              }`}
            >
              Cancel
            </Button>
          </DialogHeader>
          {/* Feedback message */}
          {message && <p className="text-sm mt-2">{message}</p>}
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navbar;
