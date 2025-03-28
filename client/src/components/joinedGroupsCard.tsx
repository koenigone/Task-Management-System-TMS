import { Box, SimpleGrid, Card, CardHeader, CardBody, CardFooter, Text, Heading, Button, Badge } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Group {
  Group_ID: number;
  GroupName: string;
  CreatedDate: string;
  JoinDate: string;
  IsActive: boolean;
}

const JoinedGroupsCard = () => {
  const { user } = useContext(UserContext);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJoinedGroups = async () => {
      try {
        console.log("Current user ID:", user?.id, "Type:", typeof user?.id);
        
        const { data } = await axios.get(
          `http://localhost:3000/getUserJoinedGroups/${user?.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        
        console.log("Raw response data:", data);
        
        // Ensure we're working with an array
        const groupsArray = Array.isArray(data.groups) ? data.groups : [];
        console.log("Processed groups data:", groupsArray);
        
        setGroups(groupsArray);
      } catch (error) {
        console.error("Failed to fetch joined groups", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    if (user?.id) {
      fetchJoinedGroups();
    }
  }, [user]);

  if (isLoading) {
    return <Box p={4}>Loading your groups...</Box>;
  }

  if (groups.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Text fontSize="lg">You haven't joined any groups yet.</Text>
        <Button mt={4} colorScheme="teal" onClick={() => navigate("/explore-groups")}>
          Explore Groups
        </Button>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Heading size="lg" mb={6} display="flex" alignItems="center" gap={2}>
        <FontAwesomeIcon icon={faUsers} />
        Joined Groups
      </Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {groups.map((group) => (
          <Card 
            key={group.Group_ID} 
            variant="outline" 
            _hover={{ 
              boxShadow: "md", 
              transform: "translateY(-2px)",
              transition: "all 0.2s"
            }}
          >
            <CardHeader>
              <Heading size="md">{group.GroupName}</Heading>
              <Badge colorScheme={group.IsActive ? "green" : "gray"} mt={1}>
                {group.IsActive ? "Active" : "Inactive"}
              </Badge>
            </CardHeader>
            <CardBody>
              <Text>Joined: {new Date(group.JoinDate).toLocaleDateString()}</Text>
              <Text>Created: {new Date(group.CreatedDate).toLocaleDateString()}</Text>
            </CardBody>
            <CardFooter>
              <Button 
                colorScheme="blue" 
                onClick={() => navigate(`/groups/${group.Group_ID}`)}
              >
                View Group
              </Button>
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default JoinedGroupsCard;