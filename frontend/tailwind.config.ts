import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "green-deep": "var(--green-deep)",
        "green-mid": "var(--green-mid)",
        cream: "var(--cream)",
        "cream-dim": "var(--cream-dim)",
        gold: "var(--gold)",
        "near-black": "var(--near-black)",
        "scoreboard-yellow": "var(--scoreboard-yellow)",
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        panel: "18px",
      },
    },
  },
  plugins: [],
} satisfies Config;
