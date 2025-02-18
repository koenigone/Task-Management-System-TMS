import './App.css'
import Navigation from './components/sidebar/navigation'
import { ChakraProvider } from "@chakra-ui/react";

function App() {

  return (
      <main>
        <ChakraProvider>
          <Navigation />
        </ChakraProvider>
      </main>
  )
}

export default App