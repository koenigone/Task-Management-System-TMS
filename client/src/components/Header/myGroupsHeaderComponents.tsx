import HeaderComponent from "./headerComponent";
import CreateGroup from "../createGroup";
import FilterMyGroups from "../filterMyGroups";

const MyGroupsHeaderComponents = () => {
  return (
    <HeaderComponent
      leftComponent={<CreateGroup />}
      rightComponent={<FilterMyGroups />}
      modalTitle="Manage My Groups"
    />
  );
};

export default MyGroupsHeaderComponents;