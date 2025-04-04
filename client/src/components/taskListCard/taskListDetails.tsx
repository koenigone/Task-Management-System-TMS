import { TaskList } from "../types";
import { useContext, useState } from "react";
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
  useDisclosure,
} from "@chakra-ui/react";
import { faCheck, faPlus, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import toast from "react-hot-toast";
import AssignToGroupMembers from "./assignMembersModal";

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTaskList: TaskList | null;
  onOpenAdd: (e: React.MouseEvent) => void;
  onOpenShare: (e: React.MouseEvent) => void;
}

const TaskDetailsModal = ({
  isOpen,
  onClose,
  selectedTaskList,
  onOpenAdd,
  onOpenShare,
}: TaskDetailsModalProps) => {
  const { user } = useContext(UserContext);
  const { currentGroup } = useContext(GroupContext);
  const [isTaskLoading, setIsTaskLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [members, setMembers] = useState([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  // Modal controls
  const {
    isOpen: isDeleteListOpen,
    onOpen: onDeleteListOpen,
    onClose: onDeleteListClose,
  } = useDisclosure();

  const {
    isOpen: isMembersOpen,
    onOpen: onMembersOpen,
    onClose: onMembersClose,
  } = useDisclosure();

  const handleMarkAsComplete = async (taskID: number) => {
    setIsTaskLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/markTaskAsComplete",
        { taskID }
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Failed to update task status");
    } finally {
      setIsTaskLoading(false);
    }
  };

  const handleDeleteList = async () => {
    if (!selectedTaskList) return;

    setIsDeleting(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/deleteTaskList",
        { listID: selectedTaskList.List_ID }
      );
      toast.success(response.data.message);
      onClose();
      onDeleteListClose();
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

  const handleOpenShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedTaskList?.Group_ID) {
      fetchGroupMembers();
      onMembersOpen();
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
            <Text color="gray.600">{selectedTaskList?.ListName}</Text>
            <ModalCloseButton size="lg" />
          </ModalHeader>
          <ModalBody p={6}>
            <Text color="gray.600" fontSize="sm" mb={6}>
              Created {formatDate(selectedTaskList?.CreatedDate)}
            </Text>

            <Box maxH="400px" overflowY="auto" pr={2}>
              {selectedTaskList?.tasks && selectedTaskList.tasks.length > 0 ? (
                <VStack spacing={4} align="stretch">
                  {selectedTaskList.tasks.map((task) => (
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
                            {formatDate(task.Task_DueDate)}
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
              {selectedTaskList?.User_ID === user?.id && (
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
                    {selectedTaskList?.Group_ID ? (
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
                {selectedTaskList?.User_ID === user?.id && (
                  <Button onClick={onDeleteListOpen} background="red.300">
                    Delete List
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
        isOpen={isDeleteListOpen}
        onClose={onDeleteListClose}
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
            <Button onClick={onDeleteListClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AssignToGroupMembers
        isOpen={isMembersOpen}
        onClose={onMembersClose}
        members={members}
        isLoading={isLoadingMembers}
        currentGroupID={currentGroup?.Group_ID}
        selectedTaskList={selectedTaskList}
        refreshMembers={fetchGroupMembers}
      />
    </>
  );
};

export default TaskDetailsModal;
