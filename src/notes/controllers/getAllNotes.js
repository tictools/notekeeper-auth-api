import { noteMapper } from "../mappers/index.js";

const getAllNotes = (repository) => {
  return async (_req, res) => {
    const notes = await repository.getAllNotes();

    const notesDTO = notes.map(noteMapper.toDTO);

    return res.json({ notes: notesDTO });
  };
};

export default getAllNotes;
