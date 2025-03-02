import { TaskList } from "./types";
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
} from "@chakra-ui/react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTaskList: TaskList | null;
  onOpenAdd: (e: React.MouseEvent) => void;
}

const TaskDetailsModal = ({
  isOpen,
  onClose,
  selectedTaskList,
  onOpenAdd,
}: TaskDetailsModalProps) => {
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          color="black"
          display="flex"
          justifyContent="space-between"
          m={5}
        >
          {selectedTaskList?.ListName}{" "}
          <Button onClick={onOpenAdd}>
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Due Date: {selectedTaskList?.DueDate}</Text>
          <Text>Created Date: {selectedTaskList?.CreatedDate}</Text>

          <VStack spacing={4} align="stretch" mt={4}>
            {selectedTaskList?.tasks?.map((task) => (
              <Box key={task.Task_ID} p={4} borderWidth="1px" borderRadius="lg">
                <Text fontWeight="bold">{task.Task_Desc}</Text>
                <Text>Priority: {task.Task_Priority}</Text>
                <Text>Due Date: {task.Task_DueDate}</Text>
                <Text>
                  Status: {task.Task_Status === 0 ? "Pending" : "Completed"}
                </Text>
              </Box>
            ))}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TaskDetailsModal;
