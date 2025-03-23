import HeaderComponent from "./headerComponent";
import CreateTaskList from "../createList";
import FilterTaskLists from "../filterLists";

const GroupDetailsHeaderComponents = () => {
  return (
    <HeaderComponent
      leftComponent={<CreateTaskList />}
      rightComponent={<FilterTaskLists />}
      modalTitle="Manage Dashboard"
    />
  );
};

export default GroupDetailsHeaderComponents;