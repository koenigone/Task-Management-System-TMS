import { Box, Text, Badge, Flex, Stack, Skeleton, Center, VStack, useColorMode } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/userContext";
import { GroupContext } from "../../../context/groupContext";
import { Groups } from "../types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { faList, faUserPen, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast from "react-hot-toast";

const GROUP_UPDATED_EVENT = 'groupUpdated'; // event for group updates

/* component structure:
  - retreive the joined groups
  - handle the group updates so that the user can see the changes in real time
  - handle the group click so that the user can navigate to the group details page
  - add loading skeleton when the groups are being fetched
  - add error handling
  - display the joined groups
*/
const JoinedGroupsCard = () => {
  const { user } = useContext(UserContext);
  const [groups, setGroups] = useState<Groups[]>([]);
  const { setCurrentGroup } = useContext(GroupContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { colorMode } = useColorMode();

  const fetchJoinedGroups = async () => { // retreive the joined groups
    if (!user || !user.id) {
      setError("User not found. Please log in again.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const { data } = await axios.get( // get the joined groups using axios and the user id from the context
        `/getUserJoinedGroups/${user.id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data && Array.isArray(data.groups)) {
        setGroups(data.groups);
      } else {
        setGroups([]);
        toast.error("Invalid response format:", data);
      }
    } catch (error) {
      toast.error("Error fetching joined groups");
      setError("Failed to fetch joined groups. Please try again later.");
      setGroups([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJoinedGroups();
    
    const handleGroupUpdate = () => { // handle the group updates so that the user can see the changes in real time
      fetchJoinedGroups();
    };
    
    window.addEventListener(GROUP_UPDATED_EVENT, handleGroupUpdate); 
    
    return () => { // remove the event listener when the component unmounts
      window.removeEventListener(GROUP_UPDATED_EVENT, handleGroupUpdate);
    };
  }, [user]);

  const handleGroupClick = (group: Groups) => { // handle the group click so that the user can navigate to the group details page
    setCurrentGroup(group);
    navigate(`/MyGroups/GroupDetails/${group.Group_ID}`); // navigate to the group details page
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
              <Skeleton height="20px" width="30%" />
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

  if (error) {
    return (
      <Center width="100%" py={8}>
        <VStack spacing={4}>
          <Text fontSize="xl" color="red.500">Error</Text>
          <Text color={colorMode === 'dark' ? 'gray.300' : 'gray.500'}>{error}</Text>
          <Text color={colorMode === 'dark' ? 'gray.400' : 'gray.400'}>Please try refreshing the page or logging in again.</Text>
        </VStack>
      </Center>
    );
  }

  if (groups.length === 0) {
    return (
      <Center width="100%" py={8}>
        <VStack spacing={4}>
          <Text fontSize="xl" color={colorMode === 'dark' ? 'gray.300' : 'gray.700'}>No joined groups found</Text>
          <Text color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}>Join a group to get started</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Flex wrap="wrap" gap={4} justify={{ base: "center", md: "flex-start" }}>
      {groups.map((group) => (
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
              <Text fontSize="sm" color={colorMode === 'dark' ? 'gray.300' : 'gray.500'}>
                <FontAwesomeIcon icon={faList} /> {group.TaskLists?.length || 0}
              </Text>
              <Text fontSize="sm" color={colorMode === 'dark' ? 'gray.300' : 'gray.500'}>
                <FontAwesomeIcon icon={faUserPen} /> {group.Members?.length || 0}
              </Text>
              <Text fontSize="sm" color={colorMode === 'dark' ? 'gray.300' : 'gray.500'}>
                <FontAwesomeIcon icon={faUserTie} /> Member
              </Text>
            </Stack>

            <Flex justify="space-between" align="center" mt={2}>
              <Text fontSize="sm" color={colorMode === 'dark' ? 'gray.300' : 'gray.500'}>
                Owner: {group.Creator_Username || "Unknown"}
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