import { Box, Flex, List, ListItem, Text, Tooltip } from "@chakra-ui/react";
import { faFilter, faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface FilterActiveGroupsProps {
  onFilterChange: (filter: "all" | "active" | "inactive") => void;
  currentFilter: "all" | "active" | "inactive";
}

const FilterActiveGroups = ({ onFilterChange, currentFilter }: FilterActiveGroupsProps) => {
  return (
    <Box bg="#D9D9D9" color="gray.700" p={2} fontWeight="bold" borderRadius="md" w={255}>
      <List display="flex" justifyContent="space-around" alignItems="center">
        <ListItem 
          cursor="pointer"
          onClick={() => onFilterChange("inactive")}
          opacity={currentFilter === "inactive" ? 1 : 0.6}
        >
          <Flex align="center" gap={2}>
            <FontAwesomeIcon icon={faLightbulb} fontSize="15px" color="gray" />
            <Text>Inactive</Text>
          </Flex>
        </ListItem>

        <ListItem 
          cursor="pointer"
          onClick={() => onFilterChange("active")}
          opacity={currentFilter === "active" ? 1 : 0.6}
        >
          <Flex align="center" gap={2}>
            <FontAwesomeIcon icon={faLightbulb} fontSize="15px" color="orange" />
            <Text>Active</Text>
          </Flex>
        </ListItem>
        
        <ListItem 
          cursor="pointer"
          onClick={() => onFilterChange("all")}
          opacity={currentFilter === "all" ? 1 : 0.6}
        >
          <Tooltip label="Show All" hasArrow>
            <Text>All</Text>
          </Tooltip>
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

export default FilterActiveGroups;