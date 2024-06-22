import { generateUUID } from "../../../shared/utils";
import { UserAuth } from "../../../users/types";

const createUser = (): UserAuth => {
  return {
    _id: generateUUID(),
    username: "testuser",
    email: "test@example.com",
    password: "hashed-password",
  };
};

export default createUser;
