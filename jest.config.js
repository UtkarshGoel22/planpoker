/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: ['/node_modules/', '/migration/', '/test/'],

  // The directory where Jest should output its coverage files
  coverageDirectory: './coverage',

  // A preset that is used as a base for Jest's configuration
  preset: 'ts-jest',

  // The paths to modules that run some code to configure or set up the testing environment before each test
  setupFiles: ['./.jest/env.ts'],

  // The test environment that will be used for testing
  testEnvironment: 'node',

  // The glob patterns Jest uses to detect test files
  testMatch: ['/**/test.main.ts'],

  // Indicates whether each individual test should be reported during the run
  verbose: true,
};
