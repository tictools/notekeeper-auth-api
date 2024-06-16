import { generateUUID } from "src/notes/utils";
import { type UserAuth } from "src/users/types";

export const users: UserAuth[] = [
  {
    _id: generateUUID(),
    username: "johnDoe_username",
    email: "john@mail.com",
    password: "$2a$10$j32ZRodej1yUCurUQimQNuD8tTHO6UdgXxxvp6Vxmo/5saTYkzQjK",
  },
];
