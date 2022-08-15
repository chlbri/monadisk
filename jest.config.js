module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  testEnviroment: 'node',
  modulePathIgnorePatterns: ['dist'],
};
