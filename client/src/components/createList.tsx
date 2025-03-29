import { useState, useContext } from "react";
import { UserContext } from "../../context/userContext";
import { GroupContext } from "../../context/groupContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  VStack,
  Center,
  FormLabel,
  FormControl,
  Input,
  Box,
  List,
  ListItem,
  Tooltip,
} from "@chakra-ui/react";

const CreateTaskList = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [createListData, setCreateListData] = useState({
    listName: "",
    listDueDate: "",
  });

  const { user } = useContext(UserContext);
  const { currentGroup } = useContext(GroupContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { listName, listDueDate } = createListData;

    try {
      const { data } = await axios.post("/createTaskList", {
        listName,
        listDueDate,
        groupID: currentGroup ? currentGroup.Group_ID : null,
      });
      if (data.errMessage) {
        toast.error(data.errMessage);
      } else {
        setCreateListData({
          listName: "",
          listDueDate: "",
        });
        toast.success("List created successfully");
        navigate("/");
      }
    } catch (err) {
      console.error("List creation error:", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateListData({
      ...createListData,
      [name]: value,
    });
  };

  return (
    (!currentGroup || currentGroup?.User_ID === user?.id) && (
      <>
        <Box bg="#D9D9D9" color="gray.700" p={2} fontWeight="bold" borderRadius="md" w={140}>
          <List display="flex" justifyContent="space-around" alignItems="center">
            <ListItem cursor="pointer" onClick={onOpen}>
              New List
            </ListItem>
            <ListItem mt={1}>
              <Tooltip label="Add item" hasArrow>
                <FontAwesomeIcon icon={faPlus} fontSize={20} />
              </Tooltip>
            </ListItem>
          </List>
        </Box>
  
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create Task List</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>List name</FormLabel>
                    <Input
                      bg="gray.200"
                      type="text"
                      name="listName"
                      color="black"
                      placeholder="List name"
                      value={createListData.listName}
                      onChange={handleInputChange}
                    />
                  </FormControl>
  
                  <Center>
                    <Button
                      type="submit"
                      colorScheme="teal"
                      fontWeight="bold"
                      p="10px 12px"
                      borderRadius="md"
                    >
                      Create List
                    </Button>
                  </Center>
                </VStack>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  );  
};

export default CreateTaskList;