import React, { createContext, useState, useEffect, ReactNode } from "react"
import toast from "react-hot-toast";
import axios from "axios";
import { useLocation } from "react-router-dom";

interface User { // user object
  id: number;
  name: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
}

interface UserContextProviderProps { // props for the user context provider
  children: ReactNode;
}

export const UserContext = createContext<UserContextType>({} as UserContextType); // create the user context

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => { // check if the user is authenticated
    const checkAuth = async () => {
      if (location.pathname === "/Login" || location.pathname === "/Signup") { // skip profile fetch on public routes
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await axios.get("/profile");
        if (data && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) { // if there is an error
        if (location.pathname !== "/Login" && location.pathname !== "/Signup") { // if the user is not on the login or signup page
          toast.error("Authentication error");
        }
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => { // check if the user is authenticated
      checkAuth();
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]); // add location.pathname as dependency

  return ( // return the provider
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}