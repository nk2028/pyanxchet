module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  extends: [
    "eslint:recommended",
  ],
  ignorePatterns: [
    "Artifacts",
    "dist",
    "node_modules",
    // "src/qieyun-examples-node.js", // 傳遞參數名分歧在 index.js ，不影響推導但無法通過 ESLint 檢查。
    "tools", // 内含運用了只能在本地運行時環境中的函數或模塊，故而不需要檢查
    ".eslintrc.cjs",
  ],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: {},
  rules: {},
};
