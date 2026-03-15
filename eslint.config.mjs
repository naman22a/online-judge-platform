import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
    js.configs.recommended,

    ...tseslint.configs.recommended,

    {
        ignores: ['**/dist', '**/node_modules', '**/.turbo'],
    },

    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tseslint.parser,
        },
        rules: {
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
        },
    },
];
