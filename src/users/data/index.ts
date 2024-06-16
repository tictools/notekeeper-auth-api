import { generateUUID } from "src/notes/utils";
import { type User } from "src/users/types";

export const users: User[] = [
  {
    username: "johnDoe_username",
    email: "john@doe",
    id: generateUUID(),
    password: "123",
  },
];
