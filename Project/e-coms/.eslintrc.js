module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended'
  ],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    'no-useless-constructor': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn'],
    'no-irregular-whitespace': ['error', { skipRegExps: true }],
    'prettier/prettier': 'off',
    'no-extra-boolean-cast': 'warn'
  }
};
