import { Request, Response } from "express";
import Note from "../models/notes.model";

export const createNote = async (req: Request, res: Response) => {
 try {
  
 } catch (error) {
  
 }
};


export const deleteNote = async (req: Request, res: Response) => {
  const email = (req as any).userEmail;
  const { id } = req.params;

  const note = await Note.findOneAndDelete({ _id: id, userEmail: email });
  if (!note)
    return res.status(404).json({ message: "Note not found or unauthorized" });

  res.status(200).json({ message: "Note deleted" });
};
