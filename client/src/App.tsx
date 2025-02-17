import './App.css'
import Navigation from './components/sidebar/navigation'
import SignUp from './pages/sign-in-up-pages/signup'
import { ChakraProvider } from "@chakra-ui/react";

function App() {

  return (
      <main>
        <ChakraProvider>
          <SignUp />
        </ChakraProvider>
      </main>
  )
}

export default App