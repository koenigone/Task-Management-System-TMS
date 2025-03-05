import "./settings.css";
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
} from "@chakra-ui/react";

const Settings = () => {
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
              <form>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>Change Username</FormLabel>
                    <Input placeholder="New Username" width="auto" />
                  </FormControl>
                  <Center>
                    <Button type="submit" colorScheme="teal">
                      Save
                    </Button>
                  </Center>
                </VStack>
              </form>

              <form>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>Change Password</FormLabel>
                    <Input
                      placeholder="New Password"
                      type="password"
                      width="auto"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Confirm New Password</FormLabel>
                    <Input
                      placeholder="Confirm New Password"
                      type="password"
                      width="auto"
                    />
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
