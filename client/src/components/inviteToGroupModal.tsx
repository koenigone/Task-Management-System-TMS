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

interface InviteModalProps { // props for the invite modal
  isOpen: boolean;
  onClose: () => void;
  inviteData: { userEmail: string };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  title: string;
}

/* InviteToGroupModal structure:
  - get the isOpen, onClose, inviteData, handleInputChange, handleSubmit, and title
  - return the InviteToGroupModal
*/
const InviteToGroupModal: React.FC<InviteModalProps> = ({
  isOpen,
  onClose,
  inviteData,
  handleInputChange,
  handleSubmit,
  title
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>User Email</FormLabel>
                <Input
                  bg="#E3E3E3"
                  type="email"
                  name="userEmail"
                  value={inviteData.userEmail}
                  onChange={handleInputChange}
                  placeholder="Enter user's email"
                  autoFocus
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
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default InviteToGroupModal;