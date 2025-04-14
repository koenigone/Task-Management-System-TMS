import HeaderComponent from "./headerComponent";
import CreateGroup from "../createGroup";
import FilterActiveGroups from "../filterActiveGroups";
import { useNavigate } from "react-router-dom";

/* my groups header components structure:
  - get the on filter change and the current filter
  - handle the filter change
  - show the create group and the filter active groups
*/
interface MyGroupsHeaderComponentsProps { // props for the my groups header components
  onFilterChange: (filter: "all" | "active" | "inactive") => void; // on filter change
  currentFilter: "all" | "active" | "inactive";                    // current filter
}

const MyGroupsHeaderComponents = ({ 
  onFilterChange, 
  currentFilter 
}: MyGroupsHeaderComponentsProps) => { // my groups header components
  const navigate = useNavigate();

  const handleFilterChange = (filter: "all" | "active" | "inactive") => { // handle the filter change
    navigate(`/MyGroups?filter=${filter}`, { replace: true });            // navigate to the my groups page with the filter
    onFilterChange(filter);                                               // notify the parent component
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
    />
  );
};

export default MyGroupsHeaderComponents;