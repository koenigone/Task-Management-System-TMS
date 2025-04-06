import HeaderComponent from "./headerComponent";
import CreateTaskList from "../createList";
import FilterDashboardTasks from "../filterDashboardTasks";

const DashboardHeaderComponents = () => {
  return (
    <HeaderComponent
      headerComponent={<CreateTaskList />}
      headerComponentExtra={<FilterDashboardTasks />}
      modalTitle="Manage Dashboard"
    />
  );
};

export default DashboardHeaderComponents;