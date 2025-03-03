// import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routers";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ScrollToTop from "./components/ScrollToTop";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={clientId}>
    <RouterProvider router={router}>
      <ScrollToTop />
    </RouterProvider>
  </GoogleOAuthProvider>
);
