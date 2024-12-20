module.exports = {
  extends: [
    'next',
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['react', '@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    // Add custom ESLint rules here
    'react/react-in-jsx-scope': 'off', // Disable this rule
    'react/prop-types': 'off', // Disable PropTypes validation
    '@typescript-eslint/no-unused-vars': 'warn', // Change the severity to 'warn'
  },
};
