/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vaidyaDark: "#06140f",
        vaidyaGreen: "#123d2c",
        vaidyaGold: "#d6a84f",
        vaidyaCream: "#f5e6c8",
      },

      boxShadow: {
        glow: "0 0 35px rgba(214,168,79,0.45)",
      },

      backgroundImage: {
        ancient:
          "radial-gradient(circle at center, rgba(214,168,79,0.15), transparent 60%)",
      },
    },
  },
  plugins: [],
}