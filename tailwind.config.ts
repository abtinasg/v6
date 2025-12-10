import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0E0E0E",
        surface: "#151515",
        "surface-hover": "#1A1A1A",
        "surface-active": "#1F1F1F",
        border: "#252525",
        foreground: "#EDEDED",
        muted: "#8A8A8A",
        accent: "#22D3EE",
        "accent-hover": "#06B6D4",
      },
      fontFamily: {
        sans: ['var(--font-vazirmatn)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(0, 0, 0, 0.3)',
        'glow': '0 0 20px rgba(34, 211, 238, 0.15)',
      },
    },
  },
  plugins: [],
};
export default config;
