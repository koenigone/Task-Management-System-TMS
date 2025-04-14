import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Box,
  VStack,
  HStack,
  Switch,
  Text,
  Button,
  Input,
  Flex,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  useColorMode,
  Divider,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Icon,
  SimpleGrid,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEye, 
  faEyeSlash, 
  faMoon, 
  faSun, 
  faUser, 
  faLock, 
  faTrash 
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";

const Settings = () => {
  const [changeUsernameData, setChangeUsernameData] = useState({ newUsername: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [changePasswordData, setChangePasswordData] = useState({ newPassword: "", confirmNewPassword: "" });
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  
  // responsive settings
  const isMobile = useBreakpointValue({ base: true, md: false });
  const containerPadding = useBreakpointValue({ base: 3, sm: 4, md: 5 });
  const buttonSize = useBreakpointValue({ base: "sm", md: "sm" });
  const headingSize = useBreakpointValue({ base: "lg", md: "xl" }) as any;
  const gridColumns = useBreakpointValue({ base: 1, lg: 2 });

  const handleChangeUsernameSubmit = async (e: React.FormEvent) => { // handle the change username submit
    e.preventDefault();
    const { newUsername } = changeUsernameData;

    if (!newUsername.trim()) { // if the new username is empty
      toast.error("Username cannot be empty");
      return;
    }

    try { // try to change the username
      const { data } = await axios.post("/changeUsername", { newUsername });
      if (data.errMessage) {
        toast.error(data.errMessage);
      } else {
        setChangeUsernameData({
          newUsername: "",
        });
        toast.success("Username updated successfully");
        setTimeout(() => { // reload the page
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      toast.error("Failed to update username");
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => { // handle the change password submit
    e.preventDefault();
    const { newPassword, confirmNewPassword } = changePasswordData;

    if (!newPassword || !confirmNewPassword) { // if the new password or confirm new password is empty
      toast.error("Password fields cannot be empty");
      return;
    }

    if (newPassword !== confirmNewPassword) { // if the new password or confirm new password is not the same
      toast.error("Passwords do not match");
      return;
    }

    try { // try to change the password
      const { data } = await axios.post("/changePassword", {
        newPassword,
        confirmNewPassword,
      });
      if (data.errMessage) {
        toast.error(data.errMessage);
      } else {
        setChangePasswordData({
          newPassword: "",
          confirmNewPassword: "",
        });
        toast.success("Password updated successfully");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      toast.error("Failed to update password");
    }
  };

  const handleInputUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => { // handle the input username change
    const { name, value } = e.target;
    setChangeUsernameData({
      ...changeUsernameData,
      [name]: value,
    });
  };

  const handleInputPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => { // handle the input password change
    const { name, value } = e.target;
    setChangePasswordData({
      ...changePasswordData,
      [name]: value,
    });
  };

  const handleDeleteAccount = async () => {
    try {
      const { data } = await axios.post("/deleteAccount");
      if (data.errMessage) {
        toast.error(data.errMessage);
      } else {
        toast.success("Account deleted successfully");
        setUser(null); // clear the user context
        setTimeout(() => {
          navigate("/")
        }, 2000);
      }
    } catch (err) {
      toast.error("Failed to delete account");
    }
  };

  return (
    <Box width="100%" mx="auto" p={containerPadding}>
      <Heading as="h1" size={headingSize} mb={6} textAlign="center">
        Settings
      </Heading>
      
      <SimpleGrid columns={gridColumns} spacing={4} width="100%">
        {/* Theme Settings */}
        <Card 
          variant="outline" 
          boxShadow="sm"
          borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
          width="100%"
        >
          <CardHeader>
            <Flex align="center">
              <Icon as={FontAwesomeIcon} icon={colorMode === "dark" ? faMoon : faSun} mr={2} />
              <Heading size="md">Appearance</Heading>
            </Flex>
          </CardHeader>
          <Divider borderColor={colorMode === "dark" ? "gray.700" : "gray.200"} />
          <CardBody>
            <Flex 
              justify="space-between" 
              align="center" 
              bg={colorMode === "dark" ? "gray.700" : "gray.100"} 
              p={3} 
              borderRadius="md"
              flexDirection={isMobile ? "column" : "row"}
              gap={isMobile ? 3 : 0}
            >
              {isMobile ? (
                <Text textAlign="center" mb={2}>Theme Mode</Text>
              ) : (
                <HStack>
                  <Icon as={FontAwesomeIcon} icon={faSun} color={colorMode === "dark" ? "gray.400" : "orange.400"} />
                  <Text>Light</Text>
                </HStack>
              )}
              
              <Switch
                size="lg"
                isChecked={colorMode === "dark"}
                onChange={toggleColorMode}
                colorScheme="teal"
              />
              
              {!isMobile && (
                <HStack>
                  <Text>Dark</Text>
                  <Icon as={FontAwesomeIcon} icon={faMoon} color={colorMode === "dark" ? "blue.200" : "gray.400"} />
                </HStack>
              )}
            </Flex>
          </CardBody>
        </Card>

        {/* Profile Settings */}
        <Card 
          variant="outline"
          boxShadow="sm"
          borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
          width="100%"
        >
          <CardHeader>
            <Flex align="center">
              <Icon as={FontAwesomeIcon} icon={faUser} mr={2} />
              <Heading size="md">Profile</Heading>
            </Flex>
          </CardHeader>
          <Divider borderColor={colorMode === "dark" ? "gray.700" : "gray.200"} />
          <CardBody>
            <form onSubmit={handleChangeUsernameSubmit}>
              <FormControl>
                <FormLabel fontWeight="medium">Username</FormLabel>
                <InputGroup>
                  <Input
                    placeholder="Enter new username"
                    name="newUsername"
                    value={changeUsernameData.newUsername}
                    onChange={handleInputUsernameChange}
                    bg={colorMode === "dark" ? "gray.700" : "white"}
                    borderColor={colorMode === "dark" ? "gray.600" : "gray.300"}
                    _hover={{ borderColor: "teal.300" }}
                    _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }}
                  />
                </InputGroup>
                <Flex justify="flex-end" mt={2}>
                  <Button type="submit" colorScheme="teal" size={buttonSize}>
                    Update Username
                  </Button>
                </Flex>
              </FormControl>
            </form>
          </CardBody>
        </Card>

        {/* Security Settings */}
        <Card 
          variant="outline"
          boxShadow="sm"
          borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
          width="100%"
        >
          <CardHeader>
            <Flex align="center">
              <Icon as={FontAwesomeIcon} icon={faLock} mr={2} />
              <Heading size="md">Security</Heading>
            </Flex>
          </CardHeader>
          <Divider borderColor={colorMode === "dark" ? "gray.700" : "gray.200"} />
          <CardBody>
            <form onSubmit={handleChangePasswordSubmit}>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel fontWeight="medium">New password</FormLabel>
                  <InputGroup>
                    <Input
                      type={passwordVisible ? "text" : "password"}
                      name="newPassword"
                      placeholder="Enter new password"
                      value={changePasswordData.newPassword}
                      onChange={handleInputPasswordChange}
                      bg={colorMode === "dark" ? "gray.700" : "white"}
                      borderColor={colorMode === "dark" ? "gray.600" : "gray.300"}
                      _hover={{ borderColor: "teal.300" }}
                      _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }}
                    />
                    <InputRightElement>
                      <Button
                        h="1.75rem"
                        size="sm"
                        variant="ghost"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                      >
                        <FontAwesomeIcon
                          icon={passwordVisible ? faEye : faEyeSlash}
                        />
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="medium">Confirm new password</FormLabel>
                  <InputGroup>
                    <Input
                      type={passwordVisible ? "text" : "password"}
                      name="confirmNewPassword"
                      placeholder="Confirm new password"
                      value={changePasswordData.confirmNewPassword}
                      onChange={handleInputPasswordChange}
                      bg={colorMode === "dark" ? "gray.700" : "white"}
                      borderColor={colorMode === "dark" ? "gray.600" : "gray.300"}
                      _hover={{ borderColor: "teal.300" }}
                      _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }}
                    />
                    <InputRightElement>
                      <Button
                        h="1.75rem"
                        size="sm"
                        variant="ghost"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                      >
                        <FontAwesomeIcon
                          icon={passwordVisible ? faEye : faEyeSlash}
                        />
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                
                <Flex justify="flex-end">
                  <Button type="submit" colorScheme="teal" size={buttonSize}>
                    Update Password
                  </Button>
                </Flex>
              </VStack>
            </form>
          </CardBody>
        </Card>
        
        {/* Danger Zone */}
        <Card 
          variant="outline"
          boxShadow="sm"
          borderColor="red.300"
          bg={colorMode === "dark" ? "rgba(254, 178, 178, 0.06)" : "red.50"}
          width="100%"
        >
          <CardHeader>
            <Flex align="center">
              <Icon as={FontAwesomeIcon} icon={faTrash} color="red.500" mr={2} />
              <Heading size="md" color="red.500">Danger Zone</Heading>
            </Flex>
          </CardHeader>
          <Divider borderColor="red.300" />
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Text>
                Once you delete your account, there is no going back. This action cannot be undone.
              </Text>
              <Box>
                <Button colorScheme="red" onClick={onOpen} size={buttonSize}>
                  Delete Account
                </Button>
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Delete Account Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size={isMobile ? "xs" : "md"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure? This action cannot be undone. All of your data will be permanently removed.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDeleteAccount}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Settings;