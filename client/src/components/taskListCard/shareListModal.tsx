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

interface ShareTaskListProps {
  isOpenShare: boolean;
  onCloseShare: () => void;
  shareListData: { listID: number; userEmail: string };
  handleInputChangeShareList: (e: React.ChangeEvent<any>) => void;
  handleSubmitShareList: (e: React.FormEvent) => void;
}

const ShareTaskListModal: React.FC<ShareTaskListProps> = ({
  isOpenShare,
  onCloseShare,
  shareListData,
  handleInputChangeShareList,
  handleSubmitShareList
}) => {
  return (
    <Modal onClose={onCloseShare} isOpen={isOpenShare}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Share Task List</ModalHeader>
        <ModalCloseButton />
        <ModalBody key={shareListData.listID}>
          <form onSubmit={handleSubmitShareList}>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Search by Email</FormLabel>
                <Input
                  bg="#E3E3E3"
                  type="search"
                  name="userEmail"
                  color="black"
                  placeholder="Search.."
                  value={shareListData.userEmail}
                  onChange={handleInputChangeShareList}
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