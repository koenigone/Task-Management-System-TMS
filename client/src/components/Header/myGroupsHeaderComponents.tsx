import HeaderComponent from "./headerComponent";
import CreateGroup from "../createGroup";
import FilterActiveGroups from "../filterActiveGroups";

const MyGroupsHeaderComponents = () => {
  return (
    <HeaderComponent
      headerComponent={<CreateGroup />}
      headerComponentExtra={<FilterActiveGroups />}
      modalTitle="Manage My Groups"
    />
  );
};

export default MyGroupsHeaderComponents;