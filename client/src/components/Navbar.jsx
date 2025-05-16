import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { useContext } from 'react'
import JobSeekerLoginModal from './JobSeekerLoginModal'

const Navbar = () => {
  const { openSignIn } = useClerk()
  const { user } = useUser()
  const navigate = useNavigate()
  const [showJobSeekerLogin, setShowJobSeekerLogin] = useState(false)

  return (
    <>
      <div className='shadow py-4'>
        <div className='ml-2 rounded-sm container px-4 2xl:px-20 mx-auto flex justify-between items-center'>
          <img 
            onClick={() => navigate('/')} 
            className='cursor-pointer' 
            src={assets.logo2} 
            alt="logo" 
          />
          {
            user
              ? <div className='flex items-center gap-3'>
                  <Link to={'/applications'}>Applied Jobs</Link>
                  <p>|</p>
                  <p className='max-sm:hidden'>Hi, {user?.firstName + " " + user?.lastName}</p>
                  <UserButton />
                </div>
              : <div className='flex gap-4 max-sm:text-xs'>
                  <button 
                    onClick={() => setShowJobSeekerLogin(true)} 
                    className='text-gray-600'
                  >
                    JobSeeker Login
                  </button>
                  <button 
                    onClick={openSignIn} 
                    className='bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full'
                  >
                    Login
                  </button>
                </div>
          }
        </div>
      </div>

      {/* Render the JobSeekerLoginModal when showJobSeekerLogin is true */}
      {showJobSeekerLogin && (
        <AppContext.Provider value={{ setShowJobSeekerLogin }}>
          <JobSeekerLoginModal />
        </AppContext.Provider>
      )}
    </>
  )
}

export default Navbar