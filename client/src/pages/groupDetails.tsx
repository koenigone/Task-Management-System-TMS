import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { GroupContext } from "../../context/groupContext";
import TaskListCard from "../components/taskListCard/taskListCard";
import { Box, Button, Center, Heading, VStack } from "@chakra-ui/react";

interface Group {
  Group_ID: number;
  GroupName: string;
  CreatedDate: string;
  User_ID: number;
  IsActive: boolean;
}

/* GroupDetails structure:
  - get the GroupID, currentGroup, and setCurrentGroup
  - return the GroupDetails
*/
const GroupDetails = () => {
  const { GroupID } = useParams<{ GroupID: string }>();
  const { currentGroup, setCurrentGroup } = useContext(GroupContext);
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/getGroup/${GroupID}`);
        
        if (response.data.group) {
          setGroup(response.data.group);
          setCurrentGroup(response.data.group); // update the current group
        } else {
          setError("Group not found");
        }
      } catch (err) {
        setError("Error loading group details");
      } finally {
        setLoading(false);
      }
    };

    if (GroupID) {
      fetchGroupDetails();
    } else if (currentGroup) {
      setGroup(currentGroup); // set the group
      setLoading(false);      // set the loading to false
    } else {
      setError("No group ID provided");
      setLoading(false);
    }
  }, [GroupID, setCurrentGroup]);

  if (loading) { // if the loading is true
    return <Center h="100vh">Loading group details...</Center>;
  }

  if (error) {   // if the error is true
    return (
      <Center h="100vh">
        <VStack spacing={4}>
          <Heading size="md">{error}</Heading>
          <Button onClick={() => navigate("/MyGroups")}>Back to My Groups</Button>
        </VStack>
      </Center>
    );
  }

  return ( // return the group details
    <Box>
      {group ? (
        <TaskListCard Group_ID={group.Group_ID} />
      ) : (
        <Center h="50vh">
          <VStack spacing={4}>
            <Heading size="md">No group selected.</Heading>
            <Button onClick={() => navigate("/MyGroups")}>Back to My Groups</Button>
          </VStack>
        </Center>
      )}
    </Box>
  );
};

export default GroupDetails;