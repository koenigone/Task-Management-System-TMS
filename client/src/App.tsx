import './scrollbar.css';
import { ChakraProvider } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { UserContextProvider } from "../context/userContext.tsx";
import { GroupContextProvider } from "../context/groupContext.tsx";
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

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <GroupContextProvider>
        <ChakraProvider theme={theme}>
          <Toaster />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/MyGroups" element={<MyGroupsPage />} />
              <Route path="/MyGroups/:GroupID" element={<GroupDetails />} />
              <Route path="/Invites" element={<Invites />}></Route>
              <Route path="/JoinedGroups" element={<JoinedGroups />} />
              <Route path="/Settings" element={<Settings />} />
            </Route>

            <Route path="/Signup" element={<SignUp />} />
            <Route path="/Login" element={<Login />} />
          </Routes>
        </ChakraProvider>
      </GroupContextProvider>
    </UserContextProvider>
  );
}

export default App;
