import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/userContext";
import { GroupContext } from "../../context/groupContext";
import {
  Box,
  HStack,
  List,
  ListItem,
  Switch,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import toast from "react-hot-toast";
import InviteToGroupModal from "./inviteToGroupModal";
import GroupMembersModal from "./groupMembersModal";
import DeleteGroupModal from "./deleteGroupModal";

const GROUP_UPDATED_EVENT = 'groupUpdated'; // create a custom event for group updates

/* GroupSettings structure:
  - get the currentGroup and user
  - return the GroupSettings
*/
const GroupSettings = () => {
  const { currentGroup } = useContext(GroupContext);
  const { user } = useContext(UserContext);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [isDeleteGroupOpen, setIsDeleteGroupOpen] = useState(false);
  const [inviteData, setInviteData] = useState({ userEmail: "" });
  const [isGroupActive, setIsGroupActive] = useState(
    currentGroup?.IsActive ?? true
  );

  const onInviteClose = () => setIsInviteOpen(false);
  const onInviteOpen = () => setIsInviteOpen(true);
  const onMembersClose = () => setIsMembersOpen(false);
  const onDeleteGroupOpen = () => setIsDeleteGroupOpen(true);
  const onDeleteGroupClose = () => setIsDeleteGroupOpen(false);
  const onMembersOpen = async () => {
    setIsMembersOpen(true);
    await fetchGroupMembers();
  };

  const fetchGroupMembers = async () => {
    if (!currentGroup?.Group_ID) return;

    setIsLoadingMembers(true);
    try {
      const { data } = await axios.get("/getGroupMembers",
        {
          params: { groupID: currentGroup.Group_ID },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMembers(data.members || []);
    } catch (err) {
      toast.error("Failed to fetch members");
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInviteData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inviteData.userEmail) {
      toast.error("Please enter an email address");
      return;
    }

    try {
      const { data } = await axios.post("/inviteByEmail", {
        groupID: currentGroup?.Group_ID,
        userEmail: inviteData.userEmail,
      });

      if (data.errMessage) {
        toast.error(data.errMessage);
      } else {
        setInviteData({ userEmail: "" });
        toast.success(`Invite sent to ${inviteData.userEmail}`);
        onInviteClose();
      }
    } catch (err) {
      toast.error("Failed to send invite");
    }
  };

  const handleGroupDeleteSuccess = (deletedGroupID: number) => { // handle the group delete success
    if (currentGroup?.Group_ID === deletedGroupID) {
      window.dispatchEvent(new Event(GROUP_UPDATED_EVENT));
      onDeleteGroupClose();
    }
  };

  useEffect(() => { // update the group state
    if (currentGroup) {
      setIsGroupActive(currentGroup.IsActive);
    }
  }, [currentGroup]);

  const handleToggleGroupActive = async () => {
    try {
      const newState = !isGroupActive;
  
      await axios.post("/changeGroupState",
        {
          groupID: currentGroup?.Group_ID,
          newState,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      setIsGroupActive(newState);                                        // update the group state
      window.dispatchEvent(new Event(GROUP_UPDATED_EVENT));              // dispatch event to update groups
      toast.success(`Group is now ${newState ? "Active" : "Inactive"}`); // toast success message
    } catch (error) {
      toast.error("Failed to change group state");
    }
  };  

  // if the current group is not the user's group, return null
  if (currentGroup?.User_ID !== user?.id) return null;

  return (
    <Box
      key={currentGroup?.Group_ID}
      bg="#D9D9D9"
      color="gray.700"
      p={2}
      fontWeight="bold"
      borderRadius="md"
      w={520}
    >
      <List display="flex" justifyContent="space-around" alignItems="center">
        <ListItem cursor="pointer" onClick={handleToggleGroupActive}>
          <HStack spacing={4}>
            <Text>{isGroupActive ? "Active" : "Inactive"}</Text>
            <Switch size="md" isChecked={isGroupActive} readOnly />
          </HStack>
        </ListItem>

        <ListItem cursor="pointer" onClick={onDeleteGroupOpen}>
          <HStack>
            <Text color="red.600">Delete Group</Text>
          </HStack>
        </ListItem>

        <ListItem cursor="pointer" onClick={onInviteOpen}>
          <HStack>
            <Text>Invite Members</Text>
          </HStack>
        </ListItem>

        <ListItem cursor="pointer" onClick={onMembersOpen}>
          <HStack>
            <Text>Members</Text>
          </HStack>
        </ListItem>

        <ListItem mt={1}>
          <Tooltip label="Manage Group" hasArrow>
            <FontAwesomeIcon icon={faGear} fontSize={20} />
          </Tooltip>
        </ListItem>
      </List>

      <InviteToGroupModal
        isOpen={isInviteOpen}
        onClose={onInviteClose}
        inviteData={inviteData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        title={`Invite to Group: ${currentGroup?.GroupName || ""}`}
      />

      <GroupMembersModal
        isOpen={isMembersOpen}
        onClose={onMembersClose}
        members={members}
        isLoading={isLoadingMembers}
        currentGroupID={currentGroup?.Group_ID}
        refreshMembers={fetchGroupMembers}
      />

      <DeleteGroupModal
        isOpen={isDeleteGroupOpen}
        onClose={onDeleteGroupClose}
        onDeleteSuccess={handleGroupDeleteSuccess}
        groupId={currentGroup?.Group_ID || 0}
        groupName={currentGroup?.GroupName || ""}
      />
    </Box>
  );
};

export default GroupSettings;