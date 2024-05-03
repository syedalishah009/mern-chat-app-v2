/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray2: '#4a5568'
      },
    },
    boxShadow: {
      custom: "0_2px_5px_rgb(0,0,0,0.2"
    }
  },
  plugins: []
} 