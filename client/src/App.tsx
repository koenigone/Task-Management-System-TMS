import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { UserContextProvider } from "../context/userContext.tsx";
import Layout from "./layout.tsx";
import Dashboard from "./pages/dashboard/dashboard";
import CreateGroup from "./pages/createGroup/createGroup";
import MyGroups from "./pages/myGroups/myGroups";
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
            <Route path="/CreateGroup" element={<CreateGroup />} />
            <Route path="/MyGroups" element={<MyGroups />} />
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
