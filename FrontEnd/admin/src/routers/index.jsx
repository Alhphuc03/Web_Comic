import { createBrowserRouter } from "react-router-dom";

// Import layout hoặc entry point của admin
import AdminApp from "../../../admin/src/App"; // Đường dẫn đến Admin App
import AdminDashboard from "../../../admin/src/pages/Dashboard/Dashboard"; // Trang chính của admin

const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminApp />,
    children: [
      {
        path: "",
        element: <AdminDashboard />,
        handle: {
          showNavbar: true, // Hiển thị Navbar
          showFooter: true, // Hiển thị Footer
        },
      },
    ],
  },
]);

export default router;
