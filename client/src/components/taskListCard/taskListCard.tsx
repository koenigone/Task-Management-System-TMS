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
  Skeleton,
  Center,
  VStack,
  useColorMode
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../../context/userContext";
import { TaskList, TaskListCardProps } from "../types";
import TaskDetailsModal from "./taskListDetails";
import AddTaskModal from "./addTaskModal";
import ShareTaskListModal from "./shareListModal";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faHandHoldingHeart, faList, faUsers } from "@fortawesome/free-solid-svg-icons";
import { useModal } from "../../../context/modalContext";

const TASK_LIST_UPDATED_EVENT = 'taskListUpdated'; // custom event for task list updates

/* TaskListCard structure:
- filter: all, leader, helper
- fetch task lists
- handle task list updates
- handle task list deletes
- handle task list shares
- handle task list adds
- handle task list closes
- handle task list opens
- handle task list shares
*/
const TaskListCard = ({ Group_ID }: TaskListCardProps) => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const { activeModal, openModal, closeModal } = useModal();
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [selectedTaskList, setSelectedTaskList] = useState<TaskList | null>(null);
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [isLoading, setIsLoading] = useState(true);
  const { colorMode } = useColorMode();
  const searchParams = new URLSearchParams(location.search); // get filter state from URL search params
  const activeFilter = searchParams.get("filter") as "all" | "leader" | "helper" || "all"; // get active filter from URL search params
  const filteredTaskLists = taskLists.filter(taskList => { // filter task lists based on the current filter
    if (activeFilter === "all") return true;
    if (activeFilter === "leader") return taskList.User_ID === user?.id;
    if (activeFilter === "helper") return taskList.User_ID !== user?.id;
    return true;
  });

  const fetchTaskLists = async () => { // retrieve task lists function
    setIsLoading(true);
    try { // retrieve task lists with axios
      const response = await axios.get("http://localhost:3000/getTaskList", {
        withCredentials: true,
        params: Group_ID ? { Group_ID } : {},
      });
      setTaskLists(response.data.taskLists);
    } catch (error) {
      toast.error("Failed to fetch task lists");
    } finally {
      setIsLoading(false);
    }
  };

  // retrieve task lists and update task lists when the task list is updated
  useEffect(() => {
    fetchTaskLists();                    // fetch task lists
    const handleTaskListUpdate = () => { // update task lists
      fetchTaskLists();
    };
    
    window.addEventListener(TASK_LIST_UPDATED_EVENT, handleTaskListUpdate);
    
    return () => {
      window.removeEventListener(TASK_LIST_UPDATED_EVENT, handleTaskListUpdate);
    };
  }, [Group_ID]);

  // TASKLIST MODAL SECTION
  const onOpenBox = (taskList: TaskList) => { // open task list modal
    setSelectedTaskList(taskList);
    openModal('taskDetails');
  };

  const onCloseBox = () => {                  // close task list modal
    setSelectedTaskList(null);
    closeModal();
  };

  const onOpenAdd = (e: React.MouseEvent, taskList: TaskList) => { // open add task modal
    e.stopPropagation();
    setSelectedTaskList(taskList);
    openModal('addTask');
  };

  // ADD TASK MODAL SECTION
  const onCloseAdd = () => { // close add task modal
    setSelectedTaskList(null);
    closeModal();
  };

  // SHARE TASK LIST MODAL SECTION
  const onOpenShare = (e: React.MouseEvent, taskList: TaskList) => {
    e.stopPropagation();
    setSelectedTaskList(taskList);
    openModal('shareTaskList');
  };

  const onShareClose = () => { // close share task list modal
    setSelectedTaskList(null);
    closeModal();
  };

  // UPDATE TASK LIST SECTION
  const handleTaskListUpdate = (updatedTaskList: TaskList) => { // update task lists
    setTaskLists(prev => prev.map(list => 
      list.List_ID === updatedTaskList.List_ID ? updatedTaskList : list
    ));
  };

  // DELETE TASK LIST SECTION
  const handleTaskListDelete = (listID: number) => { // delete task lists
    setTaskLists(prev => prev.filter(list => list.List_ID !== listID));
  };

  // LOADING SKELETON SECTION
  if (isLoading) { 
    return (
      <Flex wrap="wrap" gap={4}>
        {[1, 2, 3].map((i) => (
          <Box
            key={i}
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            width={isMobile ? "100%" : "270px"}
            boxShadow="base"
            bg={colorMode === 'dark' ? 'gray.800' : 'white'}
            height="210px"
          >
            <Skeleton height="24px" width="70%" mb={4} />
            
            <VStack spacing={2} align="stretch" mb={4}>
              <Skeleton height="15px" />
              <Skeleton height="15px" />
              <Skeleton height="15px" />
            </VStack>
            
            <Box mt="auto">
              <HStack spacing={2} mt={4} justifyContent="center">
                <Skeleton height="24px" width="80px" borderRadius="full" />
                <Skeleton height="24px" width="80px" borderRadius="full" />
                <Skeleton height="24px" width="80px" borderRadius="full" />
              </HStack>
              <Skeleton height="8px" mt={2} />
            </Box>
          </Box>
        ))}
      </Flex>
    );
  }

  // NO TASK LISTS FOUND SECTION
  if (filteredTaskLists.length === 0) {
    return (
      <Center width="100%" py={8}>
        <VStack spacing={4}>
          <Text fontSize="xl" color={colorMode === 'dark' ? 'gray.300' : 'gray.500'}>No task lists found</Text>
          <Text color={colorMode === 'dark' ? 'gray.400' : 'gray.400'}>Create a new task list to get started</Text>
        </VStack>
      </Center>
    );
  }

  // TASK LIST CARDS SECTION
  return (
    <Flex wrap="wrap" gap={4}>
      {filteredTaskLists.map((taskList) => (
        <Box
          key={taskList.List_ID}
          className="taskListCard"
          bg={colorMode === 'dark' ? 'gray.800' : 'white'}
          p={4}
          rounded="lg"
          width={isMobile ? "100%" : "270px"}
          border="1px solid"
          borderColor={colorMode === 'dark' ? 'rgba(226, 232, 240, 0.16)' : 'gray.200'}
          onClick={() => onOpenBox(taskList)}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          height="210px"
          transition="all 0.2s ease-in-out"
          _hover={{ 
            transform: "translateY(-4px)",
            boxShadow: "lg"
          }}
        >
          <Box>
            <Text 
              color={colorMode === 'dark' ? 'gray.300' : 'gray.700'} 
              fontWeight="bold" 
              mb={2}
            >
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
                    <Checkbox colorScheme="green" readOnly isChecked={task.Task_Status === 1}>
                      <Text 
                        color={colorMode === 'dark' ? 'gray.300' : 'gray.700'} 
                        noOfLines={1} 
                        maxWidth="90%"
                      >
                        {task.Task_Desc.substring(0, 40)}...
                      </Text>
                    </Checkbox>
                  </Box>
                ))
              ) : (
                <Text color={colorMode === 'dark' ? 'gray.400' : 'gray.500'} fontStyle="italic">
                  No tasks added
                </Text>
              )}
            </Box>
          </Box>

          <Box>
            <HStack spacing={2} flexWrap="wrap" mb={2} justifyContent="center">
              <Tooltip label="Identity" placement="top" hasArrow>
                <Badge colorScheme="gray" borderRadius="full" p={1} px={4} cursor="pointer">
                  <FontAwesomeIcon icon={user?.id === taskList.User_ID ? faCrown : faHandHoldingHeart} />
                  {user?.id === taskList.User_ID ? " Leader" : " Helper"}
                </Badge>
              </Tooltip>

              <Tooltip label="Number of Tasks" placement="top" hasArrow>
                <Badge colorScheme="orange" borderRadius="full" p={1} px={4} cursor="pointer">
                  <FontAwesomeIcon icon={faList} /> {taskList.tasks?.length}
                </Badge>
              </Tooltip>

              <Tooltip label={`Assigned to ${taskList.members?.length} Users`} placement="top" hasArrow>
                <Badge colorScheme="blue" borderRadius="full" p={1} px={4} cursor="pointer">
                  <FontAwesomeIcon icon={faUsers} /> {taskList.members?.length}
                </Badge>
              </Tooltip>
            </HStack>

            <Tooltip 
              label={`${taskList.progress?.completedTasks || 0} of ${taskList.progress?.totalTasks || 0} tasks completed (${taskList.progress?.percentage || 0}%)`} 
              hasArrow
            >
              <Progress 
                value={taskList.progress?.percentage || 0} 
                size="sm" 
                colorScheme="teal" 
              />
            </Tooltip>
          </Box>
        </Box>
      ))}

      <TaskDetailsModal
        isOpen={activeModal === 'taskDetails'}
        onClose={onCloseBox}
        selectedTaskList={selectedTaskList}
        onOpenAdd={(e) => onOpenAdd(e, selectedTaskList!)}
        onOpenShare={(e) => onOpenShare(e, selectedTaskList!)}
        onTaskListUpdate={handleTaskListUpdate}
        onTaskListDelete={handleTaskListDelete}
      />

      <AddTaskModal
        isOpen={activeModal === 'addTask'}
        onClose={onCloseAdd}
        listID={selectedTaskList?.List_ID || 0}
        onSuccess={fetchTaskLists}
      />

      <ShareTaskListModal
        isOpenShare={activeModal === 'shareTaskList'}
        onCloseShare={onShareClose}
        listID={selectedTaskList?.List_ID || 0}
        onSuccess={fetchTaskLists}
      />
    </Flex>
  );
};

export default TaskListCard;