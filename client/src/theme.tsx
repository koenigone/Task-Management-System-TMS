import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

// custom styles for light and dark mode
const styles = {
  global: (props: { colorMode: string }) => ({
    body: {
      bg: props.colorMode === 'dark' ? 'black' : '#FAFAFA',
      color: props.colorMode === 'dark' ? 'white' : 'gray.800',
    },
  }),
};

// component theming for chakra ui components
const components = {
  Box: {
    baseStyle: (props: { colorMode: string }) => ({
      bg: props.colorMode === 'dark' ? 'black' : 'white',
    }),
  },
  Card: {
    baseStyle: (props: { colorMode: string }) => ({
      bg: props.colorMode === 'dark' ? 'gray.900' : 'white',
    }),
  },
  Modal: {
    baseStyle: (props: { colorMode: string }) => ({
      dialog: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'white',
      },
    }),
  },
};

const theme = extendTheme({ 
  config,
  styles,
  components,
});

export default theme;