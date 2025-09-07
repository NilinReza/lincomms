import { FlatCompat } from "@eslint/eslintrc";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

const compat = new FlatCompat({});

const eslintConfig = [
  // Next.js recommended rules
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Project-specific rules
  {
    files: ["**/*.{ts,tsx,js,jsx}"],

    // This is critical — ignores must be here
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "dist/**", "*.d.ts"],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },

    plugins: { "@typescript-eslint": tsPlugin },

    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "no-unused-vars": "off",
      "no-console": "warn",
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
    },
  },
];

export default eslintConfig;