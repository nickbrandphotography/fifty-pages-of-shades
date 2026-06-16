import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        paper: "#FAFAF8",
        stone: "#8C8276",
        line: "#E4E1DA",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      maxWidth: { content: "1440px" },
      letterSpacing: { widest2: "0.22em" },
    },
  },
  plugins: [],
};
export default config;
