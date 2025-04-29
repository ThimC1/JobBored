import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ApplyJob from './pages/ApplyJob'
import Applications from './pages/Applications'
import Dashboared from './pages/Dashboared'
import AddJob from './pages/AddJob'
import RecruiterLogin from './components/RecruiterLogin'
import { AppContext } from './context/AppContext'
import { useContext } from 'react'
import ViewApplications from './pages/ViewApplications'
import 'quill/dist/quill.snow.css'
import ManageJobs from './pages/ManageJobs'

const App = () => {

const {showRecruiterLogin} = useContext(AppContext)

  return (
    <div>
      {showRecruiterLogin && <RecruiterLogin/>}
      <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/apply-job/:id" element={<ApplyJob/>} />
          <Route path="/applications" element={<Applications/>} />
          <Route path="/dashboard" element={<Dashboared/>}>
            <Route path="add-job" element={<AddJob/>} />
            <Route path="manage-job" element={<ManageJobs/>} />
            <Route path="view-applications" element={<ViewApplications/>} />
          </Route>
      </Routes>
    </div>
  )
}

export default App