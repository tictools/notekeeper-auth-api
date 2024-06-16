import cors from "cors";
import express from "express";

import { healthRouterIoC } from "@health/router";
import InMemoryNotesRepository from "src/notes/repository/InMemoryNotesRepository";
import notesRouterIoC from "src/notes/router/notesRouter";

const app = express();

app.use(express.json());
app.use(cors());

healthRouterIoC({ app });

const inMemoryNotesRepository = InMemoryNotesRepository();

notesRouterIoC(app, inMemoryNotesRepository);

const PORT = process.env.API_PORT ?? 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT} ...`);
});
