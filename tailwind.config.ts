import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f5fb",
          100: "#dbe7f4",
          200: "#b8cfe9",
          300: "#8cb1da",
          400: "#5e8dc6",
          500: "#3f70b1",
          600: "#2f5894",
          700: "#274878",
          800: "#1f3a61",
          900: "#172b48",
          950: "#0e1c30",
        },
        slate: {
          50: "#f8fafc",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Apple SD Gothic Neo",
          "Pretendard",
          "Noto Sans KR",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.06)",
        cardHover:
          "0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -1px rgba(15, 23, 42, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
