import HeaderComponent from "./headerComponent";
import CreateTaskList from "../createList";
import FilterTaskLists from "../filterLists";

const DashboardHeaderComponents = () => {
  return (
    <HeaderComponent
      leftComponent={<CreateTaskList />}
      rightComponent={<FilterTaskLists />}
      modalTitle="Manage Dashboard"
    />
  );
};

export default DashboardHeaderComponents;