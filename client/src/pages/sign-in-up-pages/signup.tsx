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
} from "@chakra-ui/react";
import CurvedBackground from "../../components/register-components/background";
import Information from "../../components/register-components/information";
import InformativeIcons from "../../components/register-components/informativeIcons";
import { Link as RouterLink } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const signUp = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await Axios.post("http://localhost:3000/auth/signup", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      console.log("Response:", response.data);
      alert("Account created successfully!");
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Failed to create account!");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signUp();
  };

  return (
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
                value={formData.username}
                onChange={handleChange}
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
                value={formData.email}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input
                bg="#E3E3E3"
                type="password"
                name="password"
                color="black"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                bg="#E3E3E3"
                type="password"
                name="confirmPassword"
                color="black"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </FormControl>

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
  );
};

export default SignUp;