module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
  // No transform needed for CommonJS
  moduleNameMapper: {},
  transformIgnorePatterns: ['/node_modules/(?!bson|mongodb|mongoose).+\\.js$'],
  // Removed extensionsToTreatAsEsm for CommonJS compatibility
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  // Removed TypeScript preset and globals for pure JS backend
};
