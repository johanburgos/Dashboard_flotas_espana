const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./layout/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '330px',
      ...defaultTheme.screens,
    },

    extend: {
      colors: {
        "bt-primary": "#243c5a",
      },
      boxShadow: {
        primary: "0 10px 20px -10px #0707077b",
      },
      keyframes: {
        fadinLeft: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0px)" },
        },
        fadeinup: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0px)" },
        },
        fadeInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0px)" },
        },
      },
      objectPosition: {
        "right center": "right center",
      },
    },
  },
};
