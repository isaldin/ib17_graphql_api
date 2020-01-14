module.exports = {
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/"],
  coveragePathIgnorePatterns: ["/node_modules/"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },

  rootDir: "./src",
  moduleNameMapper: {
    "^@app/(.*)$": "<rootDir>/src/$1"
  }
};
