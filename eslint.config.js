import js from '@eslint/js';
import boundaries from 'eslint-plugin-boundaries';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import vue from 'eslint-plugin-vue';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const fsdLayers = ['app', 'pages', 'widgets', 'features', 'entities', 'shared'];

const allowLayerImports = (from, allowedLayers) => ({
  from: { element: { types: from } },
  allow: {
    to: { element: { types: { anyOf: allowedLayers } } },
  },
});

export default tseslint.config(
  {
    ignores: ['dist', 'node_modules', 'coverage'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs['flat/recommended'],
  prettierRecommended,
  {
    files: ['**/*.{ts,vue}'],
    plugins: {
      boundaries,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.app.json',
        },
        node: {
          extensions: ['.js', '.ts', '.vue'],
        },
      },
      'boundaries/include': ['src/**/*'],
      'boundaries/elements': fsdLayers.map((layer) => ({
        type: layer,
        pattern: `src/${layer}`,
      })),
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'boundaries/no-unknown-files': 'error',
      'boundaries/no-unknown-dependencies': 'error',
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            allowLayerImports('app', ['app', 'pages', 'widgets', 'features', 'entities', 'shared']),
            allowLayerImports('pages', ['pages', 'widgets', 'features', 'entities', 'shared']),
            allowLayerImports('widgets', ['widgets', 'features', 'entities', 'shared']),
            allowLayerImports('features', ['features', 'entities', 'shared']),
            allowLayerImports('entities', ['entities', 'shared']),
            allowLayerImports('shared', ['shared']),
          ],
        },
      ],
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'error',
      'vue/require-default-prop': 'off',
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['**/*.test.ts'],
    languageOptions: {
      globals: {
        ...globals.vitest,
      },
    },
  },
);
