/** @type {import("prettier").Config} */
const config = {
  // Core formatting
  semi: true,
  singleQuote: false,
  jsxSingleQuote: false,
  trailingComma: "all",
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,

  plugins: ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],

  // tailwindcss plugin — point at the globals file so it knows the config
  tailwindStylesheet: "./src/app/globals.css",

  // Import order — trivago plugin
  importOrder: [
    // Next.js built-ins
    "^(next)(/.*)?$",
    // React
    "^(react)(/.*)?$",
    // External packages
    "<THIRD_PARTY_MODULES>",
    // Internal aliases
    "^@/(.*)$",
    // Relative imports
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderGroupNamespaceSpecifiers: true,
  importOrderCaseInsensitive: true,
};

export default config;
