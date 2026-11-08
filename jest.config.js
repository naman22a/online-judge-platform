const { compilerOptions } = require('./tsconfig.json');
const tsconfigPathsJest = require('tsconfig-paths-jest');

module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: 'src',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    testEnvironment: 'node',
    moduleNameMapper: tsconfigPathsJest(compilerOptions),
};
