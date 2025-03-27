import { useState, useContext } from "react";
import { UserContext } from "../../context/userContext";
import { GroupContext } from "../../context/groupContext";
import { Box, HStack, List, ListItem, Text, Tooltip } from "@chakra-ui/react";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import toast from "react-hot-toast";
import InviteToGroupModal from "./inviteToGroupModal";
import GroupMembersModal from "./groupMembersModal";

const GroupMembers = () => {
  const { currentGroup } = useContext(GroupContext);
  const { user } = useContext(UserContext);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  const [inviteData, setInviteData] = useState({
    userEmail: "",
  });

  const onInviteClose = () => setIsInviteOpen(false);
  const onInviteOpen = () => setIsInviteOpen(true);
  const onMembersClose = () => setIsMembersOpen(false);
  const onMembersOpen = async () => {
    setIsMembersOpen(true);
    await fetchGroupMembers();
  };

  const fetchGroupMembers = async () => {
    if (!currentGroup?.Group_ID) return;
    
    setIsLoadingMembers(true);
    try {
      const { data } = await axios.get(
        "http://localhost:3000/getGroupMembers",
        {
          params: { groupID: currentGroup.Group_ID },
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
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
    setInviteData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteData.userEmail) {
      toast.error("Please enter an email address");
      return;
    }

    try {
      const { data } = await axios.post("http://localhost:3000/inviteByEmail", {
        groupID: currentGroup?.Group_ID,
        userEmail: inviteData.userEmail
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
      console.error(err);
    }
  };

  if (currentGroup?.User_ID !== user?.id) return null;

  return (
    <Box bg="#D9D9D9" color="gray.700" p={2} fontWeight="bold" borderRadius="md" w={320}>
      <List display="flex" justifyContent="space-around" alignItems="center">
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
          <Tooltip label="Manage members" hasArrow>
            <FontAwesomeIcon icon={faUserGroup} fontSize={20} />
          </Tooltip>
        </ListItem>
      </List>

      <InviteToGroupModal
        isOpen={isInviteOpen}
        onClose={onInviteClose}
        inviteData={inviteData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        title={`Invite to Group: ${currentGroup?.GroupName || ''}`}
      />

      <GroupMembersModal
        isOpen={isMembersOpen}
        onClose={onMembersClose}
        members={members}
        isLoading={isLoadingMembers}
        currentGroupID={currentGroup?.Group_ID}
        refreshMembers={fetchGroupMembers}
      />
    </Box>
  );
};

export default GroupMembers;