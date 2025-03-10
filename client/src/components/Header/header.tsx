import "./header.css";
import { useLocation } from "react-router-dom";
import { Text } from "@chakra-ui/react";

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
          <Text color="blue.400">Default Header Content</Text>
        )}
    </div>
  );
};

export default Header;
