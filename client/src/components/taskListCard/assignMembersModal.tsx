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
  ModalFooter,
  Badge,
} from "@chakra-ui/react";
import axios from "axios";
import toast from "react-hot-toast";

/* assign to group members modal structure:
  - get the is open, on close, members, is loading, current group id, selected task list, and refresh members
  - show the modal with the members
  - handle the assign task
  - return the modal
*/
interface AssignToGroupMembersProps { // props for the assign to group members modal
  isOpen: boolean;
  onClose: () => void;
  members: Array<{
    User_ID: number;
    User_Username: string;
    JoinDate: string;
  }>;
  isLoading: boolean;
  currentGroupID?: number;
  selectedTaskList: any;
  refreshMembers: () => void;
}

const AssignToGroupMembers: React.FC<AssignToGroupMembersProps> = ({
  isOpen,
  onClose,
  members,
  isLoading,
  currentGroupID,
  selectedTaskList,
}) => {
  const handleAssignTask = async (userID: number, username: string) => {
    if (!selectedTaskList?.List_ID) {
      toast.error("no task list selected")
      return;
    }

    try { // assign the task list to the member
      const { data } = await axios.post("/api/assignTaskListToMember",
        { 
          listID: selectedTaskList.List_ID,
          userID,
          groupID: currentGroupID 
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (data.errMessage) {
        toast.error(data.errMessage);
        return;
      }

      toast.success(`Task list assigned to ${username} successfully`);
      onClose();
    } catch (error) {
      toast.error("Error assigning task list");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Assign Task List to Members</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading ? (
            <div>Loading members...</div>
          ) : (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Username</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {members?.map((member) => (
                  <Tr key={member.User_ID}>
                    <Td>{member.User_Username}</Td>
                    <Td>
                      <Badge colorScheme="green">Active</Badge>
                    </Td>
                    <Td>
                      <Button
                        colorScheme="blue"
                        size="sm"
                        onClick={() => handleAssignTask(member.User_ID, member.User_Username)}
                      >
                        Assign
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

export default AssignToGroupMembers;