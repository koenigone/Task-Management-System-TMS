import HeaderComponent from "./headerComponent";
import CreateTaskList from "../createList";
import GroupSettings from "../groupSettings";

const GroupDetailsHeaderComponents = () => {
  return (
    <HeaderComponent
      headerComponent={<CreateTaskList />}
      headerComponentExtra={<GroupSettings />}
      modalTitle="Manage Dashboard"
    />
  );
};

export default GroupDetailsHeaderComponents;