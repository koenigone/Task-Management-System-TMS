import "./sign-in-up.css";
import { useState } from "react";
import Axios from "axios";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Link,
  VStack,
  Heading,
  Center,
  InputRightElement,
  InputGroup
} from "@chakra-ui/react";
import CurvedBackground from "../../components/register-components/background";
import Information from "../../components/register-components/information";
import InformativeIcons from "../../components/register-components/informativeIcons";
import { Link as RouterLink } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye,faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const signIn = async () => {

    try {
      const response = await Axios.post("http://localhost:3000/auth/login", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      console.log("Response:", response.data);
      alert("Login Successful!");
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Failed to Login!");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn();
  };

  return (
    <ChakraProvider>
      <Box className="container">
        <CurvedBackground />
        <InformativeIcons />
        <Information />

        <Box className="register-container" boxShadow="lg">
          <Heading as="h3" size="lg" textAlign="center" color="#E3E3E3" fontWeight="bold" mb={4}>
            Login
          </Heading>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">

              <FormControl>
                <FormLabel>Email or Username</FormLabel>
                <Input
                  bg="#E3E3E3"
                  type="email"
                  name="email"
                  color="black"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    defaultValue="secret"
                    type={passwordVisible ? "text" : "password"}
                    bg="#E3E3E3"
                    name="password"
                    color="black"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" variant="ghost" _hover={{ bg: "transparent" }} color="rgba(0, 0, 0, 0.3)" size="sm" onClick={() => setPasswordVisible(!passwordVisible)}>
                      <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash } />
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Center>
                <Button
                  className="submit-btn"
                  type="submit"
                  color="white"
                  fontWeight="bold"
                  bg="#1B686A"
                  border="none"
                  p="10px 12px"
                  borderRadius="8px"
                  _hover={{ bg: "#166060" }}
                >
                  Login
                </Button>
              </Center>

              <Text textAlign="center" color="#E3E3E3">
                Don't have an account?{" "}
                <Link as={RouterLink} to="/SignUp" textDecor="underline" className="navigate-link">
                  Sign Up
                </Link>
              </Text>
            </VStack>
          </form>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default Login;