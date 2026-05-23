/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Syne'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        display: ["'Syne'", "sans-serif"],
      },
      colors: {
        // Dark theme palette
        void: {
          950: "#050508",
          900: "#0a0a0f",
          800: "#111118",
          700: "#1a1a24",
          600: "#242430",
          500: "#2e2e3e",
        },
        iris: {
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
        },
        electric: {
          400: "#67e8f9",
          500: "#06b6d4",
        },
        surface: {
          DEFAULT: "#13131a",
          raised: "#1c1c26",
          overlay: "#242432",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.25s ease-out",
        "slide-right": "slideRight 0.25s ease-out",
        "bounce-dots": "bounceDots 1.4s ease-in-out infinite",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideRight: {
          from: { opacity: "0", transform: "translateX(-10px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        bounceDots: {
          "0%, 80%, 100%": { transform: "scale(0)" },
          "40%": { transform: "scale(1)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      boxShadow: {
        "glow-iris": "0 0 20px rgba(139, 92, 246, 0.3)",
        "glow-sm": "0 0 10px rgba(139, 92, 246, 0.2)",
      },
    },
  },
  plugins: [],
};
