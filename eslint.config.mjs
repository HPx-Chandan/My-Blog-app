import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,

  {
    rules: {
      'no-undef': 'off',
      'no-constant-binary-expression': 'off',

      'spaced-comment': 'off',
      'no-console': 'warn',
      'consistent-return': 'off',
      'func-names': 'off',
      'object-shorthand': 'off',
      'no-process-exit': 'off',
      'no-param-reassign': 'off',
      'no-return-await': 'off',
      'no-underscore-dangle': 'off',
      'class-methods-use-this': 'off',
      'prefer-destructuring': ['error', { object: true, array: false }],
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: 'req|res|next|val|err|file' },
      ],
    },
  },
];
