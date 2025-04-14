import { useState, useContext, useEffect } from "react";
import { GroupContext } from "../../../context/groupContext";
import { Groups } from "../types";
import { Flex, Box, Text, Badge, Stack, Tooltip, Skeleton, Center, VStack, useColorMode } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faUserPen } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { formatDate } from "../helpers";
import { useLocation } from "react-router-dom";

const GROUP_UPDATED_EVENT = 'groupUpdated'; // event for group updates

/* component structure:
  - retreive the groups
  - handle the group updates so that the user can see the changes in real time
  - handle the group click so that the user can navigate to the group details page
  - add loading skeleton when the groups are being fetched
  - add error handling
  - display the groups
*/
const MyGroups = () => {
  const { setCurrentGroup } = useContext(GroupContext);
  const [myGroups, setMyGroups] = useState<Groups[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<Groups[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const { colorMode } = useColorMode();
  const searchParams = new URLSearchParams(location.search); // get the search params from the url
  const activeFilter =
    (searchParams.get("filter") as "all" | "active" | "inactive") || "all"; // get the active filter from the url

  const fetchMyGroups = async () => { // retreive the groups
    setIsLoading(true);
    try {
      const { data } = await axios.get("http://localhost:3000/getMyGroups", { // get the groups using axios
        withCredentials: true,
      });
      setMyGroups(data.groups || []);
    } catch (error) {
      toast.error("Error fetching your groups:");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyGroups();
    
    const handleGroupUpdate = () => { // handle the group so that the user can see the changes in real time
      fetchMyGroups();
    };
    
    window.addEventListener(GROUP_UPDATED_EVENT, handleGroupUpdate);
    
    return () => {
      window.removeEventListener(GROUP_UPDATED_EVENT, handleGroupUpdate);
    };
  }, []);

  useEffect(() => { // apply the filter to the groups
    let filtered = myGroups;
    if (activeFilter === "active") {
      filtered = myGroups.filter((group) => group.IsActive);
    } else if (activeFilter === "inactive") {
      filtered = myGroups.filter((group) => !group.IsActive);
    }
    setFilteredGroups(filtered);
  }, [activeFilter, myGroups]);

  const handleGroupClick = (group: Groups) => {           // handle the group click so that the user can navigate to the group details page
    setCurrentGroup(group);
    navigate(`/MyGroups/GroupDetails/${group.Group_ID}`); // navigate to the group details page using the group id from the group object
  };

  if (isLoading) {
    return (
      <Flex wrap="wrap" gap={4}>
        {[1, 2, 3].map((i) => (
          <Box
            key={i}
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            width={{ base: "100%", sm: "100%", md: "300px" }}
            boxShadow="base"
            bg={colorMode === 'dark' ? 'gray.800' : 'white'}
            height="180px"
          >
            <Skeleton height="24px" width="70%" mb={4} />
            
            <Stack spacing={3} mt={4}>
              <Skeleton height="20px" width="60%" />
              <Skeleton height="20px" width="50%" />
              <Skeleton height="20px" width="40%" />
            </Stack>
            
            <Flex justify="space-between" align="center" mt={4}>
              <Skeleton height="16px" width="120px" />
              <Skeleton height="20px" width="60px" borderRadius="full" />
            </Flex>
          </Box>
        ))}
      </Flex>
    );
  }

  if (filteredGroups.length === 0) {
    return (
      <Center width="100%" py={8}>
        <VStack spacing={4}>
          <Text fontSize="xl" color={colorMode === 'dark' ? 'gray.300' : 'gray.500'}>No groups found</Text>
          <Text color={colorMode === 'dark' ? 'gray.400' : 'gray.500'}>Create a new group to get started</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Flex wrap="wrap" gap={4} justify={{ base: "center", md: "flex-start" }}>
      {filteredGroups.map((group) => (
        <Box
          key={group.Group_ID}
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          width={{ base: "100%", sm: "100%", md: "300px" }}
          boxShadow="base"
          bg={colorMode === 'dark' ? 'gray.800' : 'white'}
          color={colorMode === 'dark' ? 'white' : 'black'}
          _hover={{ boxShadow: "lg", cursor: "pointer" }}
          onClick={() => handleGroupClick(group)}
        >
          <Box color={colorMode === 'dark' ? 'white' : 'rgba(43, 50, 65, 0.8)'}>
            <Text fontWeight="bold">{group.GroupName}</Text>
          </Box>

          <Box>
            <Stack spacing={2} mt={4} ml={1}>
              <Tooltip label="Lists count" hasArrow>
                <Text fontSize="sm" color={colorMode === 'dark' ? 'gray.300' : 'gray.500'}>
                  <FontAwesomeIcon icon={faList} /> {group.TaskLists.length}
                </Text>
              </Tooltip>
              <Tooltip label="Members" hasArrow>
                <Text fontSize="sm" color={colorMode === 'dark' ? 'gray.300' : 'gray.500'}>
                  <FontAwesomeIcon icon={faUserPen} /> {group.Members.length}
                </Text>
              </Tooltip>
            </Stack>

            <Flex justify="space-between" align="center" mt={2}>
              <Text fontSize="sm" color={colorMode === 'dark' ? 'gray.300' : 'gray.500'}>
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

export default MyGroups;