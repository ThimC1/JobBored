import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ApplyJob from './pages/ApplyJob'
import Applications from './pages/Applications'
import Dashboared from './pages/Dashboared'
import AddJob from './pages/AddJob'

import { AppContext } from './context/AppContext'
import { useContext } from 'react'
import ViewApplications from './pages/ViewApplications'
import 'quill/dist/quill.snow.css'
import ManageJobs from './pages/ManageJobs'
import { ToastContainer, toast } from 'react-toastify';

const App = () => {

const {showRecruiterLogin, companytoken} = useContext(AppContext)

  return (
    <div>
      {showRecruiterLogin && <RecruiterLogin/>}
      <ToastContainer/>
      <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/apply-job/:id" element={<ApplyJob/>} />
          <Route path="/applications" element={<Applications/>} />
          <Route path="/dashboard" element={<Dashboared/>}>
          {companytoken?<>
            <Route path="add-job" element={<AddJob/>} />
            <Route path="manage-job" element={<ManageJobs/>} />
            <Route path="view-applications" element={<ViewApplications/>} />
          </>: null
          }
            
          </Route>
      </Routes>
    </div>
  )
}

export default App