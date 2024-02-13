/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"),
    // function ({ addUtilities }) {
    //   const newUtilities = {
    //     ".meet-button": {
    //       backgroundColor: "#ffffff",
    //       borderRadius: "9999px",
    //       fontSize: "1.5rem",
    //       padding: "1rem 1.5rem",
    //       margin: "0.5rem",
    //       cursor: "pointer",
    //       transition: "background-color 0.3s ease",
    //       "&:hover": {
    //         backgroundColor: "#f0f0f0",
    //       },
    //     },
    //   };

    //   addUtilities(newUtilities, ["responsive", "hover"]);
    // },
  ],
  daisyui: {
    themes: ["light", "dark"],
  },
};
