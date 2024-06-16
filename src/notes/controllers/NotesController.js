import createNote from "./createNote.js";
import deleteNote from "./deleteNote.js";
import getAllNotes from "./getAllNotes.js";
import updateNote from "./updateNote.js";

const NotesController = (repository) => ({
  getAllNotes: getAllNotes(repository),
  createNote: createNote(repository),
  updateNote: updateNote(repository),
  deleteNote: deleteNote(repository)
});

export default NotesController;
