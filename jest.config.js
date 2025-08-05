const config = {
  preset: 'default',
  extensionsToTreatAsEsm: ['.js'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  moduleNameMapping: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {},
  testEnvironment: 'node',
  collectCoverageFrom: [
    'backend/**/*.js',
    '!backend/**/__tests__/**',
    '!backend/**/node_modules/**',
  ],
  coverageDirectory: 'backend/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: ['backend/**/__tests__/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};

export default config;
