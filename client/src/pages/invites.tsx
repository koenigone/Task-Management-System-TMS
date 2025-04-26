import axios from "axios";
import { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Box,
  Heading,
  Center,
  Text,
  VStack,
  Skeleton,
} from "@chakra-ui/react";
import toast from "react-hot-toast";
import { formatDate } from "../components/helpers";

interface Invite { // invite interface
  Invite_ID: number;
  Sender_User_Username: string;
  TaskList_Name: string;
  TaskList_ID: number;
  Group_ID: number;
  Group_Name: string;
  Created_At: string;
}

/* Invites structure:
  - get the getInvitesData, setGetInvitesData, isLoading, and fetchInvites
  - return the Invites
*/
const Invites = () => {
  const [getInvitesData, setGetInvitesData] = useState<Invite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInvites = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/getInvites", {
        withCredentials: true,
      });
      setGetInvitesData(response.data.invites);
    } catch (error) {
      toast.error("Error fetching invites:" + error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  const handleAccept = async (inviteId: number, listID: number, groupID: number) => { // handle the accept invite
    try {
      const response = await axios.post("http://localhost:3000/acceptInvite",
        { inviteId, listID, groupID },
        { withCredentials: true }
      );
  
      if (response.data.success) {
        setGetInvitesData((prevInvites) =>
          prevInvites.filter((invite) => invite.Invite_ID !== inviteId)
        );
        
        window.dispatchEvent(new Event('groupUpdated'));
        
        toast.success(response.data.message);
      } else {
        toast.error("Failed to accept invite: " + response.data.errMessage);
      }
    } catch (error) {
      toast.error("Error accepting invite: " + error);
    }
  };

  const handleReject = async (inviteId: number) => {
    try {
      const response = await axios.post("http://localhost:3000/denyInvite",
        { inviteId },
        { withCredentials: true }
      );

      if (response.data.success) {
        setGetInvitesData((prevInvites) =>
          prevInvites.filter((invite) => invite.Invite_ID !== inviteId)
        );
        
        toast.success(response.data.message);
      } else {
        toast.error(response.data.errMessage);
      }
    } catch (error) {
      toast.error("Error rejecting invite:" + error);
    }
  };

  if (isLoading) { // if the loading is true
    return (
      <Box p={5}>
        <Heading as="h1" size="lg" mb={5}>
          Invites
        </Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Sent By</Th>
              <Th>Type</Th>
              <Th>Title</Th>
              <Th>Date</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {[1, 2, 3].map((i) => (
              <Tr key={i}>
                <Td><Skeleton height="20px" /></Td>
                <Td><Skeleton height="20px" /></Td>
                <Td><Skeleton height="20px" /></Td>
                <Td><Skeleton height="20px" /></Td>
                <Td><Skeleton height="20px" width="120px" /></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    );
  }

  if (getInvitesData.length === 0) { // if the invites are empty
    return (
      <Box p={5}>
        <Heading as="h1" size="lg" mb={5}>
          Invites
        </Heading>
        <Center width="100%" py={8}>
          <VStack spacing={4}>
            <Text fontSize="xl" color="gray.700">No invites found</Text>
            <Text color="gray.600">You don't have any pending invites at the moment</Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  return ( // return the invites
    <Box p={5}>
      <Heading as="h1" size="lg" mb={5}>
        Invites
      </Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Sent By</Th>
            <Th>Type</Th>
            <Th>Title</Th>
            <Th>Date</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {getInvitesData.map((invite) => (
            <Tr key={invite.Invite_ID} color="gray.800">
              <Td>{invite.Sender_User_Username}</Td>
              <Td>{invite.TaskList_ID ? "Task List" : "Group"}</Td>
              <Td>{invite.TaskList_ID ? invite.TaskList_Name : invite.Group_Name}</Td>
              <Td>{formatDate(invite.Created_At)}</Td>
              <Td>
                <Button
                  colorScheme="green"
                  size="sm"
                  mr={2}
                  onClick={() => handleAccept(invite.Invite_ID, invite.TaskList_ID, invite.Group_ID)}
                >
                  Accept
                </Button>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleReject(invite.Invite_ID)}
                >
                  Deny
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Invites;