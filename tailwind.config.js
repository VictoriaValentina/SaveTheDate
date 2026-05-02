/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Marsala como cor primária
        primary: "#8B2635", // marsala profundo
        "primary-container": "#C47A85", // marsala suave/rosado
        "primary-fixed": "#f5d5d9",
        "primary-fixed-dim": "#e8b0b8",
        "on-primary": "#ffffff",
        "on-primary-container": "#4a0f18",
        "on-primary-fixed": "#2e0009",
        "on-primary-fixed-variant": "#6b1e29",
        "inverse-primary": "#e8b0b8",

        // Terciária: tom marsala mais escuro/quente
        tertiary: "#7a2232",
        "tertiary-container": "#bf7a84",
        "tertiary-fixed": "#f5d5d9",
        "tertiary-fixed-dim": "#e0a8b0",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#3d0810",
        "on-tertiary-fixed": "#2e0009",
        "on-tertiary-fixed-variant": "#5e1a24",

        // Secundária: cinza neutro médio
        secondary: "#6b6b72",
        "secondary-container": "#e8e8ed",
        "secondary-fixed": "#e8e8ed",
        "secondary-fixed-dim": "#c8c8d0",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#4a4a52",
        "on-secondary-fixed": "#1a1a20",
        "on-secondary-fixed-variant": "#4a4a52",

        // Superfícies: cinza neutro frio
        background: "#f4f4f6",
        surface: "#f4f4f6",
        "surface-bright": "#f9f9fb",
        "surface-dim": "#d8d8dc",
        "surface-variant": "#e2e2e6",
        "surface-tint": "#8B2635",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f0f0f3",
        "surface-container": "#eaeaee",
        "surface-container-high": "#e4e4e8",
        "surface-container-highest": "#dedee2",

        // Texto
        "on-surface": "#1a1a1e",
        "on-surface-variant": "#46464f",
        "on-background": "#1a1a1e",
        "inverse-surface": "#2f2f33",
        "inverse-on-surface": "#f1f1f5",

        // Contornos
        outline: "#76767f",
        "outline-variant": "#c6c6d0",

        // Erro
        error: "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
      },
      fontFamily: {
        headline: ["Noto Serif", "serif"],
        body: ["Manrope", "sans-serif"],
        label: ["Manrope", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem",
      },
    },
  },
  plugins: [],
};
