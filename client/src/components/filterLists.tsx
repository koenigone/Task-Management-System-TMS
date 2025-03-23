import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSquareCheck, faClock } from "@fortawesome/free-solid-svg-icons";
import { Box, List, ListItem, HStack, Text, Icon, Tooltip } from "@chakra-ui/react";

const FilterTaskLists = () => {
  return (
    <Box bg="#D9D9D9" color="gray.700" p={2} fontWeight="bold" borderRadius="md" w={320}>
      <List display="flex" justifyContent="space-around" alignItems="center">
        <ListItem cursor="pointer">
          <HStack>
            <Text>Completed</Text>
            <Icon as={FontAwesomeIcon} icon={faSquareCheck} color="green.600" />
          </HStack>
        </ListItem>
        
        <ListItem cursor="pointer">
          <HStack>
            <Text>In Progress</Text>
            <Icon as={FontAwesomeIcon} icon={faClock} color="blue.600" />
          </HStack>
        </ListItem>

        <ListItem mt={1}>
          <Tooltip label="Filter" hasArrow>
            <FontAwesomeIcon icon={faFilter} fontSize={20} />
          </Tooltip>
        </ListItem>
      </List>
    </Box>
  );
};

export default FilterTaskLists;