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
      maxHeight:{
        '112': '28rem',  // 112 = 28rem (448px)
        '128': '32rem',  // 128 = 32rem (512px)
        '144': '36rem',  // 144 = 36rem (576px)
        '160': '40rem',  // 160 = 40rem (640px)
        '176': '44rem',  // 176 = 44rem (704px)
        '192': '48rem',  // 192 = 48rem (768px)
        '208': '52rem',  // 208 = 52rem (832px)
        '224': '56rem',  // 224 = 56rem (896px)
        '240': '60rem',  // 240 = 60rem (960px)
        '256': '64rem',  // 256 = 64rem (1024px)
        '288': '72rem',  // 288 = 72rem (1152px)
        '320': '80rem',  // 320 = 80rem (1280px)
      },
      margin: {
        '18': '4.5rem', // 72px
      },
      padding: {
        '18': '4.5rem', // 72px
      },
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
          100: "#fae8ff",
          200: "#f5d0fe",
          300: "#f0abfc",
          400: "#e879f9",
          500: "#d946ef",
          600: "#c026d3",
          700: "#a21caf",
          800: "#86198f",
          900: "#701a75",
        },
        sky: {
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e"
},
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require('tailwind-scrollbar'),],
  
} satisfies Config;

export default config;
