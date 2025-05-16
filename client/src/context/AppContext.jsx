import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth, useUser } from '@clerk/clerk-react'
 
export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const {user} = useUser()
    const {getToken} = useAuth()

    const [searchFilter, setSearchFilter] = useState({
        title:'',
        location:''
    })

    const [isSearched, setIsSearched] = useState(false)

    const [jobs, setJobs] = useState([])

    // Recruiter login state
    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)  
    const [companytoken, setCompanyToken] = useState(null)
    const [companyData, setCompanyData] = useState(null)

    // Job seeker login state
    const [showJobSeekerLogin, setShowJobSeekerLogin] = useState(false)
    const [jobSeekerToken, setJobSeekerToken] = useState(null)
    const [jobSeekerData, setJobSeekerData] = useState(null)

    const [userData, setUserData] = useState(null)
    const [userApplications, setUserApplications] = useState([])

    // Function to fetch jobs
    const fetchJobs = async () => {
        try {
            const {data} = await axios.get(backendUrl+'api/jobs')

            if (data.success) {
                setJobs(data.jobs)
                console.log(data.jobs)
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
           toast.error(error.message) 
        }
    }

    //Function to fetch company data
    const fetchCompanyData = async () => {
        try {
            const {data} = await axios.get(backendUrl+'api/company/company', {headers:{token:companytoken}})

            if (data.success) {
                setCompanyData(data.company)
                console.log(data);
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
        }
    }

    //Function to fetch jobseeker data
    const fetchJobSeekerData = async () => {
        try {
            const {data} = await axios.get(backendUrl+'api/jobseeker/profile', {headers:{token:jobSeekerToken}})

            if (data.success) {
                setJobSeekerData(data.jobseeker)
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
        }
    }

    //Function to fetch user data
    const fetchUserData = async ()=> {
        try {
            const token = await getToken();

            const {data} = await axios.get(backendUrl+ 'api/user/user', 
                {headers:{Authorization:`Bearer ${token}`}})

            if (data.success) {
                setUserData(data.user)
            }else(
                toast.error(data.message)
            )
            
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchJobs()

        const storedCompanyToken = localStorage.getItem('companyToken')
        if (storedCompanyToken) {
            setCompanyToken(storedCompanyToken)
        }

        const storedJobSeekerToken = localStorage.getItem('jobSeekerToken')
        if (storedJobSeekerToken) {
            setJobSeekerToken(storedJobSeekerToken)
        }
    }, []) 

    useEffect(() => {
        if (companytoken) {
            fetchCompanyData() 
        }
    }, [companytoken])

    useEffect(() => {
        if (jobSeekerToken) {
            fetchJobSeekerData() 
        }
    }, [jobSeekerToken])

    useEffect(() => {
        if (user) {
            fetchUserData()
        }
    }, [user])

    const value = {
        searchFilter,
        setSearchFilter,
        isSearched, 
        setIsSearched,
        jobs, 
        setJobs,
        showRecruiterLogin, 
        setShowRecruiterLogin,
        companytoken,
        setCompanyToken,
        companyData,
        setCompanyData,
        backendUrl,
        userData, 
        setUserData,
        userApplications, 
        setUserApplications,
        fetchUserData,
        // New job seeker related context values
        showJobSeekerLogin,
        setShowJobSeekerLogin,
        jobSeekerToken,
        setJobSeekerToken,
        jobSeekerData,
        setJobSeekerData,
        fetchJobSeekerData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}