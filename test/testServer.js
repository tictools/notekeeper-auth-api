import express from "express";
import supertest from "supertest";

const testServer = (route, mockRepository = {}) => {
  const app = express();

  app.use(express.json());

  route(app, mockRepository);

  return supertest(app);
};

export default testServer;
