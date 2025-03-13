import { useContext } from "react";
import { GroupContext } from "../../../context/groupContext";
import TaskListCard from "../../components/taskListCard/taskListCard";

const GroupDetails = () => {
  const { currentGroup } = useContext(GroupContext);

  return (
    <div>
      {currentGroup ? (
        <TaskListCard Group_ID={currentGroup.Group_ID} />
      ) : (
        <p>No group selected.</p>
      )}
    </div>
  );
};

export default GroupDetails;