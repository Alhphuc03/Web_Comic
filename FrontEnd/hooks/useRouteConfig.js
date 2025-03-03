import { useMatches } from "react-router-dom";

export const useRouteConfig = () => {
  const matches = useMatches();
  const routeHandle = matches.find((match) => match.handle)?.handle || {};

  return {
    showNavbar: routeHandle.showNavbar ?? true,
    showFooter: routeHandle.showFooter ?? true,
    isFixedNavbar: routeHandle.isFixedNavbar ?? true,
    showScrollToTop: routeHandle.showScrollToTop ?? true, // Thêm dòng này
  };
};
