import HeaderComponent from "./headerComponent";
import LeaveGroup from "../leaveGroup";

const JoinedGroupHeaderComponent = () => { // joined group header component
  return (
    <HeaderComponent
      headerComponent={<LeaveGroup />}
      headerComponentExtra={<></>}
    />
  );
};

export default JoinedGroupHeaderComponent;