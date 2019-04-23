module.exports = {
  moduleNameMapper: {
    '~(.*)': '<rootDir>/src$1',
  },
  testEnvironment: 'node',
  testURL: 'http://localhost/',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
};
