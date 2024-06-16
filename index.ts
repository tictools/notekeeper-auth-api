import cors from "cors";
import express from "express";
import { PORT } from "src/config";

import { healthRouterIoC } from "src/health/router";
import InMemoryNotesRepository from "src/notes/repository/InMemoryNotesRepository";
import notesRouterIoC from "src/notes/router/notesRouter";

const app = express();

app.use(express.json());
app.use(cors());

healthRouterIoC({ app });

const inMemoryNotesRepository = InMemoryNotesRepository();

notesRouterIoC(app, inMemoryNotesRepository);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT} ...`);
});
