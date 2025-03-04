import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { Text } from "@chakra-ui/react";

const BackButton = () => {
  return(
    <Text color="#2B3241" fontSize={28}>
      <FontAwesomeIcon icon={faArrowAltCircleLeft} />
    </Text>
  );
}

export default BackButton;