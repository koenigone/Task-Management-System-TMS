import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { UserContextProvider } from "../context/userContext.tsx";
import Layout from "./layout.tsx";
import Dashboard from "./pages/dashboard/dashboard";
import MyGroupsPage from "./pages/myGroupsPage/myGroupsPage.tsx";
import GroupDetails from "./pages/groupDetails/groupDetails.tsx";
import JoinedGroups from "./pages/joinedGroups/joinedGroups";
import Settings from "./pages/settings/settings";
import SignUp from "./pages/passport/signup.tsx";
import Login from "./pages/passport/login.tsx";

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <ChakraProvider>
        <Toaster />
        <Routes>
          {/* Wrap all protected pages inside Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/MyGroups" element={<MyGroupsPage />} />
            <Route path="/MyGroups/:groupName" element={<GroupDetails />} />
            <Route path="/JoinedGroups" element={<JoinedGroups />} />
            <Route path="/Settings" element={<Settings />} />
          </Route>

          {/* Auth pages (No layout) */}
          <Route path="/Signup" element={<SignUp />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
      </ChakraProvider>
    </UserContextProvider>
  );
}

export default App;
