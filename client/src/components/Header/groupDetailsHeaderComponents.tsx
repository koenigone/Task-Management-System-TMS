import HeaderComponent from "./headerComponent";
import CreateTaskList from "../createList";
import GroupMembers from "../groupMembers";

const GroupDetailsHeaderComponents = () => {
  return (
    <HeaderComponent
      headerComponent={<CreateTaskList />}
      headerComponentExtra={<GroupMembers />}
      modalTitle="Manage Dashboard"
    />
  );
};

export default GroupDetailsHeaderComponents;