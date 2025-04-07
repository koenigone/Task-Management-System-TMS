import HeaderComponent from "./headerComponent";
import CreateTaskList from "../createList";
import FilterDashboardTasks from "../filterDashboardTasks";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderComponentsProps {
  onFilterChange: (filter: "all" | "leader" | "helper") => void;
  currentFilter: "all" | "leader" | "helper";
}

const DashboardHeaderComponents = ({ onFilterChange, currentFilter }: DashboardHeaderComponentsProps) => {
  const navigate = useNavigate();

  const handleFilterChange = (filter: "all" | "leader" | "helper") => {
    // Update URL with filter parameter
    navigate(`/?filter=${filter}`, { replace: true });
    // Notify parent component
    onFilterChange(filter);
  };

  return (
    <HeaderComponent
      headerComponent={<CreateTaskList />}
      headerComponentExtra={
        <FilterDashboardTasks 
          onFilterChange={handleFilterChange}
          currentFilter={currentFilter}
        />
      }
      modalTitle="Manage Dashboard"
    />
  );
};

export default DashboardHeaderComponents;