import "./myGroups.css";
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

const CreateGroupList = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentGroup } = useContext(GroupContext); // Access the current group from context
  const [createGroupListData, setCreateGroupListData] = useState({
    listName: "", // Ensure the state property matches the input name
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { listName } = createGroupListData;

    // Check if a group is selected
    if (!currentGroup) {
      toast.error("No group selected");
      return;
    }

    try {
      const { data } = await axios.post("/createTaskList", {
        listName,
        groupID: currentGroup.Group_ID, // Include the group ID in the payload
      });

      if (data.errMessage) {
        toast.error(data.errMessage);
      } else {
        setCreateGroupListData({
          listName: "", // Reset the input field
        });
        toast.success("List created successfully");
        onClose(); // Close the modal after successful creation
        // Optionally, refresh the page or navigate to the group's page
        navigate(`/MyGroups/${currentGroup.GroupName}`);
      }
    } catch (err) {
      console.error("Group list creation error:", err);
      toast.error("Failed to create list");
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
            Invite People
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
                    name="listName" // Ensure this matches the state property
                    color="black"
                    placeholder="List name"
                    value={createGroupListData.listName}
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
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateGroupList;