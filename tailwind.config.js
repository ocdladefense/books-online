/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./src/**/*.{html,js,jsx}",
    "./dev_modules/@local/global-components/**/*.{html,js,jsx}",
    "./node_modules/@ocdla/global-components/**/*.{html,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
          "lod-light": "rgb(219 228 243)",
          "ocdla-dark-blue": "rgb(28 30 60)"
      },
      fontFamily: {
        sans: ['"Open Sans"', "Verdana", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
