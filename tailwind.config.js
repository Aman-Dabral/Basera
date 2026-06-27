/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#C85322', // Darkened for better contrast
        secondary: '#1F5E5B',
        background: '#FAF3E8',
        text: '#2B2521',
      },
      fontFamily: {
        heading: ['Fraunces_400Regular', 'serif'],
        body: ['Inter_400Regular', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      }
    },
  },
  plugins: [],
}
