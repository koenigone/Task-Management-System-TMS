import './App.css'
import { MantineProvider } from '@mantine/core';
import Navigation from './components/sidebar/navigation'
import { Route, Routes } from 'react-router'

import Dashboard from './pages/dashboard/dashboard'
import CreateGroup from './pages/createGroup/createGroup'
import MyGroups from './pages/myGroups/myGroups'
import JoinedGroups from './pages/joinedGroups/joinedGroups'
import Settings from './pages/settings/settings'
import SignUp from './pages/sign-in-up-pages/signup'

function App() {

  return (
    <MantineProvider>
      <nav>
        {/* <Navigation /> */}
        <SignUp />
      </nav>
      <main>
        <Routes>
          <Route path='/' element={<Dashboard />}></Route>
          <Route path='/CreateGroup' element={<CreateGroup />}></Route>
          <Route path='/MyGroups' element={<MyGroups />}></Route>
          <Route path='/JoinedGroups' element={<JoinedGroups />}></Route>
          <Route path='/Settings' element={<Settings />}></Route>
        </Routes>
      </main>
    </MantineProvider>
  )
}

export default App