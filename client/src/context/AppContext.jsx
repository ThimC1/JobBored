import React, { createContext,useEffect, use, useState } from 'react'
import { assets, jobsData } from '../assets/assets'
 
export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const [searchFilter, setSearchFilter] = React.useState({
        title:'',
        location:''
    })

    const [isSearched, setIsSearched] = React.useState(false)

    const [jobs, setJobs] = React.useState([])

    const [showRecruiterLogin, setShowRecruiterLogin] = React.useState(false)    

    // Function to fetch jobs
    const fetchJobs = async () => {
        setJobs(jobsData)
    }

    useEffect(() => {
        fetchJobs()
    }, []) 

    const value = {
        searchFilter,
        setSearchFilter,
        isSearched, setIsSearched,
        jobs, setJobs,
        showRecruiterLogin, setShowRecruiterLogin,
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}