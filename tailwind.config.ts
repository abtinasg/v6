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
        // Deeper, richer blacks with subtle depth (2% tone difference)
        background: "#0A0A0B",
        "background-subtle": "#0C0C0D",
        surface: "#121214",
        "surface-hover": "#18181B",
        "surface-active": "#1E1E22",
        "surface-elevated": "#141416",
        border: "#1F1F24",
        "border-subtle": "#18181B",
        foreground: "#FAFAFA",
        "foreground-secondary": "#E4E4E7",
        muted: "#A1A1AA",
        "muted-foreground": "#71717A",
        accent: "#22D3EE",
        "accent-hover": "#06B6D4",
        "accent-subtle": "rgba(34, 211, 238, 0.08)",
      },
      fontFamily: {
        sans: ['var(--font-vazirmatn)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 24px rgba(0, 0, 0, 0.35)',
        'soft-sm': '0 2px 12px rgba(0, 0, 0, 0.25)',
        'glow': '0 0 32px rgba(34, 211, 238, 0.12)',
        'glow-subtle': '0 0 20px rgba(34, 211, 238, 0.08)',
        'inner-glow': 'inset 0 1px 1px rgba(255, 255, 255, 0.03)',
        'sidebar': '-1px 0 24px rgba(0, 0, 0, 0.2)',
        'input': '0 2px 16px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.02)',
      },
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '18': '4.5rem',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
export default config;
