import { noteMapper } from "../mappers/index.js";
import { checkNoteDataIsIncomplete, generateUUID } from "../utils/index.js";

const createNote = (repository) => {
  return async (req, res) => {
    const note = req.body;

    const isNoteDataIncomplete = checkNoteDataIsIncomplete(note);

    if (isNoteDataIncomplete) {
      return res.status(400).json({ error: "Missing data." });
    }

    const newNote = {
      ...note,
      _id: generateUUID(),
      created_at: Date.now()
    };

    await repository.addNote(newNote);

    const noteDTO = noteMapper.toDTO(newNote);

    return res.status(201).json(noteDTO);
  };
};

export default createNote;
