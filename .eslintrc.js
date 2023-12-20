const extensions = require("./webpack/supportedExtension.json");

module.exports = {
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "eslint-comments", "jest", "promise"],
    extends: [
        "airbnb-typescript",
        "plugin:@typescript-eslint/recommended",
        "plugin:eslint-comments/recommended",
        "plugin:import/typescript",
        "plugin:jest/recommended",
        "plugin:promise/recommended",
        "plugin:react/recommended",
        "prettier"
    ],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
        project: "./tsconfig.json"
    },
    settings: {
        "import/resolver": {
            node: {
                extensions
            }
        },
        react: {
            version: "detect"
        }
    },
    env: {
        browser: true,
        es6: true,
        jest: true
    },
    // might take some time to resolve these ts error, turning off for now
    rules: {
        "import/no-extraneous-dependencies": "off",
        "import/extensions": "off",
        "@typescript-eslint/no-shadow": "off",
        "@typescript-eslint/explicit-function-return-type": [
            "warn",
            {
                allowExpressions: true,
                allowTypedFunctionExpressions: true
            }
        ],
        "@typescript-eslint/no-use-before-define": [
            "error",
            { functions: false, classes: true, variables: true, typedefs: true }
        ],
        "react/require-default-props": "off",
        quotes: ["error", "double"],
        // indent: ["error", 4],
        "multiline-ternary": ["error", "always-multiline"],
        "react/prop-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "implicit-arrow-linebreak": "off",
        "react/display-name": "off",
        "no-multi-spaces": ["error"],
        "no-multiple-empty-lines": ["error"],
        "comma-dangle": ["error", "never"],
        "react/destructuring-assignment": "off",
        "react/jsx-props-no-spreading": "off",
        "jsx-a11y/no-static-element-interactions": "off",
        "jsx-a11y/click-events-have-key-events": "off",
        "jsx-a11y/anchor-is-valid": "off",
        "multiline-ternary": "off",
        "no-shadow": "off",
        "import/prefer-default-export": "off",
        "@typescript-eslint/dot-notation": "off",
        "@typescript-eslint/naming-convention": "off",
        "react/no-unescaped-entities": "off",
        "@typescript-eslint/default-param-last": "off"
    }
};
