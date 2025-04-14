import React, { createContext, useState, ReactNode } from "react";

interface Group { // group object
  Group_ID: number;
  GroupName: string;
  CreatedDate: string;
  User_ID: number;
  IsActive: boolean;
}

interface GroupContextType { // context type
  currentGroup: Group | null;
  setCurrentGroup: React.Dispatch<React.SetStateAction<Group | null>>;
}

export const GroupContext = createContext<GroupContextType>({} as GroupContextType);

interface GroupContextProviderProps { // props for the context provider
  children: ReactNode;
}

export function GroupContextProvider({ children }: GroupContextProviderProps) { // provider for the context
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);

  return ( // return the provider
    <GroupContext.Provider value={{ currentGroup, setCurrentGroup }}>
      {children}
    </GroupContext.Provider>
  );
}