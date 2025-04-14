import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  ModalFooter
} from "@chakra-ui/react";
import axios from "axios";
import toast from "react-hot-toast";

interface GetMembersModalProps { // props for the get members modal
  isOpen: boolean;
  onClose: () => void;
  members: Array<{
    User_ID: number;
    User_Username: string;
    JoinDate: string;
  }>;
  isLoading: boolean;
  currentGroupID?: number;
  refreshMembers: () => void;
}

/* GroupMembersModal structure:
  - get the isOpen, onClose, members, isLoading, currentGroupID, and refreshMembers
  - return the GroupMembersModal
*/
const GroupMembersModal: React.FC<GetMembersModalProps> = ({
  isOpen,
  onClose,
  members,
  isLoading,
  currentGroupID,
  refreshMembers,
}) => {

  const handleRemoveMember = async (userID: number) => {
    try {
      const { data } = await axios.post("http://localhost:3000/removeGroupMember",
        { groupID: currentGroupID, userID },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (data.errMessage) {
        toast.error(data.errMessage);
      }
      toast.success("Member removed");
      refreshMembers();
    } catch (error) {
      toast.error("remove error");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Group Members</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading ? (
            <div>Loading members...</div>
          ) : (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Username</Th>
                  <Th>Joined Date</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {members?.map((member) => (
                  <Tr key={member.User_ID}>
                    <Td>{member.User_Username}</Td>
                    <Td>{new Date(member.JoinDate).toLocaleDateString()}</Td>
                    <Td>
                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleRemoveMember(member.User_ID)}
                      >
                        Remove
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GroupMembersModal;