import type { Config } from "tailwindcss"
import { default as flattenColorPalette } from "tailwindcss/lib/util/flattenColorPalette"
const config = {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    screens: {
      sm: "640px",
      md: "740px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      boxShadow: {
        input: `0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`,
        sideBar: "4px 0px 16px 0px rgba(0, 0, 0, 0.25)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        companyCover: "linear-gradient(90deg, rgb(33, 47, 63), rgb(0, 177, 79))",
        iconJob: "linear-gradient(11deg, rgb(0, 191, 93), rgb(0, 144, 124))",
        JobFieldImage:
          "radial-gradient(100% 100% at 50% 100%, rgb(0, 217, 163) 0px, rgb(0, 161, 107) 33%, rgba(9, 99, 82, 0) 100%), none",
      },
      letterSpacing: {
        "neg-05": "-0.5%",
      },
      colors: {
        JobField: "#096352",
        Aurora: "#013035",
        desc: "#4d5965",
        companyJobCard: "#6f7882",
        tabBG: "#e9eaec",
        filterBg: "#F4F5F5",
        filter: "#a6acb2",
        navContentBg: "#f0efefb8",
        navTitle: "#00b14f",
        placeHolder: "#94A3B8",
        primaryColor: "#0F172A",
        secondaryColor: "#64748B",
        backgroundColor: "#F1F5F9",
        title: "#1E293B",
        categorized: "#0EA5E9",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#f3f5f7",
        foreground: "hsl(var(--foreground))",
        primary: "#0F172A",
        secondary: "#64748B",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
        "flip-words": {
          "10%": { transform: "translateY(-112%)" },
          "25%": { transform: "translateY(-100%)" },
          "35%": { transform: "translateY(-212%)" },
          "50%": { transform: "translateY(-200%)" },
          "60%": { transform: "translateY(-312%)" },
          "75%": { transform: "translateY(-300%)" },
          "85%": { transform: "translateY(-412%)" },
          "100%": { transform: "translateY(-400%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        aurora: "aurora 60s linear infinite",
        "flip-words": "flip-words 8s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), addVariablesForColors],
} satisfies Config

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addVariablesForColors({ addBase, theme }: any) {
  const allColors = flattenColorPalette(theme("colors"))
  const newVars = Object.fromEntries(Object.entries(allColors).map(([key, val]) => [`--${key}`, val]))

  addBase({
    ":root": newVars,
  })
}

export default config
