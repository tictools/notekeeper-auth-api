import { users } from "../data";
import { UserRepository } from "../types";

const InMemoryUserRepository = (): UserRepository => ({
  getUserByUserName: (username) => {
    const user = users.find((user) => user.username === username) ?? null;

    return user;
  },

  getUserById: (id) => {
    const user = users.find((user) => user.id === id) ?? null;

    return user;
  },
});

export default InMemoryUserRepository;
