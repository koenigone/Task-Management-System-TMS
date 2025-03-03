import "./myGroups.css";
import { useState, useCallback, useContext } from "react";
import { GroupContext } from "../../../context/groupContext";
import { MyGroupsTypes } from "./types";
import { Flex, Box, Text, Badge, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import GetMyGroups from "./getMyGroups";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faUserPen,
  faChartSimple,
} from "@fortawesome/free-solid-svg-icons";

const MyGroups = () => {
  const { setCurrentGroup } = useContext(GroupContext); // Use the GroupContext
  const [myGroups, setMyGroups] = useState<MyGroupsTypes[]>([]);
  const navigate = useNavigate();

  // Memoize the handleGroupsFetched function
  const handleGroupsFetched = useCallback((groups: MyGroupsTypes[]) => {
    setMyGroups(groups);
  }, []);

  // Handle group click
  const handleGroupClick = (group: MyGroupsTypes) => {
    setCurrentGroup(group); // Set the current group in the context
    navigate(`/MyGroups/${group.GroupName}`); // Navigate to the group's page
  };

  return (
    <Flex wrap="wrap" gap={4}>
      <GetMyGroups onGroupsFetched={handleGroupsFetched} />
      {myGroups.map((group) => (
        <Box
          key={group.Group_ID}
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          width="300px"
          boxShadow="base"
          bg="white"
          _hover={{ boxShadow: "lg", cursor: "pointer" }} // Add hover effect
          onClick={() => handleGroupClick(group)} // Pass the group object
        >
          <Box color="rgba(43, 50, 65, 0.8)">
            <Text fontWeight="bold">{group.GroupName}</Text>
          </Box>

          <Box>
            <Stack spacing={2} mt={4} ml={1}>
              <Text fontSize="sm" color="gray.500">
                <FontAwesomeIcon icon={faList} /> 7
              </Text>
              <Text fontSize="sm" color="gray.500">
                <FontAwesomeIcon icon={faUserPen} /> 3
              </Text>
              <Text fontSize="sm" color="gray.500">
                <FontAwesomeIcon icon={faChartSimple} /> 40%
              </Text>
            </Stack>

            <Flex justify="space-between" align="center" mt={2}>
              <Text fontSize="sm" color="gray.500">
                Created: {group.CreatedDate}
              </Text>
              <Badge colorScheme={group.IsActive ? "green" : "red"}>
                {group.IsActive ? "Active" : "Inactive"}
              </Badge>
            </Flex>
          </Box>
        </Box>
      ))}
    </Flex>
  );
};

export default MyGroups;