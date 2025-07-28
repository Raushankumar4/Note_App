import { Router } from "express";
import { authenticate } from "../middleware/auth.middlware";
import {
  createNote,
  deleteNote,
  getAllNotes,
  updateNote,
} from "../controllers/note.controller";

const router = Router();

router.use(authenticate);
router.route("/create").post(createNote);
router.route("/notes").get(getAllNotes);
router.route("/update/:id").put(updateNote);
router.route("/delete/:id").delete(deleteNote);

export default router;
