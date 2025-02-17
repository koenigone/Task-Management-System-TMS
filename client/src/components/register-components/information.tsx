import './coomponents.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

const Information = () => {
  return(
    <div className='information-container'>
      <FontAwesomeIcon icon={faCircleExclamation} className='information-icon' />
    </div>
  );
}

export default Information