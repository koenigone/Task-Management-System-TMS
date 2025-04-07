import { Box, Text, Flex } from "@chakra-ui/react";
import { JSX } from "react";

interface HeaderComponentProps {
  headerComponent: JSX.Element;
  headerComponentExtra: JSX.Element;
  modalTitle: string;
}

const HeaderComponent = ({
  headerComponent,
  headerComponentExtra,
  modalTitle,
}: HeaderComponentProps) => {
  return (
    <Box bg="gray.100" p={4} borderRadius="md">
      <Flex justify="space-between" align="center">
        <Text fontSize="2xl" fontWeight="bold">{modalTitle}</Text>
        <Flex gap={4}>
          {headerComponent}
          {headerComponentExtra}  {/* Render FilterActiveGroups here */}
        </Flex>
      </Flex>
    </Box>
  );
};

export default HeaderComponent;