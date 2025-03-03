import { ToastContainer } from "react-toastify";
import "./App.css";
import { Outlet, useMatches } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

function App() {
  // Dùng useMatches để lấy route hiện tại
  const matches = useMatches();
  const currentMatch = matches[matches.length - 1]; // Lấy route cuối cùng (route hiện tại)

  const showNavbar = currentMatch?.handle?.showNavbar ?? true;
  const showFooter = currentMatch?.handle?.showFooter ?? true;
  return (
    <div>
      <ToastContainer theme="dark" />
      {showNavbar && <Navbar />}
      <Outlet />
      {showFooter && <Footer />}
    </div>
  );
}

export default App;
