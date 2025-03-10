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
} from "@chakra-ui/react";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  createTaskData: {
    listID: string | number;
    taskDesc: string;
    taskPriority: number;
    taskDueDate: string;
  };
  handleInputChange: (e: React.ChangeEvent<any>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const AddTaskModal = ({
  isOpen,
  onClose,
  createTaskData,
  handleInputChange,
  handleSubmit,
}: AddTaskModalProps) => {
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add</ModalHeader>
        <ModalCloseButton />
        <ModalBody key={createTaskData.listID}>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Task Description</FormLabel>
                <Input
                  bg="#E3E3E3"
                  type="text"
                  name="taskDesc"
                  color="black"
                  placeholder="Enter task description"
                  value={createTaskData.taskDesc}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Priority</FormLabel>
                <Select
                  name="taskPriority"
                  value={createTaskData.taskPriority}
                  onChange={handleInputChange}
                >
                  <option value={1}>Low</option>
                  <option value={2}>Normal</option>
                  <option value={3}>High</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Due Date</FormLabel>
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