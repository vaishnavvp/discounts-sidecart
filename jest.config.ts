// jest.config.cjs (recommended to keep it CJS)
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',   // 👈 map "@/x" → "<rootDir>/src/x"
    '\\.(css|less|scss|sass)$': '<rootDir>/tests/styleMock.ts',
  },
};
