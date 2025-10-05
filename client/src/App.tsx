import './scrollbar.css';
import { ChakraProvider } from "@chakra-ui/react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { UserContextProvider } from "../context/userContext.tsx";
import { GroupContextProvider } from "../context/groupContext.tsx";
import { ModalProvider } from "../context/modalContext.tsx";
import theme from './theme.tsx';
import Layout from "./layout.tsx";
import Dashboard from "./pages/dashboard";
import MyGroupsPage from "./pages/myGroupsPage.tsx";
import GroupDetails from "./pages/groupDetails.tsx";
import Invites from "./pages/invites.tsx";
import JoinedGroups from "./pages/joinedGroups.tsx";
import Settings from "./pages/settings.tsx";
import SignUp from "./pages/signup.tsx";
import Login from "./pages/login.tsx";

axios.defaults.baseURL = "/api";
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <GroupContextProvider>
        <ModalProvider>
          <ChakraProvider theme={theme}>
            <Toaster />
            <Routes>
              {/* Public routes */}
              <Route path="/Login" element={<Login />} />
              <Route path="/Signup" element={<SignUp />} />
              
              {/* Protected routes */}
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/MyGroups" element={<MyGroupsPage />} />
                <Route path="/MyGroups/GroupDetails/:GroupID" element={<GroupDetails />} />
                <Route path="/Invites" element={<Invites />} />
                <Route path="/JoinedGroups" element={<JoinedGroups />} />
                <Route path="/Settings" element={<Settings />} />
              </Route>
              
              {/* Redirect to home for unknown routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ChakraProvider>
        </ModalProvider>
      </GroupContextProvider>
    </UserContextProvider>
  );
}

export default App;