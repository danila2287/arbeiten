import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
  {
    // Сгенерированные страницы и Немного Мебели — не проверяем
    ignores: ['dist/', 'node_modules/', 'src/**/*.html'],
  },

  js.configs.recommended,

  // Код для браузера
  {
    files: ['src/js/**/*.js', 'src/data/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
  },

  // Код, который выполняется в Node: генератор, шаблоны, конфиги
  {
    files: ['scripts/**/*.mjs', 'src/templates/**/*.js', '*.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
  },

  {
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },

  // Отключает правила, которые спорят с Prettier. Должен идти последним.
  prettier,
];
