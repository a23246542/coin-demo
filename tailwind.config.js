/** @type {import('tailwindcss').Config} */
import theme from "./src/styles/theme";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,css}"],
  theme,
  plugins: [
    // ...existing code...
  ],
};
