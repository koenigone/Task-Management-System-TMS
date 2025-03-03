import React, { createContext, useState, ReactNode } from "react";

interface Group {
  Group_ID: number;
  GroupName: string;
  CreatedDate: string;
  User_ID: number;
  IsActive: boolean;
}

interface GroupContextType {
  currentGroup: Group | null;
  setCurrentGroup: React.Dispatch<React.SetStateAction<Group | null>>;
}

export const GroupContext = createContext<GroupContextType>({} as GroupContextType);

interface GroupContextProviderProps {
  children: ReactNode;
}

export function GroupContextProvider({ children }: GroupContextProviderProps) {
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);

  return (
    <GroupContext.Provider value={{ currentGroup, setCurrentGroup }}>
      {children}
    </GroupContext.Provider>
  );
}