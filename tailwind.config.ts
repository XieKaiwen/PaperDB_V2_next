import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        merriweather: "var(--font-merriweather)",
        "open-sans": "var(--font-open-sans)",
      },
      colors: {
        lavender: {
          100: "#f3f2fd",
          200: "#e7e4fb",
          300: "#dcd7f8",
          400: "#d0c9f6",
          500: "#c4bcf4",
          600: "#9d96c3",
          700: "#767192",
          800: "#4e4b62",
          900: "#272631",
        },
        sky: {
          100: "#edf3ff",
          200: "#dae7ff",
          300: "#c8dcff",
          400: "#b5d0ff",
          500: "#a3c4ff",
          600: "#829dcc",
          700: "#627699",
          800: "#414e66",
          900: "#212733"
},
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
