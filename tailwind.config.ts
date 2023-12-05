import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        nunito: ["Nunito", "sans-serif"],
        poppins: ["Poppins", "sans-serif"]
      }
    },
    colors: {
      primary: "#4B6BFB",
      secondary: "#7B92B2",
      accent: "#67CBA0",
      violet: "#883677",
      neutral: "#181A2A",
      "base-100": "#FFFFFF",
      info: "#3ABFF8",
      success: "#36D399",
      warning: "#FBBD23",
      danger: "#FF5630",
      error: "#F87272",
      dark: "#181A2A",
      light: "#F9FBFC",
      black: "#2E3A44",
      white: "#FFFFFF",
      grey1: "#A0AABF",
      grey2: "#C0C6D4",
      grey3: "#E3E8F1"
    }
  },
  plugins: []
};
export default config;
