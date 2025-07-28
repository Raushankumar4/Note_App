import React, { useState } from "react";
import api from "./Api";
import LoadingButton from "./LoadingButton";
import toast from "react-hot-toast";

interface NoteInput {
  title: string;
  content: string;
}

interface CreateNoteProps {
  onNoteCreated: () => void;
}

export default function CreateNote({ onNoteCreated }: CreateNoteProps) {
  const [inputData, setInputData] = useState<NoteInput>({
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInputData({
      ...inputData,
      [e.target.name]: e.target.value,
    });
  };

  const createNote = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/note/create", inputData);
      toast.success(data?.message || "Created");
      setInputData({ title: "", content: "" });
      onNoteCreated(); // notify parent to refresh
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || "Failed to create note.";
      toast.error(errorMsg);
      console.error("Error creating note:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg p-6 shadow-md mb-10">
      <h2 className="text-indigo-900 font-bold text-2xl mb-4">Create Note</h2>

      <form onSubmit={createNote}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="w-full border border-indigo-300 rounded px-3 py-2 mb-4"
          value={inputData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="content"
          placeholder="Content"
          rows={6}
          className="w-full border border-indigo-300 rounded px-3 py-2 mb-4 resize-none"
          value={inputData.content}
          onChange={handleChange}
          required
        />

        <div className="flex justify-end">
          <LoadingButton isLoading={loading} text="Create Note" />
        </div>
      </form>
    </div>
  );
}
