import { useLocation } from "react-router-dom";
import { Box } from "@chakra-ui/react";

import DashboardHeaderComponents from "./dashboardHeaderComponents";
import MyGroupsHeaderComponents from "./myGroupsHeaderComponents";
import GroupDetailsHeaderComponents from "./groupDetailsHeaderComponents";

const Header = () => {
  const location = useLocation(); // retrieve current route

  return (
    <Box as="header">
      {location.pathname === "/" && <DashboardHeaderComponents />}

      {location.pathname === "/MyGroups" && <MyGroupsHeaderComponents />}

      {location.pathname.startsWith("/MyGroups/") && (
        <GroupDetailsHeaderComponents />
      )}
    </Box>
  );
};

export default Header;