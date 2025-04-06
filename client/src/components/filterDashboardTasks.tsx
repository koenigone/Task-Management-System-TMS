import { Box, Flex, List, ListItem, Text, Tooltip } from "@chakra-ui/react";
import { faCrown, faFilter, faHandHoldingHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FilterDashboardTasks = () => {
  return (
    <Box bg="#D9D9D9" color="gray.700" p={2} fontWeight="bold" borderRadius="md" w={255}>
      <List display="flex" justifyContent="space-around" alignItems="center">
        <ListItem cursor="pointer">
          <Flex align="center" gap={2}>
            <FontAwesomeIcon icon={faHandHoldingHeart} fontSize="15px" />
            <Text>Helper</Text>
          </Flex>
        </ListItem>

        <ListItem cursor="pointer">
          <Flex align="center" gap={2}>
            <FontAwesomeIcon icon={faCrown} fontSize="15px" />
            <Text>Leader</Text>
          </Flex>
        </ListItem>
        <ListItem mt={1}>
          <Tooltip label="Filter Lists" hasArrow>
            <FontAwesomeIcon icon={faFilter} fontSize={20} />
          </Tooltip>
        </ListItem>
      </List>
    </Box>
  );
};

export default FilterDashboardTasks;