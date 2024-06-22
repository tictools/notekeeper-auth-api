import { Request } from "express";

export type UUID = `${string}-${string}-${string}-${string}-${string}`;

export type User = {
  username: string;
  password: string;
};

export interface UserCredentials extends User {
  email: string;
}

export interface UserAuth extends UserCredentials {
  _id: UUID;
}

export type UserDTO = Omit<UserCredentials, "password">;

export type RequestWithCredentials = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  UserCredentials
>;

export interface UserRepository {
  getUserByUserName: (username: User["username"]) => Promise<User | null>;
  getUserById: (id: UserAuth["_id"]) => Promise<User | null>;
  registerUser: (registerUserData: UserCredentials) => Promise<UserAuth>;
}
