import './App.css'
import Navigation from './components/sidebar/navigation'
import { Route, Routes } from 'react-router'

import Dashboard from './pages/dashboard/dashboard'
import CreateGroup from './pages/createGroup/createGroup'
import MyGroups from './pages/myGroups/myGroups'
import JoinedGroups from './pages/joinedGroups/joinedGroups'
import Settings from './pages/settings/settings'

function App() {

  return (
    <div className='main-container'>
      <nav>
        <Navigation />
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
    </div>
  )
}

export default App