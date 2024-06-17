import { UserAuth, type UserDTO } from "../types";

const toPersistence = (user: UserAuth): UserDTO => {
  if (!user.username) throw new Error("missing username");
  if (!user.email) throw new Error("missing email");

  return {
    username: user.username,
    email: user.email,
  };
};

const userMapper = {
  toPersistence,
};

export default userMapper;
