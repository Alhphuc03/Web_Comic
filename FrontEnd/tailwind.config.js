/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./client/src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"], // Thêm font Poppins vào danh sách
        playwrite: ["Playwrite Australia SA", "serif"],
      },
    },
  },
  plugins: [],
};
