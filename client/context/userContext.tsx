import React, { createContext, useState, useEffect, ReactNode } from "react"
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContext = createContext<UserContextType>({} as UserContextType);

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!user) {
      axios.get("/profile").then(({ data }) => {
        if (data) {
          setUser(data.user);
        }
      });
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}