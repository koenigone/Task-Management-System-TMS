import "./header.css";
import CreateTaskList from "../../components/dashboardContent/newList";
import FilterTaskLists from "../../components/dashboardContent/filterLists";
import { useLocation } from "react-router-dom";
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

const Header = () => {
  const location = useLocation(); // Get current route
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [isDesktop] = useMediaQuery("(min-width: 800px)");

  return (
    <div className="header">
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

      {location.pathname === "/" && (
        <>
          {isDesktop && (
            <div className="desktop-header-container">
              <div className="header-item">
                <CreateTaskList />
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
                    <CreateTaskList />
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
      )}

      {/* {location.pathname === "/MyGroups" && <MyGroupsActions />}
      
      {location.pathname.startsWith("/Group/") && <GroupHeader />} */}

      {/* Default header (optional) */}
      {!["/", "/MyGroups"].includes(location.pathname) &&
        !location.pathname.startsWith("/Group/") && (
          <h2>Default Header Content</h2>
        )}
    </div>
  );
};

export default Header;
