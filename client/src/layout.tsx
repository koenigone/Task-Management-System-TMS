import { Outlet, useLocation } from "react-router-dom";
import Navigation from "./components/navigation";
import Header from "./components/Header/header";
import { Flex, Box, Center, Spinner, useColorMode, useBreakpointValue } from "@chakra-ui/react";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import AuthPrompt from "./components/AuthPrompt";

/* Layout structure:
  - get the user, isLoading, and location
  - return the Layout
*/
const Layout = () => {
  const { user, isLoading } = useContext(UserContext);
  const location = useLocation();
  const { colorMode } = useColorMode();
  
  // responsive values
  const mainPadding = useBreakpointValue({ base: 3, sm: 4, md: 5 });
  
  // check if we're on a public route (login/signup)
  const isPublicRoute = location.pathname === "/Login" || location.pathname === "/Signup";
  
  if (isLoading) { // show loading spinner while checking authentication
    return (
      <Center height="100vh" bg={colorMode === 'dark' ? 'black' : '#FAFAFA'}>
        <Spinner size="xl" color="teal.500" thickness="4px" />
      </Center>
    );
  }
  
  if (!user && !isPublicRoute) { // if user is not logged in and not on a public route, show the auth prompt
    return <AuthPrompt />;
  }

  return (
    <Flex 
      height="100vh" 
      overflow="hidden" 
      bg={colorMode === 'dark' ? 'black' : '#FAFAFA'}
      direction={{ base: "column", md: "row" }}
    >
      {/* Navigation */}
      <Box 
        width={{ base: "auto", md: "250px" }} 
        height={{ base: "auto", md: "100vh" }}
        position="relative" 
        color={colorMode === 'dark' ? 'white' : 'gray.800'}
        order={{ base: 2, md: 1 }}
      >
        <Navigation />
      </Box>

      <Flex 
        direction="column" 
        flexGrow={1} 
        overflow="hidden"
        order={{ base: 1, md: 2 }}
        width={{ base: "100%", md: "calc(100% - 250px)" }}
      >
        <Box textAlign="center" pt={2} pb={2}>
          <Header />
        </Box>

        <Flex 
          flexGrow={1} 
          p={mainPadding}
          justify="center" 
          align="flex-start" 
          overflowY="auto"
          bg={colorMode === 'dark' ? 'black' : '#FAFAFA'}
        >
          <Box width="100%" maxWidth="1200px">
            <Outlet />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Layout;