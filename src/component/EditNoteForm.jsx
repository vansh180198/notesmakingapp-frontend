import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/**
 * EditNoteForm Component
 * 
 * A form for creating or editing a note. The form includes inputs for the title,
 * content, category, and collaborators of the note.
 * 
 * Props:
 * - newTitle: Current title of the note.
 * - setNewTitle: Function to update the note's title.
 * - newContent: Current content of the note.
 * - setNewContent: Function to update the note's content.
 * - newCategory: Current category of the note.
 * - setNewCategory: Function to update the note's category.
 * - newCollaborators: Current collaborators of the note.
 * - setNewCollaborators: Function to update the collaborators.
 * - handleSaveNote: Function to save the note.
 * - resetForm: Function to reset the form fields and state.
 * - isEditing: Boolean to indicate if the form is in editing mode.
 */
const EditNoteForm = ({
  newTitle,
  setNewTitle,
  newContent,
  setNewContent,
  newCategory,
  setNewCategory,
  newCollaborators,
  setNewCollaborators,
  handleSaveNote,
  resetForm,
  isEditing,
  noteCreator
}) =>{
console.log(noteCreator)
return(
  <div className="space-y-4"
  style={{
    borderRadius: "10px",
    padding:"20px",
    width: "63.6%", // Width for A4 proportions (based on 80% height)
    height: "80vh", // 80% of the viewport height
    margin: "auto", // Center the form horizontally and vertically
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#FFF", // White background like an A4 page
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Subtle shadow for elevation
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  }}
  >
    {/* Input for the note's title */}
    <Input
      placeholder="Title"
      value={newTitle}
      onChange={(e) => setNewTitle(e.target.value)}     
    />

    {/* Textarea for the note's content */}
    <Textarea
      placeholder="Content"
      value={newContent}
      onChange={(e) => setNewContent(e.target.value)}
      style={{
        height:"70%"
      }}
    />

    {/* Input for the note's category */}
    <Input
      placeholder="Category"
      value={newCategory}
      onChange={(e) => setNewCategory(e.target.value)}
    />

    {/* Input for the note's collaborators (comma-separated emails) */}
    <Input
      placeholder="Collaborators (comma-separated emails)"
      value={newCollaborators}
      onChange={(e) => setNewCollaborators(e.target.value)}
      disabled={!noteCreator}
      
    />

    {/* Buttons for saving the note or resetting the form */}
    <div className="flex justify-center gap-4 mt-4">
      <Button onClick={handleSaveNote}>
        {isEditing ? "Save Changes" : "Create Note"}
      </Button>
      <Button variant="ghost" onClick={resetForm}>
        Cancel
      </Button>
    </div>
  </div>
);
} 

export default EditNoteForm;
