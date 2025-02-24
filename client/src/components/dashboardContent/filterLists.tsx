import "./dashboardCreate.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faSquareCheck,
  faClock
} from "@fortawesome/free-solid-svg-icons";

const FilterTaskLists = () => {

  return (
    <ul className="filter-tasklist-container">

      <li>
        <div className="filter-item" >
          <span>Completed</span>
          <FontAwesomeIcon icon={faSquareCheck} color="#6FDA49" />
        </div>
      </li>

      <li>
        <div className="filter-item">
          <span>In Progress</span>
          <FontAwesomeIcon icon={faClock} color="#245FCC" />
        </div>
      </li>

      <li className="icon-container">
        <FontAwesomeIcon icon={faFilter} size="lg" />
      </li>
    </ul>
  );
};

export default FilterTaskLists;
