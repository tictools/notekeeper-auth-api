import testServer from "../../../test/testServer";
import notes from "../data";
import NotesInMemoryRepository from "../repository/NotesInMemoryRepository";
import notesRouterIoC from "./notesRouter";

jest.mock("../utils/generateUUID.js", () => {
  const noteId = "mockedID-123";
  return jest.fn().mockReturnValue(noteId);
});

jest.useFakeTimers("modern");

const MOCKS = {
  NOTE_ID: "mockedID-123",
  DATE_NOW: 39600000
};

const invalidId = "456";

const initialNote = notes[0];

const initialNoteDTO = {
  id: "123",
  name: "Walk the dog",
  description: "Go to the park",
  important: false,
  status: "pending",
  dueDate: "5/1/2024",
  createdAt: 1714552849902
};

const newNote = {
  name: "Wash dishes",
  description: "Washing machine is out of order",
  important: true,
  status: "pending",
  dueDate: "1/1/2024"
};

const newNoteDTO = {
  ...newNote,
  id: MOCKS.NOTE_ID,
  createdAt: MOCKS.DATE_NOW
};

const updatedNoteWithInvalidKey = {
  foo: "foo"
};

const updatedNote = {
  name: "updated name",
  description: "updated description",
  important: true,
  status: "in progress",
  dueDate: "12/12/2024"
};

const mockNotes = [initialNote];

const notesRepository = NotesInMemoryRepository(mockNotes);
const notesRouter = testServer(notesRouterIoC, notesRepository);

describe("notesRouter", () => {
  const EXPECTED_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404
  };

  const EXPECTED_ERROR_MESSAGE = {
    CREATED: "Missing data."
  };

  const EXPECTED_RESPONSE_DTO = {
    READ: [initialNoteDTO],
    CREATED: newNoteDTO,
    UPDATED: {
      ...initialNoteDTO,
      ...updatedNote
    },
    DELETED: initialNoteDTO,
    EMPTY: []
  };

  beforeEach(() => {
    jest.setSystemTime(MOCKS.DATE_NOW);
  });

  afterEach(() => {
    notesRepository.removeAllNotes();
    notesRepository.addNote(initialNote);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe("Given GET action", () => {
    test("When request is received Then response should return notes collection with status 200", async () => {
      const { status, body } = await notesRouter.get("/notes");
      const { notes } = body;

      expect(status).toBe(EXPECTED_STATUS.OK);
      expect(notes).toHaveLength(EXPECTED_RESPONSE_DTO.READ.length);
      expect(notes).toEqual(EXPECTED_RESPONSE_DTO.READ);
    });
  });

  describe("Given POST action", () => {
    test("When a new note is sent with missing name Then response should return status 404 with expected error message", async () => {
      const newNoteWithMissingName = {
        description: newNote.description,
        important: newNote.important,
        status: newNote.status,
        dueDate: newNote.dueDate
      };

      const { status, body } = await notesRouter
        .post("/notes")
        .send(newNoteWithMissingName);

      expect(status).toBe(EXPECTED_STATUS.BAD_REQUEST);
      expect(body.error).toBe(EXPECTED_ERROR_MESSAGE.CREATED);
    });

    test("When a new note is sent with missing description Then response should return status 404 with expected error message", async () => {
      const newNoteWithMissingDescription = {
        name: newNote.name,
        important: newNote.important,
        status: newNote.status,
        dueDate: newNote.dueDate
      };

      const { status, body } = await notesRouter
        .post("/notes")
        .send(newNoteWithMissingDescription);

      expect(status).toBe(EXPECTED_STATUS.BAD_REQUEST);
      expect(body.error).toBe(EXPECTED_ERROR_MESSAGE.CREATED);
    });

    test("When a new note is sent with missing status Then response should return status 404 with expected error message", async () => {
      const newNoteWithMissingStatus = {
        name: newNote.name,
        description: newNote.description,
        important: newNote.important,
        dueDate: newNote.dueDate
      };

      const { status, body } = await notesRouter
        .post("/notes")
        .send(newNoteWithMissingStatus);

      expect(status).toBe(EXPECTED_STATUS.BAD_REQUEST);
      expect(body.error).toBe(EXPECTED_ERROR_MESSAGE.CREATED);
    });

    test("When a new note is sent with missing dueDate Then response should return status 404 with expected error message", async () => {
      const newNoteWithDueDate = {
        name: newNote.name,
        description: newNote.description,
        important: newNote.important,
        status: newNote.status
      };

      const { status, body } = await notesRouter
        .post("/notes")
        .send(newNoteWithDueDate);

      expect(status).toBe(EXPECTED_STATUS.BAD_REQUEST);
      expect(body.error).toBe(EXPECTED_ERROR_MESSAGE.CREATED);
    });

    test("When a new note is sent with complete data Then response should return status 201 with new note and note should be stored", async () => {
      const { status, body } = await notesRouter.post("/notes").send(newNote);

      expect(status).toBe(EXPECTED_STATUS.CREATED);
      expect(body).toEqual(EXPECTED_RESPONSE_DTO.CREATED);

      const {
        body: { notes }
      } = await notesRouter.get("/notes");

      expect(notes).toHaveLength(EXPECTED_RESPONSE_DTO.READ.length + 1);
      expect(JSON.stringify(notes)).toContain("Wash dishes");
    });
  });

  describe("Given PUT action", () => {
    test("When an updated note contains a non allowed property Then response should return status 400 with expected error message", async () => {
      const {
        status,
        body: { error }
      } = await notesRouter
        .put(`/notes/${initialNoteDTO.id}`)
        .send(updatedNoteWithInvalidKey);

      expect(status).toBe(EXPECTED_STATUS.BAD_REQUEST);
      expect(error).toBe("Invalid property");
    });

    test("When note id does note exist Then response should return status 404 with expected error message", async () => {
      const {
        status,
        body: { error }
      } = await notesRouter.put(`/notes/${invalidId}`).send(updatedNote);

      expect(status).toBe(EXPECTED_STATUS.NOT_FOUND);
      expect(error).toBe(`Note with id ${invalidId} does not exist`);
    });

    test("When note id exists and keys are valid Then response should return updated note with status 200", async () => {
      const validId = "123";

      const { status, body } = await notesRouter
        .put(`/notes/${validId}`)
        .send(updatedNote);

      expect(status).toBe(EXPECTED_STATUS.OK);
      expect(body).toEqual(EXPECTED_RESPONSE_DTO.UPDATED);
    });
  });

  describe("Given DELETE action", () => {
    test("When note id does note exist Then response should return status 404 with expected error message", async () => {
      const {
        status,
        body: { error }
      } = await notesRouter.delete(`/notes/${invalidId}`);

      expect(status).toBe(EXPECTED_STATUS.NOT_FOUND);
      expect(error).toBe(`Note with id ${invalidId} does not exist`);
    });

    test("When note id exists and keys are valid Then response should return updated note with status 200", async () => {
      const validId = "123";

      const { status, body } = await notesRouter.delete(`/notes/${validId}`);

      expect(status).toBe(EXPECTED_STATUS.OK);
      expect(body).toEqual(EXPECTED_RESPONSE_DTO.DELETED);

      const {
        body: { notes }
      } = await notesRouter.get("/notes");

      expect(notes).toEqual(EXPECTED_RESPONSE_DTO.EMPTY);
    });
  });
});
