import { Box, Flex, List, ListItem, Text, Tooltip, useBreakpointValue } from "@chakra-ui/react";
import { faFilter, faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface FilterActiveGroupsProps { // props for the filter active groups
  onFilterChange: (filter: "all" | "active" | "inactive") => void;
  currentFilter: "all" | "active" | "inactive";
}

/* FilterActiveGroups structure:
  - get the onFilterChange and currentFilter
  - return the FilterActiveGroups
*/
const FilterActiveGroups = ({ onFilterChange, currentFilter }: FilterActiveGroupsProps) => {
  return (
    <Box 
      bg="#D9D9D9" 
      color="gray.700" 
      p={{ base: 1, sm: 2 }} 
      fontWeight="bold" 
      borderRadius="md" 
      width={{ base: "auto", sm: "255px" }}
      maxW={{ base: "100%", sm: "255px" }}
      fontSize={{ base: "sm", sm: "md" }}
    >
      <List display="flex" justifyContent="space-around" alignItems="center">
        <ListItem 
          cursor="pointer"
          onClick={() => onFilterChange("inactive")}
          opacity={currentFilter === "inactive" ? 1 : 0.6}
          px={{ base: 1, sm: 2 }}
        >
          <Flex align="center" gap={{ base: 1, sm: 2 }}>
            <FontAwesomeIcon 
              icon={faLightbulb} 
              style={{ fontSize: useBreakpointValue({ base: "12px", sm: "15px" }) }}
              color="gray" 
            />
            <Text>Inactive</Text>
          </Flex>
        </ListItem>

        <ListItem 
          cursor="pointer"
          onClick={() => onFilterChange("active")}
          opacity={currentFilter === "active" ? 1 : 0.6}
          px={{ base: 1, sm: 2 }}
        >
          <Flex align="center" gap={{ base: 1, sm: 2 }}>
            <FontAwesomeIcon 
              icon={faLightbulb} 
              style={{ fontSize: useBreakpointValue({ base: "12px", sm: "15px" }) }}
              color="orange" 
            />
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
            <FontAwesomeIcon 
              icon={faFilter} 
              style={{ fontSize: useBreakpointValue({ base: "16px", sm: "20px" }) }}
            />
          </Tooltip>
        </ListItem>
      </List>
    </Box>
  );
};

export default FilterActiveGroups;