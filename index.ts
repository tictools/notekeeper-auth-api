import cors from "cors";
import express from "express";

import { healthRouterIoC } from "@health/router";

const app = express();

app.use(express.json());
app.use(cors());

healthRouterIoC({ app });

const PORT = process.env.API_PORT ?? 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT} ...`);
});
