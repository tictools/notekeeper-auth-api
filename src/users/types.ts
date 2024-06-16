export type uuid = `${string}-${string}-${string}-${string}-${string}`;

export type User = {
  username: string;
  email: string;
  id: uuid;
  password: string;
};

export interface UserRepository {
  getUserByUserName: (username: User["username"]) => User | null;
  getUserById: (username: User["id"]) => User | null;
}
