export interface TaskListCardProps {
  Group_ID?: number;
}

export interface Task {
  Task_ID: number;
  Task_Desc: string;
  Task_Priority: number;
  Task_DueDate: string | null;
  Task_Status: number;
}

export interface TaskList {
  List_ID: number;
  User_ID: number;
  ListName: string;
  DueDate: string;
  CreatedDate: string;
  Group_ID?: number;
  tasks?: Task[];
  members?: { UserName: string }[];
  progress?: {
    totalTasks: number;
    completedTasks: number;
    percentage: number;
  };
}

export interface GroupMember {
  User_ID: number;
  User_Username: string;
}

export interface Groups {
  Group_ID: number;
  GroupName: string;
  CreatedDate: string;
  User_ID: number;
  User_Username: string;
  Creator_ID?: number;
  Creator_Username?: string;
  IsActive: boolean;
  TaskLists: TaskList[]; 
  Members: GroupMember[];
}