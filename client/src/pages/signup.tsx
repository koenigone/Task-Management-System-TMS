import "./passport.css";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
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
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import CurvedBackground from "../components/register-components/background";
import Information from "../components/register-components/information";
import InformativeIcons from "../components/register-components/informativeIcons";
import { Link as RouterLink } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const SignUp = () => {
  const navigate = useNavigate();
  const [signUpData, setSignUpData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => { // prevents the page from auto reload on submission
    e.preventDefault();
    const { username, email, password } = signUpData;

    try {
      const { data } = await axios.post("/signup", { username, email, password });
      if (data.errMessage) {
        toast.error(data.errMessage);
      } else {
        setSignUpData({ // reset fields if no error
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        toast.success("Sign Up Successful! Please log in.");
        navigate('/login') // navigate to login upon successful sign up
      }
    } catch (err: any) {
      const message = err.response?.data?.errMessage || "Signup error";
      toast.error(message);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpData({
      ...signUpData,
      [name]: value
    });
  };

  return (
    <ChakraProvider>
      <Box className="container">
        <CurvedBackground />
        <InformativeIcons />
        <Information />

        <Box className="register-container" boxShadow="lg">
          <Heading as="h3" size="lg" textAlign="center" color="#E3E3E3" fontWeight="bold" mb={4}>
            Sign Up
          </Heading>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input
                  bg="#E3E3E3"
                  type="text"
                  name="username"
                  color="black"
                  placeholder="Enter your username"
                  value={signUpData.username}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  bg="#E3E3E3"
                  type="email"
                  name="email"
                  color="black"
                  placeholder="example@gmail.com"
                  value={signUpData.email}
                  onChange={handleInputChange}
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
                    value={signUpData.password}
                    onChange={handleInputChange}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" variant="ghost" _hover={{ bg: "transparent" }} color="rgba(0, 0, 0, 0.3)" size="sm" onClick={() => setPasswordVisible(!passwordVisible)}>
                      <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash } />
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                  <Input
                    defaultValue="secret"
                    type={passwordVisible ? "text" : "password"}
                    bg="#E3E3E3"
                    name="confirmPassword"
                    color="black"
                    placeholder="Confirm password"
                    value={signUpData.confirmPassword}
                    onChange={handleInputChange}
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
                  Sign Up
                </Button>
              </Center>

              <Text textAlign="center" color="#E3E3E3">
                Already have an account?{" "}
                <Link as={RouterLink} to="/login" textDecor="underline" className="navigate-link">
                  Login
                </Link>
              </Text>
            </VStack>
          </form>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default SignUp;