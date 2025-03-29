import { Box, Text, Badge, Flex, Stack } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/userContext";
import { GroupContext } from "../../../context/groupContext";
import { Groups } from "./types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  faList,
  faUserPen,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast from "react-hot-toast";
import { formatDate } from "../helpers";

const JoinedGroupsCard = () => {
  const { user } = useContext(UserContext);
  const [groups, setGroups] = useState<Groups[]>([]);
  const { setCurrentGroup } = useContext(GroupContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJoinedGroups = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/getUserJoinedGroups/${user?.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const groupsArray = Array.isArray(data.groups) ? data.groups : [];
        setGroups(groupsArray);
      } catch (error) {
        toast.error("Failed to fetch joined groups");
      }
    };

    fetchJoinedGroups();
  }, []);

  // Handle group click
  const handleGroupClick = (group: Groups) => {
    setCurrentGroup(group);
    navigate(`/MyGroups/${group.Group_ID}`);
  };

  return (
    <Flex wrap="wrap" gap={4}>
      {groups.map((group) => (
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
                <FontAwesomeIcon icon={faUserTie} /> Member
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
      ))}
    </Flex>
  );
};

export default JoinedGroupsCard;
