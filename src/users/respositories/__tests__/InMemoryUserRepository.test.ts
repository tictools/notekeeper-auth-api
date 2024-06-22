import bcrypt from "bcrypt";

import { generateUUID } from "../../../shared/utils";
import { users } from "../../data";
import { UserCredentials, UserRepository } from "../../types";
import InMemoryUserRepository from "../InMemoryUserRepository";
import MotherObject from "../testDataMothers";

const mockUUID = "mock_b06-9edf-4af8-9c3c-34ab95a098bf";
const mockUUIDasUnknown = "_unknown-9edf-4af8-9c3c-34ab95a098bf";

// jest.mock("../../../shared/utils");
jest.mock("../../../shared/utils", () => {
  const mockUUID = "mock_b06-9edf-4af8-9c3c-34ab95a098bf";

  const originalModule = jest.requireActual<
    typeof import("../../../shared/utils")
  >("../../../shared/utils");

  return {
    __esModule: true,
    ...originalModule,
    generateUUID: jest.fn(() => mockUUID),
  };
});

describe("InMemoryUserRepository", () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    users.length = 0;
    userRepository = InMemoryUserRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe("getUserByUserName", () => {
    test("should return the user if found", async () => {
      const user = MotherObject.createUser();
      users.push(user);

      const result = await userRepository.getUserByUserName("testuser");
      expect(result).toEqual(user);
    });

    it("should return null if user not found", async () => {
      const result = await userRepository.getUserByUserName("unknownuser");
      expect(result).toBeNull();
    });
  });

  // describe("getUserById", () => {
  //   const user = MotherObject.createUser();
  //   it("should return the user if found", async () => {
  //     users.push(user);

  //     const result = await userRepository.getUserById(mockUUID);
  //     expect(result).toEqual(user);
  //   });

  //   it("should return null if user not found", async () => {
  //     const result = await userRepository.getUserById(mockUUIDasUnknown);
  //     expect(result).toBeNull();
  //   });
  // });

  describe("registerUser", () => {
    it("should register a new user and return it", async () => {
      const registerUserData: UserCredentials = {
        username: "newuser",
        email: "newuser@example.com",
        password: "plain-password",
      };

      const newUser = await userRepository.registerUser(registerUserData);

      expect(newUser).toEqual({
        _id: mockUUID,
        username: "newuser",
        email: "newuser@example.com",
        password: "hashed-password",
      });

      expect(users).toContainEqual(newUser);
      expect(generateUUID).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith("plain-password", 10);
    });
  });
});
