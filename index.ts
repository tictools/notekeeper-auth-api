import cors from "cors";
import express from "express";
import { PORT } from "src/config";

import { healthRouterIoC } from "src/health/router";
import InMemoryNotesRepository from "src/notes/repositories/InMemoryNotesRepository";
import notesRouterIoC from "src/notes/router/notesRouter";
import InMemoryUserRepository from "src/users/respositories/InMemoryUserRepository";
import userRouterIoc from "src/users/router/userRouter";

const app = express();

app.use(express.json());
app.use(cors());

healthRouterIoC({ app });

const inMemoryNotesRepository = InMemoryNotesRepository();
const inMemoryUsersRepository = InMemoryUserRepository();

notesRouterIoC(app, inMemoryNotesRepository);
userRouterIoc(app, inMemoryUsersRepository);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT} ...`);
});
