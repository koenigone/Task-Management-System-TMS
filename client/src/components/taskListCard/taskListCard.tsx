import { Flex, useMediaQuery } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TaskList } from "./types";
import TaskCard from "./getTaskCard";
import TaskDetailsModal from "./taskListDetails";
import AddTaskModal from "./addTaskModal";
import toast from "react-hot-toast";

const TaskListCard = () => {
  const navigate = useNavigate();
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [selectedTaskList, setSelectedTaskList] = useState<TaskList | null>(null);
  const [isOpenBox, setIsOpenBox] = useState(false);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isMobile] = useMediaQuery("(max-width: 768px)");

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
        const response = await axios.get("http://localhost:3000/getTaskList", {
          withCredentials: true,
        });
        setTaskLists(response.data.taskLists);
      } catch (error) {
        console.error("Error fetching task lists:", error);
      }
    };

    fetchTaskLists();
  }, []);

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
      />

      <AddTaskModal
        isOpen={isOpenAdd}
        onClose={onCloseAdd}
        createTaskData={createTaskData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
    </Flex>
  );
};

export default TaskListCard;