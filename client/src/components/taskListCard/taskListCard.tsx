import "./taskListCard.css";
import axios from "axios";
import {
  Box,
  Checkbox,
  Flex,
  Text,
  Badge,
  HStack,
  useMediaQuery,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Center,
  Select,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faCrown,
  faList,
  faPlus,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface TaskList {
  List_ID: number;
  ListName: string;
  DueDate: string;
  CreatedDate: string;
}

// interface Task {
//   ListDesc: string;
//   ListPriority: number;
//   ListDueDate: Date;
// }

const TaskListCard = () => {
  const navigate = useNavigate();
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [selectedTaskList, setSelectedTaskList] = useState<TaskList | null>(
    null
  );

  const [createTaskData, setCreateTaskData] = useState({
    taskDesc: "",
    taskPriority: 0,
    taskDueDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    // prevents the page from auto reload on submission
    e.preventDefault();
    const { taskDesc, taskPriority, taskDueDate } = createTaskData;

    try {
      const { data } = await axios.post("/createTaskList", { taskDesc, taskPriority, taskDueDate });
      if (data.errMessage) {
        toast.error(data.errMessage);
      } else {
        setCreateTaskData({
          // reset fields if no error
          taskDesc: "",
          taskPriority: 0,
          taskDueDate: "",
        });
        toast.success("Task added successfully");
        navigate("/"); // navigate to login upon successfull sign up
      }
    } catch (err) {
      console.error("Adding task error:", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateTaskData({
      ...createTaskData,
      [name]: value,
    });
  };

  // const [tasks, setTasks] = useState<Task[]>([]);
  // const [selectedTask, setSelectedTask] = useState<Task | null>(
  //   null
  // );

  const [isOpenBox, setIsOpenBox] = useState(false);
  const [isOpenAdd, setIsOpenAdd] = useState(false);

  const onOpenBox = (taskList: TaskList) => {
    setSelectedTaskList(taskList); // Set the selected task list
    setIsOpenBox(true);
  };
  const onCloseBox = () => setIsOpenBox(false);

  const onOpenAdd = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event propagation
    setIsOpenAdd(true);
  };
  const onCloseAdd = () => setIsOpenAdd(false);

  const [isMobile] = useMediaQuery("(max-width: 768px)"); // mobile

  useEffect(() => {
    const fetchTaskLists = async () => {
      try {
        const response = await axios.get("http://localhost:3000/getTaskList", {
          withCredentials: true, // Ensures cookies (JWT) are sent
        });
        setTaskLists(response.data.taskLists);
      } catch (error) {
        console.error("Error fetching task lists:", error);
      }
    };

    fetchTaskLists();
  }, []);

  const priorityIcons = [
    { key: 1, icon: faCircle, color: "#3bac3b", title: "low" },
    { key: 2, icon: faCircle, color: "#e9a528", title: "normal" },
    { key: 3, icon: faCircle, color: "#a02323", title: "high" },
  ];

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
          onClick={() => onOpenBox(taskList)} // Pass the taskList when opening the box modal
        >
          <Text
            fontWeight="bold"
            display="flex"
            justifyContent="space-between"
            mb={2}
          >
            {taskList.ListName}
            <Button onClick={(e) => onOpenAdd(e)}>
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </Text>

          <Box mb={3}>
            <Checkbox colorScheme="green">Sample Task 1</Checkbox>
            <Checkbox colorScheme="green" isChecked mt={2}>
              Sample Task 2
            </Checkbox>
          </Box>

          <HStack spacing={3} flexWrap="wrap">
            <Flex align="center" gap={1}>
              <FontAwesomeIcon icon={faUsers} />
              <Text fontSize="sm">6</Text>
            </Flex>

            <Flex align="center" gap={1}>
              <FontAwesomeIcon icon={faList} />
              <Text fontSize="sm">14</Text>
            </Flex>

            <Badge colorScheme="gray" borderRadius="full" px={2}>
              <FontAwesomeIcon icon={faCrown} /> Leader
            </Badge>
          </HStack>

          <HStack mt={3} spacing={3}>
            <Badge colorScheme="red" px={2} borderRadius="full">
              Due {taskList.DueDate}
            </Badge>
            <Badge colorScheme="blue" px={2} borderRadius="full">
              Progress 70%
            </Badge>
          </HStack>
        </Box>
      ))}

      {/* Box Modal (Task Details) */}
      <Modal onClose={onCloseBox} isOpen={isOpenBox} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="black">{selectedTaskList?.ListName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Due Date: {selectedTaskList?.DueDate}</Text>
            <Text>Created Date: {selectedTaskList?.CreatedDate}</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onCloseBox}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Modal */}
      <Modal onClose={onCloseAdd} isOpen={isOpenAdd} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Task Description</FormLabel>
                  <Input
                    bg="#E3E3E3"
                    type="text"
                    name="teskDescription"
                    placeholder="'change the background image'"
                    value={createTaskData.taskDesc}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>
                    <HStack align="center">
                      <FormLabel marginBottom="0">Priority</FormLabel>
                      {priorityIcons.map((icon) => (
                        <FontAwesomeIcon
                          key={icon.key}
                          icon={icon.icon}
                          color={icon.color}
                          title={icon.title}
                        />
                      ))}
                    </HStack>
                  </FormLabel>
                  <Select
                    name="taskPriority"
                    value={createTaskData.taskPriority}
                    // onChange={handleInputChange}
                  >
                    <option value={1}>Low</option>
                    <option value={2}>Normal</option>
                    <option value={3}>High</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Due date</FormLabel>
                  <Input
                    bg="#E3E3E3"
                    type="date"
                    name="taskDueDate"
                    color="black"
                    value={createTaskData.taskDueDate}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <Center>
                  <Button
                    className="submit-btn"
                    type="submit"
                    color="white"
                    fontWeight="bold"
                    bg="#1B686A"
                    border="none"
                    p="10px 12px"
                    borderRadius="8px"
                    _hover={{ bg: "#166060" }}
                  >
                    Create List
                  </Button>
                </Center>
              </VStack>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onCloseAdd}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default TaskListCard;