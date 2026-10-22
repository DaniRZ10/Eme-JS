import jsdoc from 'eslint-plugin-jsdoc';

export default [
    {
        files: ['app.js'],
        ...jsdoc.configs['flat/recommended-error'],
        languageOptions: { sourceType: 'script' }
    }
];

