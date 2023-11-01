/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors";

module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}", // Note the addition of the `app` directory.
    // "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: colors.zinc,
        "gray-1000": "rgb(17,17,19)",
        "gray-1100": "rgb(10,10,11)",
        viper: {
          pink: "#FF0080",
          blue: "#0070F3",
          cyan: "#50E3C2",
          orange: "#F5A623",
          violet: "#7928CA",
        },
      },
      backgroundImage: ({ theme }) => ({
        "vc-border-gradient": `radial-gradient(at left top, ${theme(
          "colors.gray.500"
        )}, 50px, ${theme("colors.gray.800")} 50%)`,
      }),
      keyframes: ({ theme }) => ({
        rerender: {
          "0%": {
            ["border-color"]: theme("colors.viper.pink"),
          },
          "40%": {
            ["border-color"]: theme("colors.viper.pink"),
          },
        },
        highlight: {
          "0%": {
            background: theme("colors.viper.pink"),
            color: theme("colors.white"),
          },
          "40%": {
            background: theme("colors.viper.pink"),
            color: theme("colors.white"),
          },
        },
        loading: {
          "0%": {
            opacity: ".2",
          },
          "20%": {
            opacity: "1",
            transform: "translateX(1px)",
          },
          to: {
            opacity: ".2",
          },
        },
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
        translateXReset: {
          "100%": {
            transform: "translateX(0)",
          },
        },
        fadeToTransparent: {
          "0%": {
            opacity: "1",
          },
          "40%": {
            opacity: "1",
          },
          "100%": {
            opacity: "0",
          },
        },
      }),
    },
  },
  plugins: [],
};
