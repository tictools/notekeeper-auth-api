import bcrypt from "bcrypt";

import { generateUUID } from "src/notes/utils";
import { users } from "../data";
import { UserRepository } from "../types";

const InMemoryUserRepository = (): UserRepository => ({
  getUserByUserName: async (username) => {
    const user = users.find((user) => user.username === username) ?? null;

    return Promise.resolve(user);
  },

  getUserById: async (id) => {
    const user = users.find((user) => user._id === id) ?? null;

    return Promise.resolve(user);
  },

  registerUser: async (registerUserData) => {
    const { username, email, password } = registerUserData;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      _id: generateUUID(),
      username,
      email,
      password: hashedPassword,
    };

    users.push(newUser);

    return Promise.resolve(newUser);
  },
});

export default InMemoryUserRepository;
