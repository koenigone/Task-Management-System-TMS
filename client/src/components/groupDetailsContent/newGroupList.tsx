import "./groupDetailsContent.css";
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
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateGroupList = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [createGroupListData, setCreateGroupListData] = useState({
    groupListName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    // prevents the page from auto reload on submission
    e.preventDefault();
    const { groupListName } = createGroupListData;

    try {
      const { data } = await axios.post("/createTaskList", { groupListName });
      if (data.errMessage) {
        toast.error(data.errMessage);
      } else {
        setCreateGroupListData({
          // reset fields if no error
          groupListName: "",
        });
        toast.success("List created successfully");
        navigate("/"); // navigate to login upon successfull sign up
      }
    } catch (err) {
      console.error("Group list creation error:", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateGroupListData({
      ...createGroupListData,
      [name]: value,
    });
  };

  return (
    <>
      <ul className="create-tasklist-container">
        <li>
          <span onClick={onOpen} className="list-button">
            Members
          </span>
        </li>
        <li>
          <span onClick={onOpen} className="list-button">
            Invite Poeple
          </span>
        </li>
        <li>
          <span onClick={onOpen} className="list-button">
            New List
          </span>
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
                    name="groupListName"
                    color="black"
                    placeholder="list name"
                    value={createGroupListData.groupListName}
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

export default CreateGroupList;
