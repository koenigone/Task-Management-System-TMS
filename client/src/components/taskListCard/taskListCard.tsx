import { Flex, useMediaQuery } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TaskList } from "./types";
import TaskCard from "./getTaskCard";
import TaskDetailsModal from "./taskListDetails";
import AddTaskModal from "./addTaskModal";
import ShareTaskListModal from "./shareListModal";
import toast from "react-hot-toast";

interface TaskListCardProps {
  Group_ID?: number; // Add groupID as an optional prop
}

const TaskListCard = ({ Group_ID }: TaskListCardProps) => {
  const navigate = useNavigate();
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [selectedTaskList, setSelectedTaskList] = useState<TaskList | null>(
    null
  );
  const [isOpenBox, setIsOpenBox] = useState(false);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  const [shareListData, setShareListData] = useState({
    listID: 0,
    userEmail: "",
  });

  const onOpenBox = (taskList: TaskList) => {
    setSelectedTaskList(taskList);
    setIsOpenBox(true);
  };

  const onCloseBox = () => setIsOpenBox(false);

  const onOpenAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedTaskList) {
      setCreateTaskData((prevData) => ({
        ...prevData,
        listID: selectedTaskList.List_ID,
      }));
    }
    setIsOpenAdd(true);
  };

  const onCloseAdd = () => setIsOpenAdd(false);

  const onOpenShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedTaskList) {
      setShareListData((prevData) => ({
        ...prevData,
        listID: selectedTaskList.List_ID,
      }));
    }
    setIsShareOpen(true);
  };

  const onShareClose = () => setIsShareOpen(false);

  const handleInputChangeShareList = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setShareListData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [createTaskData, setCreateTaskData] = useState({
    listID: selectedTaskList?.List_ID || "",
    taskDesc: "",
    taskPriority: 1,
    taskDueDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { listID, taskDesc, taskPriority, taskDueDate } = createTaskData;

    try {
      const { data } = await axios.post("/createTask", {
        listID,
        taskDesc,
        taskPriority,
        taskDueDate,
      });
      if (data.errMessage) {
        toast.error(data.errMessage);
      } else {
        setCreateTaskData({
          listID: "",
          taskDesc: "",
          taskPriority: 1,
          taskDueDate: "",
        });
        toast.success("Task added successfully");
        navigate("/");
      }
    } catch (err) {
      console.error("Adding task error:", err);
    }
  };

  const handleSubmitShareList = async (e: React.FormEvent) => {
    e.preventDefault();
    const { listID, userEmail } = shareListData;

    try {
      const { data } = await axios.post("http://localhost:3000/inviteByEmail", {
        listID,
        userEmail,
      });

      if (data.errMessage) {
        toast.error(data.errMessage);
      } else {
        setShareListData({
          listID,
          userEmail: "",
        });
        toast.success(`Invite Sent to ${userEmail}`);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      toast.error("Invite error" );
    }
  };

  const handleInputChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setCreateTaskData((prevData) => ({
      ...prevData,
      [name]: name === "taskPriority" ? Number(value) : value,
    }));
  };

  useEffect(() => {
    const fetchTaskLists = async () => {
      try {
        if (Group_ID !== undefined && Group_ID !== null) {
          const response = await axios.get("http://localhost:3000/getTaskList", {
            withCredentials: true,
            params: { Group_ID },
          });
          setTaskLists(response.data.taskLists);
        }
      } catch (error) {
        console.error("Error fetching task lists:", error);
      }
    };
  
    fetchTaskLists();
  }, [Group_ID]);
  

  return (
    <Flex wrap="wrap" gap={4}>
      {taskLists.map((taskList) => (
        <TaskCard
          key={taskList.List_ID}
          taskList={taskList}
          isMobile={isMobile}
          onOpenBox={onOpenBox}
        />
      ))}

      <TaskDetailsModal
        isOpen={isOpenBox}
        onClose={onCloseBox}
        selectedTaskList={selectedTaskList}
        onOpenAdd={onOpenAdd}
        onOpenShare={onOpenShare}
      />

      <AddTaskModal
        isOpen={isOpenAdd}
        onClose={onCloseAdd}
        createTaskData={createTaskData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />

      <ShareTaskListModal
        isOpenShare={isShareOpen}
        onCloseShare={onShareClose}
        shareListData={shareListData}
        handleInputChangeShareList={handleInputChangeShareList}
        handleSubmitShareList={handleSubmitShareList}
      />
    </Flex>
  );
};

export default TaskListCard;