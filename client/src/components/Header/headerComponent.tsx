import { Flex, Box, useBreakpointValue } from "@chakra-ui/react";
import { JSX } from "react";
/* header component structure:
  - get the header component and the additional component
  - show the header component and the additional component if the additional component is provided
*/
interface HeaderComponentProps { // props for the header component
  headerComponent: JSX.Element;
  headerComponentExtra: JSX.Element;
  additionalComponent?: JSX.Element;
}

const HeaderComponent = ({
  headerComponent,
  headerComponentExtra,
  additionalComponent,
}: HeaderComponentProps) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex
      justify="space-between"
      align="center"
      p={isMobile ? { base: 2, sm: 3 } : 4}
      flexWrap={{ base: "wrap", sm: "nowrap" }}
      ml={{ base: "55px", sm: 0 }}
    >
      <Flex align="center" gap={2} ml={{ base: 2, sm: 4 }}>
        {additionalComponent && additionalComponent}
      </Flex>
      <Flex
        gap={{ base: 2, sm: 4 }}
        flexWrap={{ base: "wrap", sm: "nowrap" }}
        justifyContent={{ base: "flex-end", sm: "flex-end" }}
        width={{ base: "100%", sm: "auto" }}
        mt={{ base: additionalComponent ? 2 : 0, sm: 0 }}
      >
        <Box flexShrink={0}>{headerComponent}</Box>
        <Box flexShrink={0}>{headerComponentExtra}</Box>
      </Flex>
    </Flex>
  );
};

export default HeaderComponent;