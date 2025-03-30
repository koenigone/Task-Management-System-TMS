import HeaderComponent from "./headerComponent";
import CreateTaskList from "../createList";

const DashboardHeaderComponents = () => {
  return (
    <HeaderComponent
      headerComponent={<CreateTaskList />}
      headerComponentExtra={null}
      modalTitle="Manage Dashboard"
    />
  );
};

export default DashboardHeaderComponents;