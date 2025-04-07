import { useLocation } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { useState } from "react";

import DashboardHeaderComponents from "./dashboardHeaderComponents";
import MyGroupsHeaderComponents from "./myGroupsHeaderComponents";
import GroupDetailsHeaderComponents from "./groupDetailsHeaderComponents";

const Header = () => {
  const location = useLocation();
  const [groupsFilter, setGroupsFilter] = useState<"all" | "active" | "inactive">("all");
  const [tasksFilter, setTasksFilter] = useState<"all" | "leader" | "helper">("all");

  return (
    <Box as="header">
      {location.pathname === "/" && (
        <DashboardHeaderComponents 
          onFilterChange={setTasksFilter}
          currentFilter={tasksFilter}
        />
      )}

      {location.pathname === "/MyGroups" && (
        <MyGroupsHeaderComponents 
          onFilterChange={setGroupsFilter}
          currentFilter={groupsFilter}
        />
      )}

      {location.pathname.startsWith("/MyGroups/") && (
        <GroupDetailsHeaderComponents />
      )}
    </Box>
  );
};

export default Header;