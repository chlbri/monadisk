module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  testEnviroment: 'node',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  modulePathIgnorePatterns: ['dist'],
};
