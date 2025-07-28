"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllNotes = exports.updateNote = exports.deleteNote = exports.createNote = void 0;
const notes_model_1 = __importDefault(require("../models/notes.model"));
const createNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title)
            return res.status(400).json("Title is required");
        const existedNote = await notes_model_1.default.findOne({ title });
        if (existedNote)
            return res.status(401).json({ message: "Title Must be Unique" });
        const userId = req.user.id;
        const note = await notes_model_1.default.create({ title, content, userId });
        return res.status(201).json({ message: "Note Created", note });
    }
    catch (error) {
        console.error("Error While Creating:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createNote = createNote;
const deleteNote = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const note = await notes_model_1.default.findOneAndDelete({ _id: id, userId });
        if (!note) {
            return res
                .status(404)
                .json({ message: "Note not found or unauthorized" });
        }
        res.status(200).json({ message: "Note deleted successfully" });
    }
    catch (error) {
        console.error("Delete note error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteNote = deleteNote;
const updateNote = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { title, content } = req.body;
        const note = await notes_model_1.default.findOneAndUpdate({ _id: id, userId }, { title, content }, { new: true });
        if (!note) {
            return res
                .status(404)
                .json({ message: "Note not found or unauthorized" });
        }
        res.status(200).json({ message: "Note updated", note });
    }
    catch (error) {
        console.error("Update note error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateNote = updateNote;
const getAllNotes = async (req, res) => {
    try {
        const notes = await notes_model_1.default.find()
            .populate("userId", "username")
            .sort({ updatedAt: -1 });
        res.status(200).json(notes);
    }
    catch (error) {
        console.error("Get all notes error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAllNotes = getAllNotes;
