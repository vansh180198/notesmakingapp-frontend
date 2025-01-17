/**
 * NotesList Component
 *
 * This component manages and displays a list of notes. It includes features for filtering,
 * editing, deleting, and adding notes. It also integrates an online users component and supports
 * theme toggling for UI adjustments.
 */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import OnlineUsers from "./OnlineUsers";
import CustomModal from "./CustomModal";
import FilterBar from "./FilterBar";
import NotesGrid from "./NotesGrid";
import EditNoteForm from "./EditNoteForm";
import BASE_API_URL from "@/config/config";

const NotesList = ({ theme }) => {
  // State for managing notes and categories
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Notes");
  const [filterType, setFilterType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal and success message states
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Online users state
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isOnlineUsersTabOpen, setIsOnlineUsersTabOpen] = useState(false);

  // States for managing new note creation or editing
  const [newTitle, setNewTitle] = useState("Untitled");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newCollaborators, setNewCollaborators] = useState("");
  const [notecreator, setNotecreator] = useState("");

  // State for editing functionality
  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const [showWarningModal, setShowWarningModal] = useState(false);


  const navigate = useNavigate();
  const loggedInUserEmail = localStorage.getItem("email");

  // Setup Axios interceptor for handling 401 errors globally
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("userid");
          localStorage.removeItem("username");
          localStorage.removeItem("email");
          navigate("/signin");
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // Fetch notes, online users, and set up SSE (Server-Sent Events)
  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token is missing. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${BASE_API_URL}/notes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(response.data);
        console.log(response.data)

        // Extract unique categories
        const uniqueCategories = [
          "All Notes",
          ...new Set(response.data.map((note) => note.category).filter(Boolean)),
        ];
        setCategories(uniqueCategories);
      } catch (err) {
        setError("Failed to fetch notes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchOnlineUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get(`${BASE_API_URL}/users/online`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOnlineUsers(response.data);
      } catch (err) {
        console.error("Failed to fetch online users:", err);
      }
    };

    const setupSSE = () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const sseUrl = `${BASE_API_URL}/notes/stream?token=${token}`;
      const eventSource = new EventSource(sseUrl);

      // Handle note creation events
      eventSource.addEventListener("note-created", (event) => {
        const newNote = JSON.parse(event.data);
        setNotes((prevNotes) => {
          const isDuplicate = prevNotes.some((note) => note.id === newNote.id);
          return isDuplicate ? prevNotes : [...prevNotes, newNote];
        });
      });

      // Handle note update events
      eventSource.addEventListener("note-updated", (event) => {
        const newNote = JSON.parse(event.data);
        setNotes((prevNotes) => {
          const existingIndex = prevNotes.findIndex((note) => note.id === newNote.id);
          if (existingIndex !== -1) {
            const updatedNotes = [...prevNotes];
            updatedNotes[existingIndex] = newNote;
            return updatedNotes;
          }
          return [...prevNotes, newNote];
        });
      });

      // Handle note deletion events
      eventSource.addEventListener("note-deleted", (event) => {
        const { id: deletedNoteId } = JSON.parse(event.data);
        setNotes((prevNotes) =>
          prevNotes.filter((note) => note.id !== deletedNoteId)
        );
      });

      // Handle online users update events
      eventSource.addEventListener("online-users", (event) => {
        const users = JSON.parse(event.data);
        setOnlineUsers(users);
      });

      eventSource.onerror = () => {
        console.error("SSE connection error.");
        eventSource.close();
      };

      return eventSource;
    };

    fetchNotes();
    fetchOnlineUsers();
    const eventSource = setupSSE();

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  useEffect(() => {
    const uniqueCategories = [
      "All Notes",
      ...new Set(notes.map((note) => note.category).filter(Boolean)),
    ];
    setCategories(uniqueCategories);
  }, [notes]);

  // ** Auto-Categorization Feature **
  const handleAutoCategorize = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in.");
      return;
    }

    try {
      // Prepare notes for categorization
      const notesForCategorization = notes.map((note) => ({
        id: note.id,
        title: note.title,
        content: note.content,
      }));

      // Call categorization API
      const categorizedNotes = await autoCategorizeNotes(notesForCategorization);
      console.log(categorizedNotes)



     // Call categorization API
    // const categorizedNotes = await autoCategorizeNotes(notesForCategorization);

    // Update categories in backend
    const updatePromises = categorizedNotes.map(({ id, category }) => {
      const noteToUpdate = notes.find((note) => note.id === id);

      if (noteToUpdate) {
        return axios.put(
          `${BASE_API_URL}/notes/${id}`,
          { ...noteToUpdate, category },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      return Promise.resolve();
    });

    await Promise.all(updatePromises);

    // Optional: Immediate UI update
    setNotes((prevNotes) =>
      prevNotes.map((note) => {
        const updatedCategory = categorizedNotes.find(
          (categorizedNote) => categorizedNote.id === note.id
        )?.category;
        return updatedCategory ? { ...note, category: updatedCategory } : note;
      })
    );

    alert("Notes successfully auto-categorized!");
  } catch (error) {
    console.error("Error during auto-categorization:", error);
    alert("An error occurred while categorizing notes.");
  }
};

  const autoCategorizeNotes = async (notesForCategorization) => {
    const requestBody = {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that categorizes notes. Each note includes an id, title, and content. Return the response as an array where each note has its id and the assigned category.",
        },
        {
          role: "user",
          content: JSON.stringify(notesForCategorization, null, 2),
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
      top_p: 1,
    };

    const response = await axios.post(
      "https://models.inference.ai.azure.com/chat/completions",
      requestBody,
      {
        headers: {
          Authorization: import.meta.env.VITE_GITHUB_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      alert(`Failed to auto-categorize notes: ${response.statusText}`);
      return
    }
    

    const rawContent = response.data.choices[0].message.content;
    return JSON.parse(rawContent.replace(/```json/g, "").replace(/```/g, "").trim());
  };

  // Handle editing a note
  const handleEditNote = (note) => {
    setIsEditing(true);
    setEditingNote(note);
    setNewTitle(note.title);
    setNewContent(note.content);
    setNewCategory(note.category || "");
    setNewCollaborators(note.collaborators ? note.collaborators.join(", ") : "");
    setShowModal(true);
    setNotecreator(note.creator === loggedInUserEmail);
  };

  // Handle deleting a note
  const handleDeleteNote = async (noteId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const previousNotes = [...notes];
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));

    try {
      await axios.delete(`${BASE_API_URL}/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      alert("Failed to delete the note. Reverting changes.");
      setNotes(previousNotes);
    }
  };

  // Handle saving a note (create or update)
  const handleSaveNote = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in.");
      return;
    }

    let noteData = {
      id: Date.now() * 1000 + Math.floor(Math.random() * 1000),
      title: newTitle==""?"Untitled":newTitle,
      content: newContent,
      category: newCategory || null,
      collaborators: newCollaborators.split(",").map((email) => email.trim()),
      creator: loggedInUserEmail,
    };

    if (isEditing) {
      noteData = {
        ...noteData,
        id: editingNote.id,
        creator: editingNote.creator,
      };
    }

    const previousNotes = [...notes];
    if (isEditing) {
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === editingNote.id ? noteData : note))
      );
    } else {
      setNotes((prevNotes) => [noteData, ...prevNotes]);
    }

    try {
      if (isEditing) {
        await axios.put(`${BASE_API_URL}/notes/${editingNote.id}`, noteData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        const response = await axios.post(`${BASE_API_URL}/notes`, noteData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === noteData.id ? { ...note, id: response.data.id } : note
          )
        );
      }
      resetForm();
    } catch (err) {
      alert("Failed to save the note. Reverting changes.");
      setNotes(previousNotes);
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setNewTitle("Untitled");
    setNewContent("");
    setNewCategory("");
    setNewCollaborators("");
    setIsEditing(false);
    setEditingNote(null);
    setSuccessMessage(null);
    setNotecreator("");
  };

  const filteredNotes = notes.filter((note) => {
    if (filterType === "All") return true;
    if (filterType === "My Notes") return note.creator === loggedInUserEmail;
    if (filterType === "Collaborations"){
      if(note.collaborators.length == 1){
       return note.collaborators[0]==""?false:true; 
      }
      return note.collaborators.length >= 1;
    } 
    return true;
  });
  console.log(filterType," ",filteredNotes)

  const finalFilteredNotes =
    selectedCategory === "All Notes"
      ? filteredNotes
      : filteredNotes.filter((note) => note.category === selectedCategory);

  if (loading) return <p>Loading notes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="notes-container px-4 h-screen">
      <h2 className="text-2xl font-bold mb-4">My Notes</h2>
      <FilterBar
        theme={theme}
        filterType={filterType}
        setFilterType={setFilterType}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <Button style={{margin:"10px"}} variant="default" className="mb-4" onClick={() => setShowModal(true)}>
        Add Note
      </Button>
      <Button
  variant="default"
  className="mb-4"
  onClick={() => setShowWarningModal(true)}
>
  Auto Categorize Notes
</Button>

      {finalFilteredNotes.length === 0 ? (
        <p>No notes found. Create your first note!</p>
      ) : (
        <NotesGrid
          theme={theme}
          notes={finalFilteredNotes}
          onEditNote={handleEditNote}
          onDeleteNote={handleDeleteNote}
          loggedInUserEmail={loggedInUserEmail}
          noteCreator={notecreator}
        />
      )}
      <OnlineUsers
        onlineUsers={onlineUsers}
        isOnlineUsersTabOpen={isOnlineUsersTabOpen}
        toggleOnlineUsersTab={setIsOnlineUsersTabOpen}
        theme={theme}
      />
      <CustomModal open={showModal} onClose={resetForm} message={successMessage}>
        <EditNoteForm
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          newContent={newContent}
          setNewContent={setNewContent}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          newCollaborators={newCollaborators}
          setNewCollaborators={setNewCollaborators}
          handleSaveNote={handleSaveNote}
          resetForm={resetForm}
          isEditing={isEditing}
          noteCreator={notecreator}
        />
      </CustomModal>

       {/* Warning Modal */}
    <CustomModal
      open={showWarningModal}
      onClose={() => setShowWarningModal(false)}
    >
      < div className="space-y-4"
  style={{
    borderRadius: "10px",
    padding: "20px",
    minHeight: "300px",
    width: "350px", // Width for A4 proportions (based on 80% height)
    height: "40vh", // 80% of the viewport height
    margin: "auto", // Center the form horizontally and vertically
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: theme != "dark" ? "#FFF" : "rgb(31 41 55)", // Fixed syntax
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Subtle shadow for elevation
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
}}

  >
        <h2 className="text-lg font-bold mb-4">Warning</h2>
        <p>
          The auto-categorization feature uses a free AI model, which may not
          always produce accurate results and can give different results. Do you still want to proceed?
        </p>
        <div className="flex justify-end mt-4 gap-4">
          <Button
            variant="ghost"
            onClick={() => setShowWarningModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={() => {
              setShowWarningModal(false);
              handleAutoCategorize(); // Trigger auto-categorization on confirm
            }}
          >
            Proceed
          </Button>
        </div>
      </div>
    </CustomModal>
    </div>
  );
};

export default NotesList;
