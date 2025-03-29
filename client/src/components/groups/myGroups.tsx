import { useState, useContext, useEffect } from "react";
import { GroupContext } from "../../../context/groupContext";
import { Groups } from "./types";
import { Flex, Box, Text, Badge, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faUserPen,
  faChartSimple,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { formatDate } from "../helpers";

const MyGroups = () => {
  const { setCurrentGroup } = useContext(GroupContext);
  const [myGroups, setMyGroups] = useState<Groups[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyGroups = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/getMyGroups", {
          withCredentials: true,
        });
        setMyGroups(data.groups || []);
      } catch (error) {
        toast.error("Error fetching your groups:");
      }
    };

    fetchMyGroups();
  }, []);

  // Handle group click
  const handleGroupClick = (group: Groups) => {
    setCurrentGroup(group);
    navigate(`/MyGroups/${group.Group_ID}`);
  };

  return (
    <Flex wrap="wrap" gap={4}>
      {myGroups.length > 0 ? (
        myGroups.map((group) => (
          <Box
            key={group.Group_ID}
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            width="300px"
            boxShadow="base"
            bg="white"
            _hover={{ boxShadow: "lg", cursor: "pointer" }}
            onClick={() => handleGroupClick(group)}
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
                  Created: {formatDate(group.CreatedDate)}
                </Text>
                <Badge colorScheme={group.IsActive ? "green" : "red"}>
                  {group.IsActive ? "Active" : "Inactive"}
                </Badge>
              </Flex>
            </Box>
          </Box>
        ))
      ) : (
        <Text>No groups found</Text>
      )}
    </Flex>
  );
};

export default MyGroups;