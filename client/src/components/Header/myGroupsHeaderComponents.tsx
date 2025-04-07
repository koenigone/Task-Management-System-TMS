import HeaderComponent from "./headerComponent";
import CreateGroup from "../createGroup";
import FilterActiveGroups from "../filterActiveGroups";
import { useNavigate } from "react-router-dom";

interface MyGroupsHeaderComponentsProps {
  onFilterChange: (filter: "all" | "active" | "inactive") => void;
  currentFilter: "all" | "active" | "inactive";
}

const MyGroupsHeaderComponents = ({ 
  onFilterChange, 
  currentFilter 
}: MyGroupsHeaderComponentsProps) => {
  const navigate = useNavigate();

  const handleFilterChange = (filter: "all" | "active" | "inactive") => {
    // Update URL with filter parameter
    navigate(`/MyGroups?filter=${filter}`, { replace: true });
    // Notify parent component
    onFilterChange(filter);
  };

  return (
    <HeaderComponent
      headerComponent={<CreateGroup />}
      headerComponentExtra={
        <FilterActiveGroups 
          onFilterChange={handleFilterChange} 
          currentFilter={currentFilter}
        />
      }
      modalTitle="Manage My Groups"
    />
  );
};

export default MyGroupsHeaderComponents;