// ./jest.config.js
module.exports = {
    transform: {
      "^.+\\.jsx?$": "babel-jest"
    },
    testEnvironment: "node",
    moduleFileExtensions: ["js", "jsx"],
    transformIgnorePatterns: ["/node_modules/"]
  };