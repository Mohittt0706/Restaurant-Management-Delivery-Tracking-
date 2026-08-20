/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cult: {
          charcoal: '#0D0B0A',
          espresso: '#1A1512',
          ember: '#E8642C',
          gold: '#C89B3C',
          cream: '#F5EFE6',
          warmgray: '#A89E92',
          bronze: '#3A2E22',
          'deep-red': '#B8451F',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        heading: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        tagline: ['"Cormorant Garamond"', 'serif'],
      },
    },
  },
  plugins: [],
};
