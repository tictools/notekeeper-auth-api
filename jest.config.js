/** @type {import('jest').Config} */
const config = {
  moduleFileExtensions: ["js", "ts"],
  transform: {
    "^.+\\.m?js$": "babel-jest",
  },
};

export default config;
