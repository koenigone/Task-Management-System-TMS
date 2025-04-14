import HeaderComponent from "./headerComponent";
import CreateTaskList from "../createList";
import FilterDashboardTasks from "../filterDashboardTasks";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderComponentsProps { // props for the dashboard header components
  onFilterChange: (filter: "all" | "leader" | "helper") => void; // on filter change
  currentFilter: "all" | "leader" | "helper";                    // current filter
}

const DashboardHeaderComponents = ({ onFilterChange, currentFilter }: DashboardHeaderComponentsProps) => { // dashboard header components
  const navigate = useNavigate();

  const handleFilterChange = (filter: "all" | "leader" | "helper") => {
    navigate(`/?filter=${filter}`, { replace: true });  // Update URL with filter parameter
    onFilterChange(filter);                             // Notify parent component
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
    />
  );
};

export default DashboardHeaderComponents;