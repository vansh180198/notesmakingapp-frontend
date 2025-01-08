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
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newCollaborators, setNewCollaborators] = useState("");
  const [notecreator, setNotecreator] = useState("");


  // State for editing functionality
  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

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
        // console.log(response.data)
        setNotes(response.data);

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
          // Check if the note with the same ID already exists
          const isDuplicate = prevNotes.some((note) => note.id === newNote.id);
          
          // Only add the new note if it's not a duplicate
          return isDuplicate ? prevNotes : [...prevNotes, newNote];
        });
      });
      
      // Handle note update events
      eventSource.addEventListener("note-updated", (event) => {
        const newNote = JSON.parse(event.data);
      
        setNotes((prevNotes) => {
          // Check if the note with the same ID already exists
          const existingIndex = prevNotes.findIndex((note) => note.id === newNote.id);
      
          if (existingIndex !== -1) {
            // Replace the existing note with the new note
            const updatedNotes = [...prevNotes];
            updatedNotes[existingIndex] = newNote;
            return updatedNotes;
          }
      
          // Add the new note if it's not a duplicate
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

  useEffect(()=>{
    const uniqueCategories = [
      "All Notes",
      ...new Set(notes.map((note) => note.category).filter(Boolean)),
    ];
    setCategories(uniqueCategories);
  },[notes])

  // Handle editing a note
  const handleEditNote = (note) => {
    setIsEditing(true);
    setEditingNote(note);
    setNewTitle(note.title);
    setNewContent(note.content);
    setNewCategory(note.category || "");
    setNewCollaborators(note.collaborators ? note.collaborators.join(", ") : "");
    setShowModal(true);
    setNotecreator(note.creator==loggedInUserEmail);
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
      id: Date.now() * 1000 + Math.floor(Math.random() * 1000), // Generate a Long-like numeric ID
      title: newTitle,
      content: newContent,
      category: newCategory || null,
      collaborators: newCollaborators.split(",").map((email) => email.trim()),
      creator: loggedInUserEmail,
    };
    if(isEditing){
      noteData = {
        id:editingNote.id,
        title: newTitle,
        content: newContent,
        category: newCategory || null,
        collaborators: newCollaborators.split(",").map((email) => email.trim()),
        creator:editingNote.creator
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
        await axios.put(
          `${BASE_API_URL}/notes/${editingNote.id}`,
          noteData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        const response = await axios.post(
          `${BASE_API_URL}/notes`,
          noteData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
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

  // Reset form state
  const resetForm = () => {
    setShowModal(false);
    setNewTitle("");
    setNewContent("");
    setNewCategory("");
    setNewCollaborators("");
    setIsEditing(false);
    setEditingNote(null);
    setSuccessMessage(null);
    setNotecreator("");
  };

  // Filter notes based on collaboration or ownership
  const filteredNotes = notes.filter((note) => {
    if (filterType === "All") return true;
    if (filterType === "My Notes") return note.creator === loggedInUserEmail;
    if (filterType === "Collaborations")
      return note.collaborators.length>1
    return true;
  });
  console.log("colllab check ",filteredNotes)

  // Further filter notes by selected category
  const finalFilteredNotes =
    selectedCategory === "All Notes"
      ? filteredNotes
      : filteredNotes.filter((note) => note.category === selectedCategory);

      console.log("category check ",finalFilteredNotes)
  // Handle loading or error states
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
      <Button
        variant="default"
        className="mb-4"
        onClick={() => setShowModal(true)}
      >
        Add Note
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
      <CustomModal
        open={showModal}
        onClose={resetForm}
        message={successMessage}
      >
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
    </div>
  );
};

export default NotesList;
