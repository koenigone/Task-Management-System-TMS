import "./header.css";
import FilterTaskLists from "../filter/filterLists";
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
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import CreateGroup from "../createGroup/createGroup";

const MyGroupsHeaderComponents = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [isDesktop] = useMediaQuery("(min-width: 800px)");

  return (
    <>
      {isMobile && (
        <Button
          onClick={onOpen}
          className="toggle-mobile-modal-btn"
          bg="ghost"
          padding="0"
          fontSize={40}
          color="#2B3241"
          _hover={{ bg: "transparent" }}
        >
          <FontAwesomeIcon icon={faPlusSquare} />
        </Button>
      )}

      {isDesktop && (
        <div className="desktop-header-container">
          <div className="header-item">
            <CreateGroup />
          </div>
          <div className="header-item">
            <FilterTaskLists />
          </div>
        </div>
      )}

      {isMobile && (
        <Modal onClose={onClose} isOpen={isOpen} size="xs">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Manage Dashboard</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack className="mobile-header-container">
                <div className="mobile-header-item">
                  <FilterTaskLists />
                </div>
                <div className="mobile-header-item">
                  <CreateGroup />
                </div>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default MyGroupsHeaderComponents;
