import './main.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { Route, Routes } from 'react-router'
import App from './App.tsx'

import Dashboard from './pages/dashboard/dashboard'
import CreateGroup from './pages/createGroup/createGroup'
import MyGroups from './pages/myGroups/myGroups'
import JoinedGroups from './pages/joinedGroups/joinedGroups'
import Settings from './pages/settings/settings'
import SignUp from './pages/sign-in-up-pages/signup'
import Login from './pages/sign-in-up-pages/login';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
        <App />
        <Routes>
          <Route path='/Signup' element={<SignUp />}></Route>
          <Route path='/Login' element={<Login />}></Route>
          <Route path='/' element={<Dashboard />}></Route>
          <Route path='/CreateGroup' element={<CreateGroup />}></Route>
          <Route path='/MyGroups' element={<MyGroups />}></Route>
          <Route path='/JoinedGroups' element={<JoinedGroups />}></Route>
          <Route path='/Settings' element={<Settings />}></Route>
        </Routes>
      </BrowserRouter>
  </StrictMode>,
)