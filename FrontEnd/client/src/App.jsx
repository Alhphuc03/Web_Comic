import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { Outlet } from "react-router-dom";

import { useRouteConfig } from "../../hooks/useRouteConfig";

import ScrollToTopButton from "./components/ScrollToTopButton";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

function App() {
  const { showNavbar, showFooter, showScrollToTop } = useRouteConfig();

  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer theme="dark" autoClose={2000} />
      {showNavbar && <Navbar />}
      <main className=" flex-grow">
        <Outlet />
      </main>
      {showFooter && <Footer />}
      {showScrollToTop && <ScrollToTopButton />}
    </div>
  );
}
export default App;
