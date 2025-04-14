import { TaskList } from "../types";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../context/userContext";
import { GroupContext } from "../../../context/groupContext";
import { formatDate } from "../helpers";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  Text,
  Box,
  Flex,
  Tooltip,
  Badge,
} from "@chakra-ui/react";
import { faCheck, faPlus, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import toast from "react-hot-toast";
import AssignToGroupMembers from "./assignMembersModal";
import { useModal } from "../../../context/modalContext";

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTaskList: TaskList | null;
  onOpenAdd: (e: React.MouseEvent) => void;
  onOpenShare: (e: React.MouseEvent) => void;
  onTaskListUpdate: (updatedTaskList: TaskList) => void;
  onTaskListDelete: (listID: number) => void;
}

// create a custom event for task list updates
const TASK_LIST_UPDATED_EVENT = 'taskListUpdated';

const TaskDetailsModal = ({
  isOpen,
  onClose,
  selectedTaskList,
  onOpenAdd,
  onOpenShare,
  onTaskListUpdate,
  onTaskListDelete,
}: TaskDetailsModalProps) => {
  const { user } = useContext(UserContext);
  const { currentGroup } = useContext(GroupContext);
  const { activeModal, openModal, closeModal } = useModal();
  const [isTaskLoading, setIsTaskLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [members, setMembers] = useState([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [currentTaskList, setCurrentTaskList] = useState<TaskList | null>(null);

  useEffect(() => { // update the current task list when the selectedTaskList prop changes
    setCurrentTaskList(selectedTaskList);
  }, [selectedTaskList]);

  const handleMarkAsComplete = async (taskID: number) => {
    setIsTaskLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/markTaskAsComplete", { taskID }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (currentTaskList) { // update the task status in the UI
        const updatedTaskList = {
          ...currentTaskList,
          tasks: currentTaskList.tasks?.map(task => 
            task.Task_ID === taskID 
              ? { ...task, Task_Status: task.Task_Status === 0 ? 1 : 0 } 
              : task
          ) || []
        };
        
        setCurrentTaskList(updatedTaskList);                      // update the local state
        onTaskListUpdate(updatedTaskList);                        // update the task list in the parent component
        window.dispatchEvent(new Event(TASK_LIST_UPDATED_EVENT)); // dispatch event to update task lists across components
      }
      
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Failed to update task status");
    } finally {
      setIsTaskLoading(false);
    }
  };

  const handleDeleteList = async () => {
    if (!currentTaskList) return;

    setIsDeleting(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/deleteTaskList",
        { listID: currentTaskList.List_ID }
      );
      
      onTaskListDelete(currentTaskList.List_ID);                // notify parent component about deletion
      window.dispatchEvent(new Event(TASK_LIST_UPDATED_EVENT)); // dispatch event to update task lists across components
      
      toast.success(response.data.message);
      onClose();
      closeModal();
    } catch (error) {
      toast.error("Error deleting task list");
    } finally {
      setIsDeleting(false);
    }
  };

  const fetchGroupMembers = async () => {
    if (!currentGroup?.Group_ID) return;

    setIsLoadingMembers(true);
    try {
      const { data } = await axios.get(
        "http://localhost:3000/getGroupMembers",
        {
          params: { groupID: currentGroup.Group_ID },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMembers(data.members || []);
    } catch (err) {
      toast.error("Failed to fetch members");
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const handleLeaveTaskList = async () => {
    if (!currentTaskList?.List_ID) return;

    try {
      const response = await axios.post("http://localhost:3000/leaveTaskList", { listID: currentTaskList.List_ID }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success(response.data.message);
      onClose();
      closeModal();
    } catch (err) {
      toast.error("Failed to leave task list");
    }
  };

  const handleOpenShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentTaskList?.Group_ID) {
      fetchGroupMembers();
      openModal('assignMembers');
    } else {
      onOpenShare(e);
    }
  };

  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen} isCentered size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            color="gray.700"
            fontSize="2xl"
            fontWeight="bold"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={6}
            borderBottom="1px"
            borderColor="gray.200"
          >
            <Text color="gray.600">{currentTaskList?.ListName}</Text>
            <ModalCloseButton size="lg" />
          </ModalHeader>
          <ModalBody p={6}>
            <Text color="gray.600" fontSize="sm" mb={6}>
              Created {formatDate(currentTaskList?.CreatedDate)}
            </Text>

            <Box maxH="400px" overflowY="auto" pr={2}>
              {currentTaskList?.tasks && currentTaskList.tasks.length > 0 ? (
                <VStack spacing={4} align="stretch">
                  {currentTaskList.tasks.map((task) => (
                    <Box
                      key={task.Task_ID}
                      p={4}
                      borderWidth="1px"
                      borderRadius="lg"
                      boxShadow="sm"
                      bg="white"
                      _hover={{
                        boxShadow: "md",
                        transform: "translateY(-2px)",
                        transition: "all 0.2s",
                      }}
                    >
                      <Flex justify="space-between" align="center">
                        <Text fontWeight="bold" fontSize="lg" color="gray.700">
                          {task.Task_Desc}
                        </Text>
                        <Button
                          size="sm"
                          colorScheme={
                            task.Task_Status === 0 ? "gray" : "green"
                          }
                          leftIcon={<FontAwesomeIcon icon={faCheck} />}
                          variant={task.Task_Status === 0 ? "outline" : "solid"}
                          onClick={() => handleMarkAsComplete(task.Task_ID)}
                          isLoading={isTaskLoading}
                          loadingText="Updating..."
                        >
                          {task.Task_Status === 0
                            ? "Mark Complete"
                            : "Mark Pending"}
                        </Button>
                      </Flex>
                      <Flex
                        justifyContent="space-between"
                        gap={4}
                        mt={2}
                        color="gray.600"
                        fontSize="sm"
                      >
                        <Text>
                          <Tooltip label="Priority" hasArrow>
                            <Badge
                              colorScheme={
                                task.Task_Priority === 3
                                  ? "red"
                                  : task.Task_Priority === 2
                                    ? "orange"
                                    : "green"
                              }
                            >
                              {task.Task_Priority === 3
                                ? "High"
                                : task.Task_Priority === 2
                                  ? "Normal"
                                  : "Low"}
                            </Badge>
                          </Tooltip>
                        </Text>
                        <Text>
                          <Tooltip label="Due date" hasArrow>
                            {task.Task_DueDate ? formatDate(task.Task_DueDate) : "Opened"}
                          </Tooltip>
                        </Text>
                        <Text>
                          <Tooltip label="Status" hasArrow>
                            <Badge
                              colorScheme={
                                task.Task_Status === 0 ? "yellow" : "green"
                              }
                            >
                              {task.Task_Status === 0 ? "Pending" : "Completed"}
                            </Badge>
                          </Tooltip>
                        </Text>
                      </Flex>
                    </Box>
                  ))}
                </VStack>
              ) : (
                <Text textAlign="center" color="gray.500" fontSize="lg">
                  No tasks added yet
                </Text>
              )}
            </Box>
          </ModalBody>
          <ModalFooter p={6} borderTop="1px" borderColor="gray.200">
            <Flex justify="space-between" align="center" width="100%">
              {currentTaskList?.User_ID === user?.id && (
                <Flex gap={2}>
                  <Tooltip label="Add tasks" placement="top" hasArrow>
                    <Button
                      onClick={onOpenAdd}
                      colorScheme="blue"
                      leftIcon={<FontAwesomeIcon icon={faPlus} />}
                    >
                      Add Task
                    </Button>
                  </Tooltip>
                  <Tooltip
                    label="Invite people to list"
                    placement="top"
                    hasArrow
                  >
                    {currentTaskList?.Group_ID ? (
                      <Button
                        onClick={handleOpenShare}
                        colorScheme="teal"
                        leftIcon={<FontAwesomeIcon icon={faUserPlus} />}
                      >
                        Assign
                      </Button>
                    ) : (
                      <Button
                        onClick={onOpenShare}
                        colorScheme="teal"
                        leftIcon={<FontAwesomeIcon icon={faUserPlus} />}
                      >
                        Invite
                      </Button>
                    )}
                  </Tooltip>
                </Flex>
              )}
              <Flex gap={3}>
                {currentTaskList?.User_ID === user?.id ? (
                  <Button onClick={() => openModal('deleteList')} background="red.300">
                    Delete List
                  </Button>
                ) : (
                  <Button onClick={() => openModal('leaveList')} background="red.300">
                    Leave List
                  </Button>
                )}
                <Button onClick={onClose} colorScheme="gray">
                  Close
                </Button>
              </Flex>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        closeOnOverlayClick={false}
        isOpen={activeModal === 'deleteList'}
        onClose={() => closeModal()}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            Are you sure you want to delete this task list and all its tasks?
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              onClick={handleDeleteList}
              isLoading={isDeleting}
              loadingText="Deleting..."
              mr={3}
            >
              Delete
            </Button>
            <Button onClick={() => closeModal()}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        closeOnOverlayClick={false}
        isOpen={activeModal === 'leaveList'}
        onClose={() => closeModal()}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Leave</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            Are you sure you want to leave this task list?
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              onClick={handleLeaveTaskList}
              isLoading={isDeleting}
              loadingText="Deleting..."
              mr={3}
            >
              Leave
            </Button>
            <Button onClick={() => closeModal()}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AssignToGroupMembers
        isOpen={activeModal === 'assignMembers'}
        onClose={() => closeModal()}
        members={members}
        isLoading={isLoadingMembers}
        currentGroupID={currentGroup?.Group_ID}
        selectedTaskList={currentTaskList}
        refreshMembers={fetchGroupMembers}
      />
    </>
  );
};

export default TaskDetailsModal;