/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'custom-shiba-main': '#ebaf5e',  
        'custom-shiba-secondary': '#f9f7e7',  
        'custom-shiba-tertiary': '#743c29', 
        'custom-shiba-quaternary': '#a36d4c',
        'custom-shiba-quinary': '#ccbcb0',
      },
      fontFamily: {
        logoFont: ['Logo-font', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
]
}
