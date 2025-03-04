import "./createGroup.css";
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

const AddGroup = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [createGroupData, setCreateGroupData] = useState({
    groupName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    // prevents the page from auto reload on submission
    e.preventDefault();
    const { groupName } = createGroupData;

    try {
      const { data } = await axios.post("/createGroup", { groupName });
      if (data.errMessage) {
        toast.error(data.errMessage);
      } else {
        setCreateGroupData({
          // reset fields if no error
          groupName: "",
        });
        toast.success("Group created successfully");
        navigate("/"); // navigate to login upon successfull sign up
      }
    } catch (err) {
      console.error("Group creation error:", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateGroupData({
      ...createGroupData,
      [name]: value,
    });
  };

  return (
    <>
      <ul className="create-group-container">
        <li>
          <span onClick={onOpen} className="group-button">
            Create Group
          </span>
        </li>

        <li className="icon-container">
          <FontAwesomeIcon icon={faPlus} size="lg" />
        </li>
      </ul>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">

                <FormControl>
                  <FormLabel>Group Name</FormLabel>
                  <Input
                    bg="#E3E3E3"
                    type="text"
                    name="groupName"
                    color="black"
                    placeholder="list name"
                    value={createGroupData.groupName}
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
                    Create Group
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

export default AddGroup;