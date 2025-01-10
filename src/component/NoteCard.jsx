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
  // console.log("check",note.content.slice(0,100))
  
  
  
  return(
    
  <Card
    className="note-item p-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
    style={{
      height:"300px",
      backgroundColor: theme === "dark" ? "#001861" : "#FFFBCC", // Card background color based on theme
      color: theme === "dark" ? "white" : "#000000", // Text color based on theme
    }}
  >
    <div style={{display:"flex",flexDirection:"column",height:"100%",justifyContent:"space-between"}}>
    {/* Card Header with Note Title */}
    <CardHeader>
      <CardTitle style={{ color: "#FF7F50" }}>{note.title}</CardTitle>
    </CardHeader>

    {/* Card Content with Note Details */}
    <CardContent>
        {/* Note Category */}
      <p className="font-bold">
        Category: <span className="font-normal">{note.category || "Uncategorized"}</span>
      </p>

      {/* Note Collaborators */}
      <span className="font-bold">Collaborators:</span>
      {}
      <span style={{textDecoration:"underline",wordBreak: "break-word" }} className="font-normal">
        {note.collaborators.length >= 1
          ? note.collaborators.join(", ") // List of collaborators
          : "No collaborators"} 
      </span>
      {/* Note Content Preview */}
      <p style={{ wordBreak: "break-word" }}>
  {note.content.slice(0, 50)}...
</p>      
 
     
    </CardContent>
    <div>
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
    </div>
    </div>
  </Card>
)};

export default NoteCard;
