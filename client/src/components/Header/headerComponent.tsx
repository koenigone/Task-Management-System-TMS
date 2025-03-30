import { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useMediaQuery,
  VStack,
  Flex,
  Box,
} from "@chakra-ui/react";

interface HeaderComponentProps {
  headerComponent: ReactNode;
  headerComponentExtra: ReactNode;
  modalTitle: string;
}

const HeaderComponent = ({
  headerComponent,
  headerComponentExtra,
  modalTitle,
}: HeaderComponentProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [isDesktop] = useMediaQuery("(min-width: 800px)");

  return (
    <>
      {isMobile && (
        <Button
          onClick={onOpen}
          bg="transparent"
          padding="0"
          fontSize="40px"
          color="#2B3241"
          _hover={{ bg: "transparent" }}
          ml="auto"
        >
          <FontAwesomeIcon icon={faPlusSquare} />
        </Button>
      )}

      {isDesktop && (
        <Flex justify="flex-end" flexGrow={1} gap={5} ml="auto">
        <Box>{headerComponent}</Box>
        {headerComponentExtra && <Box>{headerComponentExtra}</Box>}
      </Flex>
      )}

      {isMobile && (
        <Modal onClose={onClose} isOpen={isOpen} size="xs">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{modalTitle}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} align="stretch">
                <Box>{headerComponentExtra}</Box>
                <Box>{headerComponent}</Box>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default HeaderComponent;