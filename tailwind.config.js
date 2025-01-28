module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss-themer')({
      themes: [
        {
          // name your theme anything that could be a valid css class name
          // remember what you named your theme because you will use it as a class to enable the theme
          name: 'dark',
          // put any overrides your theme has here
          // just as if you were to extend tailwind's theme like normal https://tailwindcss.com/docs/theme#extending-the-default-theme
          extend: {
            colors: {
              "primary": '#141515',
              "secondary": '#1e1f1f',
              "overlay0": '#282a2a',
              "overlay1": '#323434',
              "surface0": '#393B3B',
              "surface1": '#3F4242',
              "crust": '#0C0C0C',
              "purple": '#D946EF',
              "red": "#980C0C",
              "neutral": "#bdbdbd",
              "contrast": "white",
            }
          }
        },
        {
          // name your theme anything that could be a valid css class name
          // remember what you named your theme because you will use it as a class to enable the theme
          name: 'light',
          // put any overrides your theme has here
          // just as if you were to extend tailwind's theme like normal https://tailwindcss.com/docs/theme#extending-the-default-theme
          extend: {
            colors: {
              "primary": '#ebeaea',
              "secondary": '#e1e0e0',
              "overlay0": '#d7d5d5',
              "overlay1": '#cdcbcb',
              "surface0": '#c6c4c4',
              "surface1": '#c0bdbd',
              "crust": '#fafafa',
              "purple": '#D946EF',
              "red": "#e81304",
              "neutral": "gray",
              "contrast": "black",
            }
          }
        }
      ]
    }),
    require('@tailwindcss/typography'),
    require("@tailwindcss/forms") 
  ],
}