import { Router, type Express } from "express";

function createHealthRouter() {
  const healthRouter = Router();

  healthRouter.get("/", (_req, res) => {
    res.send("OK");
  });

  return healthRouter;
}

function healthRouterIoC({ app }: { app: Express }) {
  const healthRouter = createHealthRouter();

  app.use("/health", healthRouter);
}

export default healthRouterIoC;
