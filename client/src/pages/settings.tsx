import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Box,
  VStack,
  HStack,
  Switch,
  Text,
  Button,
  Avatar,
  Input,
  Center,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Settings = () => {
  const [changeUsernameData, setChangeUsernameData] = useState({
    newUsername: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  const [changePasswordData, setChangePasswordData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChangeUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { newUsername } = changeUsernameData;

    try {
      const { data } = await axios.post("/changeUsername", { newUsername });
      if (data.errMessage) {
        toast.error(data.errMessage);
      } else {
        setChangeUsernameData({
          newUsername: "",
        });
        toast.success("Username updated successfully");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      console.error("error occured:", err);
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    // prevents the page from auto reload on submission
    e.preventDefault();
    const { newPassword, confirmNewPassword } = changePasswordData;

    try {
      const { data } = await axios.post("/changePassword", { newPassword, confirmNewPassword });
      if (data.errMessage) {
        toast.error(data.errMessage);
      } else {
        setChangePasswordData({
          newPassword: "",
          confirmNewPassword: ""
        });
        toast.success("Password updated successfully");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      console.error("error occured:", err);
    }
  };

  const handleInputUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChangeUsernameData({
      ...changeUsernameData,
      [name]: value,
    });
  };

  const handleInputPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChangePasswordData({
      ...changePasswordData,
      [name]: value,
    });
  };

  return (
    <Box height="100%" boxShadow="xl" borderColor="rgba(43, 50, 65, 0.3)">
      <VStack align="center" spacing={10}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Personalization
          </Text>
          <HStack spacing={4}>
            <Text>Switch Theme</Text>
            <Switch size="lg" />
          </HStack>
        </Box>

        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Security
          </Text>
          <VStack align="start" spacing={8}>
            <HStack spacing={4}>
              <Avatar size="md" />
              <Button colorScheme="teal">Change Profile Picture</Button>
            </HStack>
            <VStack spacing={4} justifyContent="center">
              <form onSubmit={handleChangeUsernameSubmit}>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>Change Username</FormLabel>
                    <Input
                      placeholder="New Username"
                      width="auto"
                      name="newUsername"
                      value={changeUsernameData.newUsername}
                      onChange={handleInputUsernameChange}
                    />
                  </FormControl>
                  <Center>
                    <Button type="submit" colorScheme="teal">
                      Save
                    </Button>
                  </Center>
                </VStack>
              </form>

              <form onSubmit={handleChangePasswordSubmit}>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>New password</FormLabel>
                    <InputGroup>
                      <Input
                        defaultValue="secret"
                        type={passwordVisible ? "text" : "password"}
                        bg="#E3E3E3"
                        name="newPassword"
                        color="black"
                        placeholder="Enter your password"
                        value={changePasswordData.newPassword}
                        onChange={handleInputPasswordChange}
                      />
                      <InputRightElement width="4.5rem">
                        <Button
                          h="1.75rem"
                          variant="ghost"
                          _hover={{ bg: "transparent" }}
                          color="rgba(0, 0, 0, 0.3)"
                          size="sm"
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
                    <FormLabel>Confirm new password</FormLabel>
                    <InputGroup>
                      <Input
                        defaultValue="secret"
                        type={passwordVisible ? "text" : "password"}
                        bg="#E3E3E3"
                        name="confirmNewPassword"
                        color="black"
                        placeholder="Confirm password"
                        value={changePasswordData.confirmNewPassword}
                        onChange={handleInputPasswordChange}
                      />
                      <InputRightElement width="4.5rem">
                        <Button
                          h="1.75rem"
                          variant="ghost"
                          _hover={{ bg: "transparent" }}
                          color="rgba(0, 0, 0, 0.3)"
                          size="sm"
                          onClick={() => setPasswordVisible(!passwordVisible)}
                        >
                          <FontAwesomeIcon
                            icon={passwordVisible ? faEye : faEyeSlash}
                          />
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                  <Center>
                    <Button type="submit" colorScheme="teal">
                      Save
                    </Button>
                  </Center>
                </VStack>
              </form>
            </VStack>
            <HStack width="100%" justifyContent="center">
              <Button colorScheme="red">Delete Account</Button>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default Settings;
