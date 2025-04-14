import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Center,
  Button,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

/* add task modal structure:
  - get the is open, on close, create task data, handle input change, and handle submit
  - show the modal with the form
  - handle the date change
  - handle the form submit
  - return the modal
*/
interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  listID: number;
  onSuccess?: () => void;
}

const AddTaskModal = ({
  isOpen,
  onClose,
  listID,
  onSuccess,
}: AddTaskModalProps) => {
  const [taskData, setTaskData] = useState({
    taskDesc: "",
    taskPriority: 1,
    taskDueDate: "",
  });
  const [dateError, setDateError] = useState<string | null>(null);
  const today = new Date().toISOString().split('T')[0];
  const maxDate = "2099-12-31";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTaskData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setDateError(null);
    
    if (value) {
      const selectedDate = new Date(value);
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      
      if (isNaN(selectedDate.getTime())) {
        setDateError("Please enter a valid date");
      } 
      else if (selectedDate < todayDate) {
        setDateError("Due date cannot be in the past");
      }
      else if (selectedDate.getFullYear() > 2099) {
        setDateError("Due date cannot be beyond 2099");
      }
    }
    
    handleInputChange(e);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskData.taskDesc) {
      toast.error("Task description is required");
      return;
    }

    if (taskData.taskDueDate) {
      const selectedDate = new Date(taskData.taskDueDate);
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      
      if (isNaN(selectedDate.getTime())) {
        setDateError("Please enter a valid date");
        return;
      }
      
      if (selectedDate < todayDate) {
        setDateError("Due date cannot be in the past");
        return;
      }
      
      if (selectedDate.getFullYear() > 2099) {
        setDateError("Due date cannot be beyond 2099");
        return;
      }
    }

    try {
      const { data } = await axios.post("http://localhost:3000/createTask",
        {
          listID,
          taskDesc: taskData.taskDesc,
          taskPriority: taskData.taskPriority,
          taskDueDate: taskData.taskDueDate || null,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (data.errMessage) {
        toast.error(data.errMessage);
        return;
      }

      toast.success("Task created successfully");
      setTaskData({
        taskDesc: "",
        taskPriority: 1,
        taskDueDate: "",
      });
      onClose();
      onSuccess?.();
    } catch (error) {
      toast.error("Error creating task");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Task</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Task Description</FormLabel>
                <Input
                  bg="#E3E3E3"
                  type="text"
                  name="taskDesc"
                  color="black"
                  placeholder="Enter task description"
                  value={taskData.taskDesc}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Priority</FormLabel>
                <Select
                  bg="#E3E3E3"
                  name="taskPriority"
                  value={taskData.taskPriority}
                  onChange={handleInputChange}
                >
                  <option value={1}>Low</option>
                  <option value={2}>Medium</option>
                  <option value={3}>High</option>
                </Select>
              </FormControl>

              <FormControl isInvalid={!!dateError}>
                <FormLabel>Due Date</FormLabel>
                <Input
                  bg="#E3E3E3"
                  type="date"
                  name="taskDueDate"
                  min={today}
                  max={maxDate}
                  value={taskData.taskDueDate}
                  onChange={handleDateChange}
                />
                <FormErrorMessage>{dateError}</FormErrorMessage>
              </FormControl>

              <Center>
                <Button type="submit" colorScheme="teal">
                  Add Task
                </Button>
              </Center>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddTaskModal;