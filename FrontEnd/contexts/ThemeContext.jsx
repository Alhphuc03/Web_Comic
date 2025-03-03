// src/contexts/ThemeContext.jsx
import { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";
// Tạo Context
const ThemeContext = createContext();

// Provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light"); // Mặc định là chế độ sáng

  // Hàm chuyển đổi chế độ sáng/tối
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom Hook để sử dụng ThemeContext
export const useTheme = () => {
  return useContext(ThemeContext);
};
