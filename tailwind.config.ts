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
        background: "#0A0A0A",
        "background-elevated": "#0D0D0D",
        surface: "#121212",
        "surface-elevated": "#161616",
        "surface-hover": "#1A1A1A",
        "surface-active": "#1E1E1E",
        border: "#222222",
        "border-subtle": "#1A1A1A",
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
        'soft': '0 2px 16px rgba(0, 0, 0, 0.4)',
        'soft-sm': '0 1px 8px rgba(0, 0, 0, 0.2)',
        'glow': '0 0 24px rgba(34, 211, 238, 0.2)',
        'glow-soft': '0 0 16px rgba(34, 211, 238, 0.12)',
        'premium': '0 8px 32px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3)',
        'depth': '0 4px 24px rgba(0, 0, 0, 0.35)',
      },
    },
  },
  plugins: [],
};
export default config;
