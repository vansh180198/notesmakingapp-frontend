/**
 * NotesGrid Component
 *
 * This component renders a grid layout of notes using the `NoteCard` component for each note.
 * It handles the case where no notes are available and dynamically adjusts based on the theme.
 *
 * Props:
 * - theme: The current theme ("dark" or "light") to apply styles dynamically.
 * - notes: An array of note objects to display.
 * - onEditNote: Callback function to handle editing a note.
 * - onDeleteNote: Callback function to handle deleting a note.
 * - loggedInUserEmail: The email of the currently logged-in user to determine permissions for actions.
 */

import React from "react";
import NoteCard from "./NoteCard";

const NotesGrid = ({ theme, notes, onEditNote, onDeleteNote, loggedInUserEmail }) => {
  // Handle case where no notes are available
  if (!notes || notes.length === 0) {
    return <p className="text-center">No notes available.</p>; // Display message when notes array is empty
  }

  return (
    <div className="notes-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Map over notes array to render each note as a NoteCard */}
      {notes.map((note) => (
        <NoteCard
          key={note.id} // Unique key for React to efficiently re-render
          theme={theme} // Pass current theme for styling
          note={note} // Pass note object to NoteCard
          onEdit={() => onEditNote(note)} // Handle edit action for the note
          onDelete={() => onDeleteNote(note.id)} // Handle delete action for the note
          loggedInUserEmail={loggedInUserEmail} // Pass logged-in user email for permission checks

        />
      ))}
    </div>
  );
};

export default NotesGrid;
