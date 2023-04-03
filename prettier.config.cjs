/** @type {import("prettier").Config} */
const config = {
  singleQuote: false,
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
};

module.exports = config;
