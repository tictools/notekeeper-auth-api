import { UserAuth, type UserDTO } from "../types";

const toPersistence = (user: UserAuth): UserDTO => {
  return {
    username: user.username,
    email: user.email,
  };
};

const userMapper = {
  toPersistence,
};

export default userMapper;
