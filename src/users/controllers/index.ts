import { UserRepository } from "../types";
import register from "./register";

const UserController = (userRepository: UserRepository) => ({
  register: register(userRepository),
});

export default UserController;
