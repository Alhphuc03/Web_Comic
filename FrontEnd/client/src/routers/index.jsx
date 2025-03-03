import { createBrowserRouter } from "react-router-dom";

import App from "./../App";
import Home from "../pages/Home/Home";
import Detail from "../pages/Detail/Detail";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ChapterPage from "../pages/ChapterPage/ChapterPage";
import { ComicPage } from "../pages/ComicsPage/ComicPage";
import SearchPage from "../pages/SearchPage/SearchPage";
import { Profile } from "../pages/Profile/Profile";
import About from "../pages/About/About";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
        handle: { showNavbar: true, showFooter: true, showScrollToTop: true },
      },
      {
        path: "/login",
        element: <Login />,
        handle: {
          showNavbar: false,
          showFooter: false,
          showScrollToTop: false,
        },
      },
      {
        path: "/register",
        element: <Register />,
        handle: {
          showNavbar: false,
          showFooter: false,
          showScrollToTop: false,
        },
      },
      {
        path: "/detail/:slug",
        element: <Detail />,
        handle: { showNavbar: true, showFooter: true, showScrollToTop: true },
      },
      {
        path: "/:slug/chapter/:chapterName",
        element: <ChapterPage />,
        handle: {
          showNavbar: true,
          showFooter: false,
          showScrollToTop: true,
          isFixedNavbar: false,
        },
      },
      {
        path: "/truyen-tranh",
        element: <ComicPage />,
        handle: { showNavbar: true, showFooter: true, showScrollToTop: true },
      },
      {
        path: "/truyen-tranh/:genreSlug",
        element: <ComicPage />,
        handle: { showNavbar: true, showFooter: true, showScrollToTop: true },
      },
      {
        path: "/search",
        element: <SearchPage />,
        handle: { showNavbar: true, showFooter: true, showScrollToTop: true },
      },
      {
        path: "/ho-so",
        element: <Profile />,
        handle: { showNavbar: true, showFooter: true, showScrollToTop: true },
      },
      {
        path: "/gioi-thieu",
        element: <About />,
        handle: { showNavbar: true, showFooter: true, showScrollToTop: true },
      },
    ],
  },
]);

export default router;
