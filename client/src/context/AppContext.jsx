import React, { createContext,useEffect,  useState } from 'react'
import { assets, jobsData } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
 
export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [searchFilter, setSearchFilter] = React.useState({
        title:'',
        location:''
    })

    const [isSearched, setIsSearched] = React.useState(false)

    const [jobs, setJobs] = React.useState([])

    const [showRecruiterLogin, setShowRecruiterLogin] = React.useState(false)  
    
    const [companytoken, setCompanyToken] = useState(null)
    
    const [companyData, setCompanyData] = useState(null)

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

    useEffect(() => {
        fetchJobs()

        const storedCompanyToken = localStorage.getItem('companyToken')

        if (storedCompanyToken) {
            setCompanyToken(storedCompanyToken)
        }
    }, []) 

    useEffect(()=>{

        fetchCompanyData() 

    },[companytoken])

    const value = {
        searchFilter,
        setSearchFilter,
        isSearched, setIsSearched,
        jobs, setJobs,
        showRecruiterLogin, setShowRecruiterLogin,
        companytoken,setCompanyToken,
        companyData,setCompanyData,
        backendUrl
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}