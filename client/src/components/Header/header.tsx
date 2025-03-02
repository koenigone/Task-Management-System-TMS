import "./header.css";
import { useLocation } from "react-router-dom";

import DashboardHeaderComponents from "./dashboardHeaderComponents";
import MyGroupsHeaderComponents from "./myGroupsHeaderComponents";
import GroupDetailsHeaderComponents from "./groupDetailsHeaderComponents";

const Header = () => {
  const location = useLocation(); // Get current route

  return (
    <div className="header">

      {location.pathname === "/" && (
        <DashboardHeaderComponents />
      )}

      {location.pathname === "/MyGroups" &&  (
        <MyGroupsHeaderComponents />
      )}
      
      {location.pathname.startsWith("/MyGroups/") && (
        <GroupDetailsHeaderComponents />
      )}

      {!["/", "/MyGroups"].includes(location.pathname) &&
        !location.pathname.startsWith("/Group/") && (
          <h2>Default Header Content</h2>
        )}
    </div>
  );
};

export default Header;
