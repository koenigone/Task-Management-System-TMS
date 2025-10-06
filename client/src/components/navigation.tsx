import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/userContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  faBars,
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
  Skeleton,
  useColorMode,
  useBreakpointValue
} from "@chakra-ui/react";
import axios from "axios";
import toast from "react-hot-toast";

/* Navigation structure:
  - get the user, isMobileDevice, isMobile, collapsed, isNavOpen, isSignOutOpen, navigate, location, isSigningOut, isLoading, and colorMode
  - return the Navigation
*/
const Navigation = () => {
  const { user } = useContext(UserContext);
  const [isMobileDevice] = useMediaQuery("(max-width: 768px)");
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [collapsed, setCollapsed] = useState(false);
  const { isOpen: isNavOpen, onOpen: onNavOpen, onClose: onNavClose } = useDisclosure();
  const { isOpen: isSignOutOpen, onOpen: onSignOutOpen, onClose: onSignOutClose } = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { colorMode } = useColorMode();

  useEffect(() => { // set the collapsed state based on the screen size
    setCollapsed(isMobileDevice ? false : window.innerWidth < 1200);
  }, [isMobileDevice]);

  useEffect(() => { // simulate the loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const navigationLinks = [ // navigation links
    { index: 0, link: "/", icon: faHouse, iconSize: "21px", navigation: "Dashboard" },
    { index: 2, link: "/MyGroups", icon: faChalkboardUser, iconSize: "21px", navigation: "My Groups" },
    { index: 3, link: "/Invites", icon: faEnvelope, iconSize: "23px", navigation: "Invites" },
    { index: 4, link: "/JoinedGroups", icon: faUsers, iconSize: "21px", navigation: "Joined Groups" },
    { index: 5, link: "/Settings", icon: faGear, iconSize: "24px", navigation: "Settings" },
  ];

  const handleSignOut = async () => { // handle the sign out
    setIsSigningOut(true);
    try {
      await axios.post("/signOutUser", {}, { withCredentials: true });
      navigate("/login");
    } catch (error) {
      toast.error("Sign out failed");
    } finally {
      setIsSigningOut(false);
    }
  };
  
  const SidebarContent = () => ( // sidebar content
    <Box
      bg={colorMode === 'dark' ? "gray.900" : "#2B3241"}
      color="#FFFFFF"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      width={isMobile ? "100%" : collapsed ? "90px" : "250px"}
      height={isMobile ? "auto" : "100vh"}
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      overflow="hidden"
      zIndex="10"
      position="relative"
      boxShadow="2px 0 5px rgba(0, 0, 0, 0.1)"
    >
      <VStack align="start" spacing={4} p={4} width="100%">
        {!isMobile && (
          <IconButton
            icon={<FontAwesomeIcon icon={collapsed ? faAnglesRight : faAnglesLeft} />}
            onClick={() => setCollapsed(!collapsed)}
            variant="ghost"
            aria-label="Toggle Sidebar"
            color="white"
            _active="none"
            _hover="none"
            ml={2}
          />
        )}

        <Box p={2} ml={1.5} width="100%">
          <Flex align="center" gap={3} height={30}>
            <FontAwesomeIcon icon={faCircleUser} fontSize={30} />
            {(!collapsed || isMobile) && (
              <Box>
                {isLoading ? (
                  <>
                    <Skeleton height="14px" width="100px" mb={1} />
                    <Skeleton height="11px" width="120px" />
                  </>
                ) : (
                  <>
                    <Text fontWeight="bold" fontSize="14px">{user?.name}</Text>
                    <Text fontSize="11px" opacity="0.8">{user?.email}</Text>
                  </>
                )}
              </Box>
            )}
          </Flex>
        </Box>

        <Divider borderColor="#4E5B6B" w="100%" />

        <Box p={2} ml={1.5} width="100%">
          {navigationLinks.map((nav) => {
            const isActive = location.pathname === nav.link;
            return ( // return the navigation link
              <Link to={nav.link} key={nav.index} onClick={isMobile ? onNavClose : undefined}>
                <Flex 
                  align="center" 
                  justify="start" 
                  height="55px" 
                  width="100%" 
                  bg={isActive ? "rgba(255, 255, 255, 0.15)" : "transparent"}
                  borderRadius="md"
                  _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
                  px={2}
                >
                  <Box width="30px" height="30px" display="flex" alignItems="center" justifyContent="center">
                    <FontAwesomeIcon icon={nav.icon} style={{ fontSize: nav.iconSize }} />
                  </Box>
                  <Box>
                    {(!collapsed || isMobile) && <Text ml={3}>{nav.navigation}</Text>}
                  </Box>
                </Flex>
              </Link>
            );
          })}
        </Box>
      </VStack>

      <VStack align="stretch" p={4} cursor="pointer">
        <Divider borderColor="#4E5B6B" />
        <Flex align="center" p={2} height="40px" ml={1.5} onClick={onSignOutOpen}>
          <FontAwesomeIcon icon={faSignOutAlt} style={{ fontSize: "23px" }} />
          {(!collapsed || isMobile) && <Text ml={3}>Sign Out</Text>}
        </Flex>
      </VStack>
    </Box>
  );

  return ( // return the navigation
    <>
      {isMobile ? (
        <>
          <IconButton
            icon={<FontAwesomeIcon icon={faBars} style={{ fontSize: "24px" }} />}
            onClick={onNavOpen}
            variant="ghost"
            aria-label="Open Sidebar"
            position="fixed"
            top={4}
            left={4}
            zIndex="10"
            colorScheme="teal"
            size="lg"
            padding={2}
          />
          <Drawer isOpen={isNavOpen} placement="left" onClose={onNavClose} size="xs">
            <DrawerOverlay />
            <DrawerContent bg={colorMode === 'dark' ? "gray.900" : "#2B3241"} color="#FFFFFF">
              <DrawerCloseButton color="white" />
              <DrawerBody p={0}>
                <SidebarContent />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      ) : (
        <SidebarContent />
      )}

      <Modal isOpen={isSignOutOpen} onClose={onSignOutClose} isCentered size={isMobile ? "sm" : "md"}>
        <ModalOverlay />
        <ModalContent bg={colorMode === 'dark' ? "gray.800" : "white"}>
          <ModalHeader>Sign Out</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to sign out from this account {user?.name}?</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onSignOutClose} isDisabled={isSigningOut}>
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
    </>
  );
};

export default Navigation;