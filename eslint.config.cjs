const globals = require("globals");

module.exports = [
  {
    ignores: ["node_modules/**", "database/**", "screenshots/**", "Semana 6 Desarrollo de Plataformas.pdf", "package-lock.json"]
  },
  {
    files: ["utils/**/*.cjs", "tests/**/*.cjs", "scripts/**/*.cjs", "middleware/validacion.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: { ...globals.node, ...globals.jest }
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      "eqeqeq": ["error", "always"],
      "no-duplicate-imports": "error",
      "no-unreachable": "error",
      "curly": ["error", "all"]
    }
  }
];
