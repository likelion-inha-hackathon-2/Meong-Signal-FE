import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import prettierConfig from "eslint-config-prettier";
import pluginPrettier from "eslint-plugin-prettier";

export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node, // node 환경 추가
      },
    },
    rules: {
      "prettier/prettier": "error",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "no-unused-vars": "warn",
      "no-undef": "warn",
    },
    settings: {
      react: {
        pragma: "React",
        version: "detect",
      },
    },
  },
  pluginJs.configs.recommended,
  pluginReactConfig,
  prettierConfig,
  {
    plugins: { prettier: pluginPrettier },
    rules: {
      "prettier/prettier": "error",
    },
  },
];
