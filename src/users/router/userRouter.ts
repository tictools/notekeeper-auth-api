import { Router, type Express } from "express";

import UserController from "../controllers";
import { type UserRepository } from "../types";

const createUserRouter = (userRepository: UserRepository) => {
  const userRouter = Router();

  const userController = UserController(userRepository);

  userRouter.post("/register", userController.register);

  return userRouter;
};

const userRouterIoc = (app: Express, userRepository: UserRepository) => {
  const userRouter = createUserRouter(userRepository);

  app.use("/user", userRouter);
};

export default userRouterIoc;
