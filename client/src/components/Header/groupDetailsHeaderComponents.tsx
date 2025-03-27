import HeaderComponent from "./headerComponent";
import CreateTaskList from "../createList";
import FilterTaskLists from "../filterLists";
import GroupMembers from "../groupMembers";

const GroupDetailsHeaderComponents = () => {
  return (
    <HeaderComponent
      leftComponent={<CreateTaskList />}
      rightComponent={<FilterTaskLists />}
      leftComponentExtra={<GroupMembers />}
      modalTitle="Manage Dashboard"
    />
  );
};

export default GroupDetailsHeaderComponents;