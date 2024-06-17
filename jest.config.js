/** @type {import('ts-jest').JestConfigWithTsJest} */
// export default {
const config = {
  moduleFileExtensions: ["js", "ts"],
  transform: {
    "^.+\\.m?js$": "babel-jest",
  },
  preset: "ts-jest",
  testEnvironment: "node",
};

export default config;
