import { UserAuth } from "src/users/types";
import userMapper from "./userMapper";

describe("Given userMapper.toPersistence", () => {
  const getValidUserAuth = (): UserAuth => ({
    username: "testUser",
    password: "testPassword",
    email: "testUser@example.com",
    _id: "123e4567-e89b-12d3-a456-426614174000",
  });

  const userAuth = getValidUserAuth();

  describe("When transforming a valid UserAuth object", () => {
    test("Then it should return a UserDTO with the correct properties", () => {
      const result = userMapper.toPersistence(userAuth);

      expect(result).toEqual({
        username: "testUser",
        email: "testUser@example.com",
      });
    });

    test("Then it should not include the password property in the resulting UserDTO", () => {
      const result = userMapper.toPersistence(userAuth);

      expect(result).not.toHaveProperty("password");
    });

    test("Then it should not include the _id property in the resulting UserDTO", () => {
      const result = userMapper.toPersistence(userAuth);

      expect(result).not.toHaveProperty("_id");
    });
  });

  describe("When transforming a UserAuth object with a missing username", () => {
    test("Then it should throw an error", () => {
      const userAuthWithMissingUsername = { ...userAuth, username: "" };

      expect(() =>
        userMapper.toPersistence(userAuthWithMissingUsername)
      ).toThrow("missing username");
    });
  });

  describe("When transforming a UserAuth object with a missing email", () => {
    test("Then it should throw an error", () => {
      const userAuthWithMissingEmail = { ...userAuth, email: "" };

      expect(() => userMapper.toPersistence(userAuthWithMissingEmail)).toThrow(
        "missing email"
      );
    });
  });
});
