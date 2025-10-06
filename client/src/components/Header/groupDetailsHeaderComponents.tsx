import { useParams, useNavigate } from "react-router-dom";
import { 
  Button, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  ModalCloseButton,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import axios from "axios";
import HeaderComponent from "./headerComponent";
import CreateTaskList from "../createList";
import GroupSettings from "../groupSettings";
import toast from "react-hot-toast";

interface GroupDetailsHeaderComponentsProps { // props for the group details header components
  showLeaveButton?: boolean;                  // show the leave button if the user is a member of the group
}

/* group details header components structure:
  - get the group id from the url
  - handle the leave group
  - show the leave group modal
  - show the leave button if the user is a member of the group
*/
const GroupDetailsHeaderComponents = ({ showLeaveButton = false }: GroupDetailsHeaderComponentsProps) => { // group details header components
  const { GroupID } = useParams<{ GroupID: string }>(); // get the group id from the url
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLeaveGroup = async () => { // handle the leave group  
    try {
      await axios.post(`/leaveGroup`, { groupId: GroupID });
      toast.success("Left group successfully");
      onClose();
      navigate("/JoinedGroups"); // navigate to the joined groups page
    } catch (err) {
      toast.error("Failed to leave group");
    }
  };

  const LeaveGroupModal = () => ( // leave group modal
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Leave Group</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Are you sure you want to leave this group? You will lose access to all tasks and lists in this group.</Text>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={handleLeaveGroup}>
            Leave Group
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  return (
    <>
      <HeaderComponent
        headerComponent={<CreateTaskList />}
        headerComponentExtra={<GroupSettings />}
        additionalComponent={showLeaveButton ? (
          <Button 
            colorScheme="red" 
            onClick={onOpen}
            size="sm"
          >
            Leave Group
          </Button>
        ) : undefined}
      />
      <LeaveGroupModal />
    </>
  );
};

export default GroupDetailsHeaderComponents;