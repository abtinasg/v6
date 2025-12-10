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
        "background-elevated": "#111111",
        surface: "#141414",
        "surface-elevated": "#171717",
        "surface-hover": "#1A1A1A",
        "surface-active": "#1D1D1D",
        border: "#222222",
        "border-subtle": "#191919",
        foreground: "#F5F5F5",
        muted: "#9CA3AF",
        "muted-dark": "#6B7280",
        accent: "#22D3EE",
        "accent-hover": "#06B6D4",
        "accent-soft": "#0891B2",
      },
      fontFamily: {
        sans: ['var(--font-vazirmatn)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 20px rgba(0, 0, 0, 0.5)',
        'soft-sm': '0 1px 10px rgba(0, 0, 0, 0.3)',
        'glow': '0 0 32px rgba(34, 211, 238, 0.25)',
        'glow-soft': '0 0 20px rgba(34, 211, 238, 0.15)',
        'premium': '0 10px 40px rgba(0, 0, 0, 0.6), 0 4px 12px rgba(0, 0, 0, 0.4)',
        'depth': '0 6px 28px rgba(0, 0, 0, 0.45), 0 2px 8px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
};
export default config;
