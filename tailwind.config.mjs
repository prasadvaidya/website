/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ],
        serif: ["Fraunces", "Georgia", "serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Consolas", "monospace"]
      },
      colors: {
        ink: {
          50: "#f7f7f2",
          100: "#e8e8df",
          200: "#c9c8bb",
          300: "#a9a799",
          400: "#7e7b70",
          500: "#5e5b52",
          600: "#47443d",
          700: "#34322d",
          800: "#24231f",
          900: "#171613",
          950: "#0d0d0b"
        },
        signal: {
          50: "#eef8f6",
          100: "#d5efea",
          200: "#aee0d7",
          300: "#7fcac0",
          400: "#4ea99f",
          500: "#338d85",
          600: "#27716c",
          700: "#235a57",
          800: "#204947",
          900: "#1e3d3b"
        },
        copper: {
          50: "#fbf5ed",
          100: "#f4e4cf",
          200: "#e6c69f",
          300: "#d8a673",
          400: "#c6814a",
          500: "#b56635",
          600: "#9a4e2d",
          700: "#7c3c29",
          800: "#673326",
          900: "#582d24"
        }
      },
      boxShadow: {
        soft: "0 20px 70px -35px rgb(20 20 16 / 0.35)",
        line: "0 0 0 1px rgb(23 22 19 / 0.08)"
      },
      animation: {
        "fade-up": "fade-up 650ms ease-out both"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      }
    }
  },
  plugins: []
};
