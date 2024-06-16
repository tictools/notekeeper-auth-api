import { Router } from "express";
import NotesController from "../controllers/NotesController.js";

const createNotesRouter = (repository) => {
  const notesRouter = Router();
  const notesController = NotesController(repository);

  notesRouter.get("/", notesController.getAllNotes);
  notesRouter.post("/", notesController.createNote);
  notesRouter.put("/:id", notesController.updateNote);
  notesRouter.delete("/:id", notesController.deleteNote);

  return notesRouter;
};

const notesRouterIoC = (app, repository) => {
  const notesRouter = createNotesRouter(repository);

  app.use("/notes", notesRouter);
};

export default notesRouterIoC;
