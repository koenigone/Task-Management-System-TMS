import { Box, Button, Center, Heading, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt, faUserPlus } from "@fortawesome/free-solid-svg-icons";

// AuthPrompt is used to prompt the user to login or sign up when no token is found
const AuthPrompt = () => {
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const headingColor = useColorModeValue("teal.600", "teal.300");

  return (
    <Center height="100vh" width="100vw">
      <Box
        p={8}
        maxWidth="500px"
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        bg={bgColor}
        textAlign="center"
      >
        <VStack spacing={6}>
          <Heading size="xl" color={headingColor}>
            Welcome to Task Management System
          </Heading>
          
          <Text fontSize="lg" color={textColor}>
            Please log in or create an account to manage your tasks and groups.
          </Text>
          
          <VStack spacing={4} width="100%">
            <Button
              as={RouterLink}
              to="/Login"
              leftIcon={<FontAwesomeIcon icon={faSignInAlt} />}
              colorScheme="teal"
              size="lg"
              width="100%"
            >
              Login
            </Button>
            
            <Button
              as={RouterLink}
              to="/Signup"
              leftIcon={<FontAwesomeIcon icon={faUserPlus} />}
              variant="outline"
              colorScheme="teal"
              size="lg"
              width="100%"
            >
              Sign Up
            </Button>
          </VStack>
        </VStack>
      </Box>
    </Center>
  );
};

export default AuthPrompt; 