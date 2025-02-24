import './taskListCard.css';
import axios from 'axios';
import { Box, Checkbox, Flex, Icon, Text, Badge, HStack, useMediaQuery } from "@chakra-ui/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faCrown, faList } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

interface TaskList {
  List_ID: number;
  ListName: string;
  DueDate: string;
  CreatedDate: string;
}

const TaskListCard = () => {
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [isMobile] = useMediaQuery("(max-width: 768px)");  // mobile

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
  
  return (
    <Flex wrap="wrap" gap={4}>
      {taskLists.map((taskList) => (
        <Box
          key={taskList.List_ID}
          bg="white"
          p={4}
          rounded="lg"
          boxShadow="md"
          width={isMobile ? "100%": "250px"}
          border="1px solid #e2e8f0"
        >
          <Text fontWeight="bold" mb={2}>{taskList.ListName}</Text>

          <Box mb={3}>
            <Checkbox colorScheme="green">Sample Task 1</Checkbox>
            <Checkbox colorScheme="green" isChecked mt={2}>Sample Task 2</Checkbox>
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
    </Flex>
  );

}

export default TaskListCard;