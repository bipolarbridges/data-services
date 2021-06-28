/* eslint-disable no-undef */
module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "airbnb-typescript/base",
        "plugin:@typescript-eslint/recommended"
    ],
    //"parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module",
        "project": './tsconfig.json',
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "no-console": 0,
        "no-await-in-loop": 0,
        "no-plusplus": 0,
        "max-classes-per-file": ["error", 2]
    },
    "ignorePatterns": [
        "./tests/mocks/auth_server/**"
    ]
};
