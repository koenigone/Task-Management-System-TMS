import { useContext } from "react";
import { UserContext } from "../../../context/userContext";
import {
  Box,
  Text,
  Badge,
  HStack,
  Progress,
  Checkbox,
  Tooltip,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faList, faUsers } from "@fortawesome/free-solid-svg-icons";
import { TaskList } from "./types";

interface TaskCardProps {
  taskList: TaskList;
  isMobile: boolean;
  onOpenBox: (taskList: TaskList) => void;
}

const TaskListCard = ({ taskList, isMobile, onOpenBox }: TaskCardProps) => {
  const { user } = useContext(UserContext);
  return (
    <Box
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

        <Box mb={3} display="block">
          {taskList.tasks && taskList.tasks.length > 0 ? (
            taskList.tasks.slice(0, 3).map((task) => (
              <Checkbox key={task.Task_ID} colorScheme="green" mt={2}>
                <Tooltip label={task.Task_Desc} placement="top" hasArrow>
                  <Text noOfLines={1} maxWidth="90%">
                    {task.Task_Desc.substring(0, 50)}...
                  </Text>
                </Tooltip>
              </Checkbox>
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
          <Badge colorScheme="gray" borderRadius="full" p={1} px={4}>
            <FontAwesomeIcon icon={faCrown} />
            {user?.id == taskList.User_ID ? "Leader" : "TBD"}
          </Badge>

          <Badge colorScheme="green" borderRadius="full" p={1} px={4}>
            <FontAwesomeIcon icon={faList} /> {taskList.tasks?.length}
          </Badge>

          <Badge colorScheme="pink" borderRadius="full" p={1} px={4}>
            <FontAwesomeIcon icon={faUsers} />6
          </Badge>
        </HStack>

        <Progress value={50} size="sm" colorScheme="teal" />
      </Box>
    </Box>
  );
};

export default TaskListCard;