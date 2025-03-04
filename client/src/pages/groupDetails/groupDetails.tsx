import { useParams } from "react-router-dom";
import TaskListCard from "../../components/taskListCard/taskListCard";

const GroupDetails = () => {
  const { groupID } = useParams();

  return (
    <div>
      <TaskListCard groupID={Number(groupID)} />
    </div>
  );
};

export default GroupDetails;