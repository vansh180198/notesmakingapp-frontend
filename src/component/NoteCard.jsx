/**
 * NoteCard Component
 *
 * This component renders a single note card with details such as title, content preview, category,
 * and collaborators. It also provides options to edit or delete the note.
 *
 * Props:
 * - theme: The current theme ("dark" or "light") to dynamically adjust the styles.
 * - note: The note object containing details like title, content, category, collaborators, and creator.
 * - onEdit: Callback function to handle editing the note.
 * - onDelete: Callback function to handle deleting the note.
 * - loggedInUserEmail: The email of the currently logged-in user to check permissions for deleting.
 */

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NoteCard = ({ theme, note, onEdit, onDelete, loggedInUserEmail }) => {
  
  
  
  
  return(
  
  <Card
    className="note-item p-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
    style={{
      backgroundColor: theme === "dark" ? "#B8860B" : "#FFFBCC", // Card background color based on theme
      color: theme === "dark" ? "#4B5563" : "#000000", // Text color based on theme
    }}
  >
    {/* Card Header with Note Title */}
    <CardHeader>
      <CardTitle>{note.title}</CardTitle>
    </CardHeader>

    {/* Card Content with Note Details */}
    <CardContent>
      {/* Note Content Preview */}
      <p>{note.content.slice(0, 100)}...</p>
      
      {/* Note Category */}
      <p className="font-bold">
        Category: <span className="font-normal">{note.category || "Uncategorized"}</span>
      </p>

      {/* Note Collaborators */}
      <p className="font-bold">Collaborators:</p>
      {}
      <p className="font-normal">
        {note.collaborators.length >= 1
          ? note.collaborators.join(", ") // List of collaborators
          : "No collaborators"} 
      </p>

      {/* Action Buttons for Editing and Deleting Notes */}
      <div className="flex gap-2 mt-2">
        {/* Edit Button */}
        <Button
          variant="outline"
          style={{ color: theme === "dark" ? "#FFFFFF" : "#000000" }} // Button text color based on theme
          onClick={onEdit} // Trigger edit callback
        >
          Edit
        </Button>

        {/* Delete Button (Visible only if the logged-in user is the creator of the note) */}
        {note.creator === loggedInUserEmail && (
          <Button
            variant="destructive"
            onClick={onDelete} // Trigger delete callback
          >
            Delete
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
)};

export default NoteCard;
