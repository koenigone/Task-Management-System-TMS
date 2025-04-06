import { useState, useContext } from "react";
import { UserContext } from "../../context/userContext";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faChalkboardUser,
  faUsers,
  faEnvelope,
  faGear,
  faAnglesRight,
  faAnglesLeft,
  faSignOutAlt,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Flex,
  IconButton,
  Text,
  useMediaQuery,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  VStack,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  ModalFooter,
} from "@chakra-ui/react";
import axios from "axios";
import toast from "react-hot-toast";

const Navigation = () => {
  const { user } = useContext(UserContext);
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [collapsed, setCollapsed] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const navigationLinks = [
    { index: 0, link: "/", icon: faHouse, iconSize: "21px", navigation: "Dashboard" },
    { index: 2, link: "/MyGroups", icon: faChalkboardUser, iconSize: "21px", navigation: "My Groups" },
    { index: 3, link: "/Invites", icon: faEnvelope, iconSize: "23px", navigation: "Invites" },
    { index: 4, link: "/JoinedGroups", icon: faUsers, iconSize: "21px", navigation: "Joined Groups" },
    { index: 5, link: "/Settings", icon: faGear, iconSize: "24px", navigation: "Settings" },
  ];

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await axios.post("http://localhost:3000/signOutUser", {}, { withCredentials: true });
      navigate("/login");
    } catch (error) {
      toast.error("Sign out failed");
    } finally {
      setIsSigningOut(false);
    }
  };
  
  const SidebarContent = () => (
    <Box
      bg="#2B3241"
      color="#FFFFFF"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      width={collapsed ? "90px" : "100%"}
      height="100vh"
      transition="width 0.3s ease"
      overflow="hidden"
      zIndex="10"
    >
      <VStack align="start" spacing={4} p={4}>
        <IconButton
          icon={ <FontAwesomeIcon icon={collapsed ? faAnglesRight : faAnglesLeft} />}
          onClick={() => setCollapsed(!collapsed)}
          variant="ghost"
          aria-label="Toggle Sidebar"
          color="white"
          _active="none"
          _hover="none"
          ml={2}
        />

        <Box p={2} ml={1.5}>
          <Flex align="center" gap={3} height={30}>
            <FontAwesomeIcon icon={faCircleUser} fontSize={30} />
            {!collapsed && (
              <Box>
                <Text fontWeight="bold" fontSize="14px">{user?.name}</Text>
                <Text fontSize="11px" opacity="0.8">{user?.email}</Text>
              </Box>
            )}
          </Flex>
        </Box>

        <Divider borderColor="#4E5B6B" w="100%" />

        <Box p={2} ml={1.5}>
          {navigationLinks.map((navigation) => (
            <Link to={navigation.link} key={navigation.index}>
              <Flex align="center" justify="start" height="55px" width="100%" _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}>
                <Box width="30px" height="30px" display="flex" alignItems="center" justifyContent="center">
                  <FontAwesomeIcon icon={navigation.icon} style={{ fontSize: navigation.iconSize }} />
                </Box>
                <Box>
                  {!collapsed && <Text ml={3}>{navigation.navigation}</Text>}
                </Box>
              </Flex>
            </Link>
          ))}
        </Box>
      </VStack>

      <VStack align="stretch" p={4} cursor="pointer">
        <Divider borderColor="#4E5B6B" />
        <Flex align="center" p={2} height="40px" ml={1.5} onClick={onOpen}>
          <FontAwesomeIcon icon={faSignOutAlt} style={{ fontSize: "23px" }} />
          {!collapsed && <Text ml={3}>Sign Out</Text>}
        </Flex>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sign Out</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to sign out from this account {user?.name}?</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose} isDisabled={isSigningOut}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={handleSignOut}
              isLoading={isSigningOut}
              loadingText="Signing out..."
            >
              Sign Out
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <>
          <IconButton
            icon={<FontAwesomeIcon icon={faAnglesRight} />}
            onClick={onOpen}
            variant="ghost"
            aria-label="Open Sidebar"
            position="fixed"
            top={4}
            left={4}
            zIndex="10"
          />
          <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent bg="#2B3241" color="#FFFFFF">
              <DrawerCloseButton />
              <DrawerBody>
                <SidebarContent />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      ) : (
        <SidebarContent />
      )}
    </>
  );
};

export default Navigation;