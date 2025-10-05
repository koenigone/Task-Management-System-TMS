import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

interface DeleteGroupModalProps { // props for the delete group modal
  isOpen: boolean;
  onClose: () => void;
  onDeleteSuccess: (deletedGroupID: number) => void;
  groupId: number;
  groupName: string;
}

/* DeleteGroupModal structure:
  - get the isOpen, onClose, onDeleteSuccess, groupId, and groupName
  - return the DeleteGroupModal
*/
const DeleteGroupModal: React.FC<DeleteGroupModalProps> = ({ 
  isOpen, 
  onClose,
  onDeleteSuccess,
  groupId,
  groupName
}) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteGroup = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await axios.post("/api/deleteGroup", { groupID: groupId });

      if (response.data.message) {
        toast.success(response.data.message);
        onDeleteSuccess(groupId);
        onClose();
        navigate("/myGroups");
      }
    } catch (error) {
      toast.error("Delete group error");
      setError("Failed to delete group");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Group</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={4}>
            Are you sure you want to permanently delete the group "
            <strong>{groupName}</strong>" and all its contents?
          </Text>
          {error && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              {error}
            </Alert>
          )}
        </ModalBody>
        <ModalFooter>
          <Button 
            variant="ghost" 
            onClick={onClose}
            isDisabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            colorScheme="red"
            ml={3}
            onClick={handleDeleteGroup}
            isLoading={isDeleting}
            loadingText="Deleting..."
          >
            Delete Group
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteGroupModal;