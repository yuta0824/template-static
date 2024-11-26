import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {
    files: ["**/*.js"],
    rules: {
      "no-console": "error", // console.logをエラーとする
      "prettier/prettier": "error", // Prettierのルール違反をエラーとする
    },
    eslintConfigPrettier, // Add
  },
];
