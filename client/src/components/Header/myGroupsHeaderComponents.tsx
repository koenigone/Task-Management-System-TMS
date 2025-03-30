import HeaderComponent from "./headerComponent";
import CreateGroup from "../createGroup";

const MyGroupsHeaderComponents = () => {
  return (
    <HeaderComponent
      headerComponent={<CreateGroup />}
      headerComponentExtra={null}
      modalTitle="Manage My Groups"
    />
  );
};

export default MyGroupsHeaderComponents;