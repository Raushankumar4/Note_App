import React, { useEffect, useState } from "react";
import api, { getNotes, deleteNote } from "./Api";
import { toast } from "react-hot-toast";
import Loading from "./Loading";

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: Date;
  userId: {
    _id: string;
    username: string;
  };
}

interface NotesProps {
  refreshTrigger: boolean;
}

function Notes({ refreshTrigger }: NotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const userStr = localStorage.getItem("userId");
    if (userStr) {
      const userId = JSON.parse(userStr);
      setCurrentUserId(userId);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [refreshTrigger]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const fetchedNotes = await getNotes();
      setNotes(fetchedNotes);
    } catch (error) {
      toast.error("Failed to load notes.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (!confirm) return;

    try {
      await deleteNote(id);
      toast.success("Note deleted.");
      fetchNotes();
    } catch (error) {
      toast.error("Failed to delete note.");
    }
  };

  const openEdit = (e: React.MouseEvent, note: Note) => {
    e.stopPropagation();
    setEditNote(note);
    setSelectedNote(null);
  };

  const cancelEdit = () => {
    setEditNote(null);
  };

  const saveEdit = async () => {
    if (!editNote) return;
    try {
      await api.put(`note/update/${editNote._id}`, {
        title: editNote.title,
        content: editNote.content,
      });
      toast.success("Note updated.");
      setEditNote(null);
      fetchNotes();
    } catch (error) {
      toast.error("Failed to update note.");
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="min-h-screen bg-indigo-50 py-12 px-6">
            <div className="max-w-7xl mx-auto grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {notes.map((note) => {
                const { _id, title, content, createdAt, userId } = note;
                const isOwner = currentUserId === userId?._id;

                return (
                  <div
                    key={_id}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer relative"
                    onClick={() => setSelectedNote(note)}
                  >
                    <p className="text-sm text-gray-500 mb-1">
                      Created by:{" "}
                      <strong>{userId?.username || "Unknown"}</strong>
                    </p>

                    <h3 className="text-indigo-900 font-semibold text-xl mb-2">
                      {title}
                    </h3>
                    <p className="text-indigo-700 mb-4 line-clamp-3">
                      {content}
                    </p>

                    <div className="flex justify-between items-center text-indigo-500 text-sm">
                      <span>{new Date(createdAt).toLocaleString()}</span>
                      {isOwner && (
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => openEdit(e, note)}
                            className="bg-indigo-100 text-indigo-700 p-2 rounded-full hover:bg-indigo-200 transition"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(_id);
                            }}
                            className="bg-red-100 text-red-700 p-2 rounded-full hover:bg-red-200 transition"
                          >
                            ❌
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* View Note Modal */}
            {selectedNote && !editNote && (
              <div
                className="fixed inset-0 backdrop-blur-sm  bg-opacity-50 flex items-center justify-center p-4 z-50"
                onClick={() => setSelectedNote(null)}
              >
                <div
                  className="bg-white rounded-lg p-6 max-w-md w-full relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setSelectedNote(null)}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                  >
                    ✖
                  </button>
                  <h2 className="text-indigo-900 font-bold text-2xl mb-4">
                    {selectedNote.title}
                  </h2>
                  <p className="text-indigo-700 mb-6">{selectedNote.content}</p>
                  <p className="text-indigo-500 text-sm">
                    {new Date(selectedNote.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* Edit Modal */}
            {editNote && (
              <div
                className="fixed inset-0 backdrop-blur-sm  bg-opacity-50 flex items-center justify-center p-4 z-50"
                onClick={cancelEdit}
              >
                <div
                  className="bg-white rounded-lg p-6 max-w-md w-full relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={cancelEdit}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                  >
                    ✖
                  </button>
                  <h2 className="text-indigo-900 font-bold text-2xl mb-4">
                    Edit Note
                  </h2>
                  <input
                    type="text"
                    className="w-full border border-indigo-300 rounded px-3 py-2 mb-4"
                    value={editNote.title}
                    onChange={(e) =>
                      setEditNote({ ...editNote, title: e.target.value })
                    }
                    placeholder="Title"
                  />
                  <textarea
                    className="w-full border border-indigo-300 rounded px-3 py-2 mb-4 resize-none"
                    rows={6}
                    value={editNote.content}
                    onChange={(e) =>
                      setEditNote({ ...editNote, content: e.target.value })
                    }
                    placeholder="Content"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveEdit}
                      className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default Notes;
