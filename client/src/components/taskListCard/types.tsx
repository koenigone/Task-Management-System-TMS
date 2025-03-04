export interface Task {
  Task_ID: number;
  Task_Desc: string;
  Task_Priority: number;
  Task_DueDate: string;
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
}