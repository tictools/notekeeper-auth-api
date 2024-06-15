import NotesInMemoryRepository from "./NotesInMemoryRepository";

const REPOSITORY_METHODS = [
  "getAllNotes",
  "getNote",
  "addNote",
  "updateNote",
  "removeNote",
  "findIndexNoteById",
  "removeAllNotes"
];

describe("NotesInMemoryRepository", () => {
  const mockNote1 = { _id: "foo" };
  const mockNote2 = { _id: "bar" };
  const mockUpdatedNote = { _id: "fizz" };

  const INDEX_COLLECTION = {
    NON_EXISTING: -1,
    FIRST: 0,
    SECOND: 1
  };

  const EXPECTED_RESULT = {
    LENGTH_ZERO: 0,
    LENGTH_ONE: 1,
    LENGTH_TWO: 2,
    UNDEFINED: undefined,
    NULL: null,
    NOTE_ID_1: mockNote1._id,
    NOTE_ID_2: mockNote2._id,
    NOTE_UPDATED_ID: mockUpdatedNote._id
  };

  const repository = NotesInMemoryRepository();

  afterEach(() => {
    repository.removeAllNotes();
  });

  describe("Given a new respository", () => {
    test("When instance is created Then repository should be defined", () => {
      expect(repository).toBeDefined();
    });

    test("When instance is created Then expected methods should be returned", () => {
      Object.entries(repository).forEach(([key, value]) => {
        expect(REPOSITORY_METHODS).toContain(key);
        expect(typeof value).toBe("function");
      });
    });
  });

  describe("Given getAllNotes", () => {
    test("When method is called Then notes collection be returned", async () => {
      const notes = await repository.getAllNotes();
      expect(notes).toHaveLength(EXPECTED_RESULT.LENGTH_ZERO);

      await repository.addNote(mockNote1);
      expect(notes).toHaveLength(EXPECTED_RESULT.LENGTH_ONE);
    });
  });

  describe("Given getNote", () => {
    test("When method is called and index does not exist Then null should be returned", async () => {
      const note = await repository.getNote(INDEX_COLLECTION.FIRST);

      expect(note).toBe(EXPECTED_RESULT.NULL);
    });

    test("When method is called and index exists Then note should be returned", async () => {
      await repository.addNote(mockNote1);
      const note = await repository.getNote(INDEX_COLLECTION.FIRST);

      expect(note).toBeDefined();
      expect(note).toEqual(mockNote1);
    });
  });

  describe("Given addNote", () => {
    test("When method is called Then a new note is created and added to notes collection", async () => {
      await repository.addNote(mockNote1);

      const notes = await repository.getAllNotes();

      const note = notes[INDEX_COLLECTION.FIRST];

      expect(notes).toHaveLength(EXPECTED_RESULT.LENGTH_ONE);
      expect(note._id).toBe(EXPECTED_RESULT.NOTE_ID_1);
    });
  });

  describe("Given updateNote", () => {
    test("When method is called Then a note is updated ", async () => {
      await repository.addNote(mockNote1);
      const initialNote = await repository.getNote(INDEX_COLLECTION.FIRST);

      await repository.updateNote(INDEX_COLLECTION.FIRST, mockUpdatedNote);
      const updatedNote = await repository.getNote(INDEX_COLLECTION.FIRST);

      expect(initialNote._id).toBe(EXPECTED_RESULT.NOTE_ID_1);
      expect(updatedNote._id).toBe(EXPECTED_RESULT.NOTE_UPDATED_ID);
    });
  });

  describe("Given removeNote", () => {
    test("When method is called and index does not exist Then no note is deleted and empty array is returned", async () => {
      const [deletedNote] = await repository.removeNote(INDEX_COLLECTION.FIRST);

      expect(deletedNote).toBe(EXPECTED_RESULT.UNDEFINED);
    });

    test("When method is called and index exists Then note is deleted and notes collection is properly updated", async () => {
      await repository.addNote(mockNote1);
      await repository.addNote(mockNote2);
      const notesBeforeRemoval = await repository.getAllNotes();

      expect(notesBeforeRemoval).toHaveLength(EXPECTED_RESULT.LENGTH_TWO);

      const [deletedNote] = await repository.removeNote(INDEX_COLLECTION.FIRST);
      const notesAfterRemoval = await repository.getAllNotes();

      const firstNoteAfterRemoval = notesAfterRemoval[INDEX_COLLECTION.FIRST];
      const secondNoteAfterRemoval = notesAfterRemoval[INDEX_COLLECTION.SECOND];

      expect(notesAfterRemoval).toHaveLength(EXPECTED_RESULT.LENGTH_ONE);
      expect(deletedNote._id).toBe(EXPECTED_RESULT.NOTE_ID_1);
      expect(firstNoteAfterRemoval._id).toBe(EXPECTED_RESULT.NOTE_ID_2);
      expect(secondNoteAfterRemoval).toBe(EXPECTED_RESULT.UNDEFINED);
    });
  });

  describe("Given findIndexNoteById", () => {
    test("When method is called and index does not exist Then index -1 is returned", async () => {
      const noteIndex = await repository.findIndexNoteById(
        INDEX_COLLECTION.FIRST
      );

      expect(noteIndex).toBe(INDEX_COLLECTION.NON_EXISTING);
    });

    test("When method is called and index exists Then note index is returned", async () => {
      await repository.addNote(mockNote1);

      const noteIndex = await repository.findIndexNoteById("foo");
      expect(noteIndex).toBe(INDEX_COLLECTION.FIRST);

      const foundNote = await repository.getNote(noteIndex);
      expect(foundNote).toBeDefined();
      expect(foundNote._id).toBe(EXPECTED_RESULT.NOTE_ID_1);
    });
  });

  describe("Given removeAllNotes", () => {
    test("When method is called and Then notes collection is cleaned", async () => {
      const notesCollection = await repository.getAllNotes();

      await repository.addNote(mockNote1);
      await repository.addNote(mockNote2);

      expect(notesCollection).toHaveLength(EXPECTED_RESULT.LENGTH_TWO);

      await repository.removeAllNotes();
      expect(notesCollection).toHaveLength(EXPECTED_RESULT.LENGTH_ZERO);
    });
  });
});
