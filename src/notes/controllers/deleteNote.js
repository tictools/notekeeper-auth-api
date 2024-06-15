import { noteMapper } from "../mappers/index.js";
import { checkElementExistsBasedOn } from "../utils/index.js";

const deleteNote = (repository) => {
  return async (req, res) => {
    const { id: noteId } = req.params;

    const elementIndex = await repository.findIndexNoteById(noteId);

    const elementExists = checkElementExistsBasedOn({ elementIndex });

    if (!elementExists) {
      return res
        .status(404)
        .json({ error: `Note with id ${noteId} does not exist` });
    }

    const deletedNote = await repository.getNote(elementIndex);

    await repository.removeNote(elementIndex);

    const deletedNoteDTO = noteMapper.toDTO(deletedNote);

    return res.status(200).json(deletedNoteDTO);
  };
};

export default deleteNote;
