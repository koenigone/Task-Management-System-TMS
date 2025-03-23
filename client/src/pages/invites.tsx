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
} from "@chakra-ui/react";
import toast from "react-hot-toast";

interface Invite {
  Invite_ID: number;
  Sender_User_Username: string;
  TaskList_Name: string;
  TaskList_ID: number;
  Created_At: string;
}

const Invites = () => {
  const [getInvitesData, setGetInvitesData] = useState<Invite[]>([]);

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const response = await axios.get("http://localhost:3000/getInvites", {
          withCredentials: true,
        });
        setGetInvitesData(response.data.invites);
      } catch (error) {
        toast.error("Error fetching invites:" + error);
      }
    };

    fetchInvites();
  }, []);

  useEffect(() => {
    console.log("Invites data updated:", getInvitesData);
  }, [getInvitesData]);

  const handleAccept = async (inviteId: number, listID: number) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/acceptInvite",
        { inviteId, listID },
        { withCredentials: true }
      );
  
      if (response.data.success) {
        setGetInvitesData((prevInvites) =>
          prevInvites.filter((invite) => invite.Invite_ID !== inviteId)
        );
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
      const response = await axios.post(
        "http://localhost:3000/denyInvite",
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
          {getInvitesData.map((invite) => (
            <Tr key={invite.Invite_ID} color="gray.800">
              <Td>{invite.Sender_User_Username}</Td>
              <Td>Type</Td>
              <Td>{invite.TaskList_Name}</Td>
              <Td>{invite.Created_At}</Td>
              <Td>
                <Button
                  colorScheme="green"
                  size="sm"
                  mr={2}
                  onClick={() => handleAccept(invite.Invite_ID, invite.TaskList_ID)}
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
