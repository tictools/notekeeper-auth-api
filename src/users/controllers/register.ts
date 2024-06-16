import { Response } from "express";

import { userMapper } from "../mappers";
import { UserRepository, type RequestWithCredentials } from "../types";

const register = (userRepository: UserRepository) => {
  return async (req: RequestWithCredentials, res: Response) => {
    const registerData = req.body;

    const user = await userRepository.getUserByUserName(registerData.username);

    if (user) {
      return res.status(409).json({ message: "user already exists" });
    }

    const newUser = await userRepository.registerUser(registerData);

    const newUserToPersistence = userMapper.toPersistence(newUser);

    return res.json({
      message: "user registered",
      user: newUserToPersistence,
    });
  };
};

export default register;
