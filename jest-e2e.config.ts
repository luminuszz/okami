import { JestConfigWithTsJest, pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

import 'jest';

export default {
  moduleFileExtensions: ['js', 'ts'],
  globals: {
    __DEV__: true,
  },
  testMatch: ['**/test/e2e/*.spec.ts'],
  preset: 'ts-jest',
  transform: {
    '^.+\\.(t|j)s?$': ['@swc/jest'] as any,
  },

  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    useESM: true,
    prefix: '<rootDir>/',
  }),

  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  collectCoverageFrom: ['**/test/e2e/*.spec.ts'],
} as JestConfigWithTsJest;
