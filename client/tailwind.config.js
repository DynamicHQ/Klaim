module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        "primary-text": "var(--primary-text)",
        "secondary-text": "var(--secondary-text)",
        main: "var(--main)",
        accent: "var(--accent)",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#845ec2",
          secondary: "#4b4453",
          accent: "#845ec2",
          neutral: "#303030",
          "base-100": "#ffffff",
          "base-200": "#f5f5f5",
          "base-300": "#e5e5e5",
          "base-content": "#303030",
        },
        dark: {
          primary: "#845ec2",
          secondary: "#bbbbbb",
          accent: "#845ec2",
          neutral: "#dddddd",
          "base-100": "#111111",
          "base-200": "#1a1a1a",
          "base-300": "#2a2a2a",
          "base-content": "#dddddd",
        },
      },
    ],
  },
};
