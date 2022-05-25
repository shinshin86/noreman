module.exports = {
  testMatch: ["**/__tests__/**/*.ts"],
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc-node/jest"],
  },
};
