import mongoose, { Document, Schema, Model } from "mongoose";

export interface INote extends Document {
  title: string;
  content: string;
  userId: mongoose.Types.ObjectId;
}

const NoteSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Note: Model<INote> = mongoose.model<INote>("Note", NoteSchema);

export default Note;
