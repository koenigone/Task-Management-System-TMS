import { Outlet } from "react-router-dom";
import Navigation from "./components/navigation";
import Header from "./components/Header/header";
import { Flex, Box } from "@chakra-ui/react";

const Layout = () => {
  return (
    <Flex height="100vh" overflow="hidden">
      <Box width="250px" position="relative" color="white">
        <Navigation />
      </Box>

      <Flex direction="column" flexGrow={1} overflow="hidden">
        <Box color="white" p={4} textAlign="center">
          <Header />
        </Box>

        <Flex flexGrow={1} p={5} justify="center" align="flex-start" overflowY="auto">
          <Box width="100%" maxWidth="1200px">
            <Outlet />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Layout;