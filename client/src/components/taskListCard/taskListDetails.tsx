import { TaskList } from "./types";
import { useContext } from "react";
import { UserContext } from "../../../context/userContext";
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
} from "@chakra-ui/react";
import { faPlus, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
          <Flex justify="space-between" align="center" width="100%">
            {selectedTaskList?.User_ID == user?.id && (
              <Flex gap={2}>
                <Tooltip label="Add tasks" placement="top" hasArrow>
                  <Button onClick={onOpenAdd}>
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                </Tooltip>
                <Tooltip label="Invite people to list" placement="top" hasArrow>
                  <Button onClick={onOpenShare}>
                    <FontAwesomeIcon icon={faUserPlus} />
                  </Button>
                </Tooltip>
              </Flex>
            )}
            <Button onClick={onClose}>Close</Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TaskDetailsModal;
