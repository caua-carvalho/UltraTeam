import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#060709",
        surface: "#121316",
        "surface-container-lowest": "#0d0e11",
        "surface-container-low": "#1a1c1e",
        "surface-container": "#14171A",
        "surface-container-high": "#1A1F24",
        "surface-container-highest": "#2A343D",
        primary: {
          DEFAULT: "#00FF66",
          dark: "#00CC52",
          light: "#6BFF9E",
          container: "#003911",
        },
        secondary: {
          DEFAULT: "#8F9CA8",
          dark: "#2A343D",
          light: "#BDC8D3",
        },
        tactical: {
          green: "#00FF66",
          amber: "#FFB800",
          red: "#FF2A3D",
          slate: "#2A343D",
          muted: "#8F9CA8",
          dark: "#14171A",
          darker: "#0A0A0A",
          card: "#14171A",
          panel: "#1A1F24",
          border: "#2A343D",
        },
      },
      fontFamily: {
        sans: ["Chivo", "sans-serif"],
        heading: ["Oswald", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        reticle: "0 0 0 1px #00FF66, 0 0 8px rgba(0, 255, 102, 0.45)",
        "reticle-amber": "0 0 0 1px #FFB800, 0 0 8px rgba(255, 184, 0, 0.45)",
        "reticle-red": "0 0 0 1px #FF2A3D, 0 0 8px rgba(255, 42, 61, 0.45)",
      },
      letterSpacing: {
        tactical: "0.08em",
        heading: "0.05em",
      },
    },
  },
  plugins: [],
};

export default config;
