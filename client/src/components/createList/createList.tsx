import "./createList.css";
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
} from "@chakra-ui/react";
import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { GroupContext } from "../../../context/groupContext";

const CreateTaskList = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [createListData, setCreateListData] = useState({
    listName: "",
    listDueDate: "",
  });

  const { currentGroup } = useContext(GroupContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { listName, listDueDate } = createListData;

    try {
      const { data } = await axios.post("/createTaskList", {
        listName,
        listDueDate,
        groupID: currentGroup ? currentGroup.Group_ID : null, // Include groupID if it exists
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
    <>
      <ul className="create-tasklist-container">
        <li>
          <span onClick={onOpen} className="list-button">
            New List
          </span>
        </li>
        <li>
          <span className="list-button">New Task</span>
        </li>
        <li className="icon-container">
          <FontAwesomeIcon icon={faPlus} size="lg" />
        </li>
      </ul>

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
                    bg="#E3E3E3"
                    type="text"
                    name="listName"
                    color="black"
                    placeholder="list name"
                    value={createListData.listName}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Due date</FormLabel>
                  <Input
                    bg="#E3E3E3"
                    type="date"
                    name="listDueDate"
                    color="black"
                    value={createListData.listDueDate}
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
            <Button>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateTaskList;