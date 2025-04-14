import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Center,
  Button,
  ModalFooter,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

/* share task list modal structure:
  - get the is open, on close, share list data, handle input change, and handle submit
  - show the modal with the form
  - handle the form submit
  - return the modal
*/
interface ShareTaskListProps { // props for the share task list modal
  isOpenShare: boolean;
  onCloseShare: () => void;
  listID: number;
  onSuccess?: () => void;
}

const ShareTaskListModal: React.FC<ShareTaskListProps> = ({
  isOpenShare,
  onCloseShare,
  listID,
  onSuccess
}) => {
  const [userEmail, setUserEmail] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userEmail) {
      toast.error("Email is required");
      return;
    }

    try {
      const { data } = await axios.post("http://localhost:3000/inviteByEmail",
        { 
          listID,
          userEmail
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

      toast.success("Invitation sent successfully");
      setUserEmail("");
      onCloseShare();
      onSuccess?.();
    } catch (error) {
      toast.error("Error sending invitation");
    }
  };

  return (
    <Modal onClose={onCloseShare} isOpen={isOpenShare}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Share Task List</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Search by Email</FormLabel>
                <Input
                  bg="#E3E3E3"
                  type="search"
                  name="userEmail"
                  color="black"
                  placeholder="Search.."
                  value={userEmail}
                  onChange={handleInputChange}
                />
              </FormControl>

              <Center>
                <Button type="submit" colorScheme="teal">
                  Send Invite
                </Button>
              </Center>
            </VStack>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onCloseShare}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ShareTaskListModal;