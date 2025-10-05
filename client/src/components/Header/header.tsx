import { useLocation, useParams } from "react-router-dom";
import { Box, Spinner, Center } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../../../context/userContext";

import DashboardHeaderComponents from "./dashboardHeaderComponents";
import MyGroupsHeaderComponents from "./myGroupsHeaderComponents";
import GroupDetailsHeaderComponents from "./groupDetailsHeaderComponents";
import JoinedGroupHeaderComponent from "./joinedGroupHeaderComponent";

/* header component structure:
  - check the group ownership
  - show the appropriate header based on the current route
*/
const Header = () => {
  const location = useLocation();
  const { GroupID } = useParams<{ GroupID?: string }>();
  const { user } = useContext(UserContext);
  const [groupsFilter, setGroupsFilter] = useState<"all" | "active" | "inactive">("all");
  const [tasksFilter, setTasksFilter] = useState<"all" | "leader" | "helper">("all");
  const [isGroupOwner, setIsGroupOwner] = useState<boolean | null>(null);

  useEffect(() => { // check the group ownership
    if (location.pathname.includes("/GroupDetails/") && GroupID && user) {
      const checkGroupOwnership = async () => {
        try {
          const response = await axios.get(`/api/getGroup/${GroupID}`); // get the group using axios
          if (response.data.group) {
            setIsGroupOwner(response.data.group.User_ID === user.id); // set the group owner if the user is the owner of the group
          } else {
            setIsGroupOwner(false); // set the group owner to false if the group is not found
          }
        } catch (err) {
          toast.error("Error checking group ownership");
          setIsGroupOwner(false);
        }
      };
      
      checkGroupOwnership();
    } else {
      setIsGroupOwner(null);
    }
  }, [location.pathname, GroupID, user]);

  const isGroupDetailsPage = location.pathname.includes("/GroupDetails/"); // check if the current path is a GroupDetails page

  if (isGroupDetailsPage) {      // show the appropriate header based on the current route
    if (isGroupOwner === null) { // if still loading, show a spinner
      return (
        <Box as="header">
          <Center p={4}>
            <Spinner size="sm" />
          </Center>
        </Box>
      );
    }
    
    return (
      <Box as="header">
        <GroupDetailsHeaderComponents showLeaveButton={!isGroupOwner} />
      </Box>
    );
  }

  if (location.pathname === "/") {
    return (
      <Box as="header">
        <DashboardHeaderComponents 
          onFilterChange={setTasksFilter}
          currentFilter={tasksFilter}
        />
      </Box>
    );
  }

  if (location.pathname === "/MyGroups") {
    return (
      <Box as="header">
        <MyGroupsHeaderComponents 
          onFilterChange={setGroupsFilter}
          currentFilter={groupsFilter}
        />
      </Box>
    );
  }

  if (location.pathname === "/JoinedGroups") {
    return (
      <Box as="header">
        <JoinedGroupHeaderComponent />
      </Box>
    );
  }

  return <Box as="header" />; // default empty header for other routes
};

export default Header;