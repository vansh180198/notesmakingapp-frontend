/**
 * OnlineUsers Component
 *
 * This component displays a button to toggle a dropdown showing a list of online users.
 * The appearance of the component adapts to the provided theme (dark or light).
 *
 * Props:
 * - onlineUsers: An array of strings representing the usernames or email addresses of online users.
 * - isOnlineUsersTabOpen: A boolean indicating whether the dropdown of online users is visible.
 * - toggleOnlineUsersTab: A function to toggle the visibility of the online users dropdown.
 * - theme: The current theme ("dark" or "light") to dynamically style the component.
 */

import React from "react";
import { Button } from "@/components/ui/button";

const OnlineUsers = ({ onlineUsers, isOnlineUsersTabOpen, toggleOnlineUsersTab, theme }) => {

  // Determine dynamic styles based on the theme
  const containerStyles = {
    backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF", // Background color changes with theme
    color: theme === "dark" ? "#FFFFFF" : "#000000", // Text color changes with theme
  };

  return (
    <div className="fixed bottom-4 right-4">
      {/* Toggle Button */}
      <Button
        variant="default"
        className="p-4 rounded-full shadow-lg" // Styling for the button
        onClick={() => toggleOnlineUsersTab((prev) => !prev)} // Toggle the dropdown visibility
        style={containerStyles} // Apply dynamic styles
      >
        {isOnlineUsersTabOpen ? "x" : "Online Users"} {/* Label changes based on dropdown visibility */}
      </Button>

      {/* Dropdown to display online users */}
      {isOnlineUsersTabOpen && (
        <div
          className="shadow-md p-4 rounded-lg mt-2 max-h-64 overflow-y-auto" // Styling for the dropdown
          style={containerStyles} // Apply dynamic styles
        >
          <h3 className="font-bold text-lg mb-2">Online Users</h3> {/* Title of the dropdown */}
          {onlineUsers.length > 0 ? (
            <ul>
              {onlineUsers.map((user, index) => (
                <li
                  key={index}
                  className="py-1 border-b last:border-none" // Styling for individual user items
                >
                  {user} {/* Display the user's name or email */}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">
              No users are online currently. {/* Message when no users are online */}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default OnlineUsers;
