import "./coomponents.css";
import { faPen, faCheck, faListCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const InformativeIcons = () => { // informative icons for the register page
  return (
    <div className="informative-icons-container">
      <div
        className="informative-icon"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        title="Tooltip on top"
      >
        <FontAwesomeIcon icon={faPen} />
      </div>

      <div className="informative-icon">
        <FontAwesomeIcon icon={faCheck} />
      </div>

      <div className="informative-icon">
        <FontAwesomeIcon icon={faListCheck} />
      </div>
    </div>
  );
};

export default InformativeIcons;