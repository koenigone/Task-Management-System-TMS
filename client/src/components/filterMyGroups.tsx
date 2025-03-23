import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faClock, faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { Box, List, ListItem, HStack, Text, Icon, Tooltip } from "@chakra-ui/react";

const FilterMyGroups = () => {
  return (
    <Box bg="#D9D9D9" color="gray.700" p={2} fontWeight="bold" borderRadius="md" w={270}>
      <List display="flex" justifyContent="space-around" alignItems="center">
        <ListItem cursor="pointer">
          <HStack>
            <Text>Active</Text>
            <FontAwesomeIcon icon={faLightbulb} color="orange" />
          </HStack>
        </ListItem>
        
        <ListItem cursor="pointer">
          <HStack>
            <Text>Inactive</Text>
            <FontAwesomeIcon icon={faLightbulb} color="grey" />
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

export default FilterMyGroups;