import {
  Flex,
  Box,
  Text,
  Badge,
  HStack,
  Progress,
  Checkbox,
  Tooltip,
  useMediaQuery,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../../context/userContext";
import { TaskList, TaskListCardProps } from "./types";
import TaskDetailsModal from "./taskListDetails";
import AddTaskModal from "./addTaskModal";
import ShareTaskListModal from "./shareListModal";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faList, faUsers } from "@fortawesome/free-solid-svg-icons";

const TaskListCard = ({ Group_ID }: TaskListCardProps) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [selectedTaskList, setSelectedTaskList] = useState<TaskList | null>(null);
  const [isOpenBox, setIsOpenBox] = useState(false);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  const [shareListData, setShareListData] = useState({
    listID: 0,
    userEmail: "",
  });

  const [createTaskData, setCreateTaskData] = useState({
    listID: selectedTaskList?.List_ID || "",
    taskDesc: "",
    taskPriority: 1,
    taskDueDate: "",
  });

  useEffect(() => {
    const fetchTaskLists = async () => {
      try {
        const response = await axios.get("http://localhost:3000/getTaskList", {
          withCredentials: true,
          params: Group_ID ? { Group_ID } : {},
        });
        setTaskLists(response.data.taskLists);
      } catch (error) {
        console.error("Error fetching task lists:", error);
      }
    };

    fetchTaskLists();
  }, [Group_ID]);

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
        setShareListData({ listID, userEmail: "" });
        toast.success(`Invite Sent to ${userEmail}`);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      toast.error("Invite error");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setCreateTaskData((prevData) => ({
      ...prevData,
      [name]: name === "taskPriority" ? Number(value) : value,
    }));
  };

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

  return (
    <Flex wrap="wrap" gap={4}>
      {taskLists.map((taskList) => (
        <Box
          key={taskList.List_ID}
          className="taskListCard"
          bg="white"
          p={4}
          rounded="lg"
          width={isMobile ? "100%" : "250px"}
          border="1px solid #e2e8f0"
          onClick={() => onOpenBox(taskList)}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          height="210px"
        >
          <Box>
            <Text fontWeight="bold" mb={2}>
              {taskList.ListName}
            </Text>

            <Box mb={3}>
              {taskList.tasks && taskList.tasks.length > 0 ? (
                taskList.tasks.slice(0, 3).map((task) => (
                  <Box
                    key={task.Task_ID}
                    display="flex"
                    alignItems="center"
                    mt={2}
                  >
                    <Checkbox colorScheme="green">
                      <Text noOfLines={1} maxWidth="90%">
                        {task.Task_Desc.substring(0, 40)}...
                      </Text>
                    </Checkbox>
                  </Box>
                ))
              ) : (
                <Text color="gray.500" fontStyle="italic">
                  No tasks added
                </Text>
              )}
            </Box>
          </Box>

          <Box>
            <HStack spacing={2} flexWrap="wrap" mb={2}>
              <Tooltip label="Identity" placement="top" hasArrow>
                <Badge colorScheme="gray" borderRadius="full" p={1} px={4} cursor="pointer">
                  <FontAwesomeIcon icon={faCrown} />
                  {user?.id == taskList.User_ID ? "Leader" : "Member"}
              </Badge>
              </Tooltip>

              <Tooltip label="Number of Tasks" placement="top" hasArrow>
                <Badge colorScheme="green" borderRadius="full" p={1} px={4} cursor="pointer">
                  <FontAwesomeIcon icon={faList} /> {taskList.tasks?.length}
                </Badge>
              </Tooltip>

              <Tooltip label={`Assigned to ${taskList.members?.length} Users`} placement="top" hasArrow>
                <Badge colorScheme="pink" borderRadius="full" p={1} px={4} cursor="pointer">
                  <FontAwesomeIcon icon={faUsers} /> {taskList.members?.length}
                </Badge>
              </Tooltip>
            </HStack>

            <Tooltip label="Progress" hasArrow>
              <Progress value={50} size="sm" colorScheme="teal" />
            </Tooltip>
          </Box>
        </Box>
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
