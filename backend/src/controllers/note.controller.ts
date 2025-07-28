import { Request, Response } from "express";
import Note from "../models/notes.model";
import { AuthenticatedRequest } from "../middleware/auth.middlware";

export const createNote = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, content } = req.body;
    if (!title) return res.status(400).json("Title is required");
    const existedNote = await Note.findOne({ title });
    if (existedNote)
      return res.status(401).json({ message: "Title Must be Unique" });
    const userId = req.user.id;
    const note = await Note.create({ title, content, userId });
    return res.status(201).json({ message: "Note Created", note });
  } catch (error) {
    console.error("Error While Creating:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteNote = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const note = await Note.findOneAndDelete({ _id: id, userId });

    if (!note) {
      return res
        .status(404)
        .json({ message: "Note not found or unauthorized" });
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateNote = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, content } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: id, userId },
      { title, content },
      { new: true }
    );

    if (!note) {
      return res
        .status(404)
        .json({ message: "Note not found or unauthorized" });
    }

    res.status(200).json({ message: "Note updated", note });
  } catch (error) {
    console.error("Update note error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllNotes = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const notes = await Note.find({ userId })
      .populate("userId", "username")
      .sort({ updatedAt: -1 });

    res.status(200).json(notes);
  } catch (error) {
    console.error("Get all notes error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
