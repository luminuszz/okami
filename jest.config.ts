import { JestConfigWithTsJest, pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

import 'jest';

const config: JestConfigWithTsJest = {
  moduleFileExtensions: ['js', 'ts'],
  globals: {
    __DEV__: true,
  },
  testMatch: ['**/useCases/**/*.spec.ts', '**/usecases/**/*.spec.ts', '**/domain/**/*.spec.ts'],
  preset: 'ts-jest',
  transform: {
    '^.+\\.(t|j)s?$': ['@swc/jest'] as any,
  },

  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    useESM: true,
    prefix: '<rootDir>/',
  }),

  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  collectCoverageFrom: ['src/**/useCases/**/*.ts', 'src/**/domain/**/*.ts'],
};

export default config;
