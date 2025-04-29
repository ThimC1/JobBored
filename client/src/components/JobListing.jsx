import React, { useContext, useEffect, useMemo } from 'react'
import { AppContext } from '../context/AppContext'
import { assets, JobCategories, JobLocations } from '../assets/assets'
import JobCard from './JobCard'

const JobListing = () => {
    const { isSearched, searchFilter, setSearchFilter, jobs } = useContext(AppContext)
    const [showFilter, setShowFilter] = React.useState(false)
    const [currentPage, setCurrentPage] = React.useState(1)
    const [selectedCategory, setSelectedCategory] = React.useState([])
    const [selectedLocation, setSelectedLocation] = React.useState([])

    const filteredJobs = useMemo(() => {
        const matchesCategory = job => 
            selectedCategory.length === 0 || selectedCategory.includes(job.category)
        
        const matchesLocation = job => 
            selectedLocation.length === 0 || selectedLocation.includes(job.location)
        
        const matchesTitle = job => 
            searchFilter.title === "" || 
            job.title.toLowerCase().includes(searchFilter.title.toLowerCase())
        
        const matchesSearchLocation = job =>
            searchFilter.location === "" || 
            job.location.toLowerCase().includes(searchFilter.location.toLowerCase())

        return jobs.filter(job => 
            matchesCategory(job) && 
            matchesLocation(job) && 
            matchesTitle(job) && 
            matchesSearchLocation(job)
        )
    }, [jobs, selectedCategory, selectedLocation, searchFilter])

    const handleCategoryChange = (category) => {
        setSelectedCategory(prev =>
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        )
        setCurrentPage(1)
    }

    const handleLocationChange = (location) => {
        setSelectedLocation(prev =>
            prev.includes(location) ? prev.filter(l => l !== location) : [...prev, location]
        )
        setCurrentPage(1)
    }

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage)
        const element = document.getElementById('job-list')
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    const jobsPerPage = 6
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)
    const paginatedJobs = filteredJobs.slice(
        (currentPage - 1) * jobsPerPage,
        currentPage * jobsPerPage
    )

    return (
        <div className='container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8'>
            {/* Sidebar */}
            <div className='w-full lg:w-1/4 bg-white px-4'>
                {/* Search Filter from Hero Component */}
                {isSearched && (searchFilter.title || searchFilter.location) && (
                    <>
                        <h3 className='font-medium text-lg mb-4'>Current Search</h3>
                        <div className='mb-4 text-gray-600'>
                            {searchFilter.title && (
                                <span className='inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded'>
                                    {searchFilter.title}
                                    <img 
                                        onClick={() => setSearchFilter(prev => ({ ...prev, title: "" }))} 
                                        className='cursor-pointer' 
                                        src={assets.cross_icon} 
                                        alt="Remove title filter" 
                                    />
                                </span>
                            )}
                            {searchFilter.location && (
                                <span className='ml-2 inline-flex items-center gap-2.5 bg-red-50 border border-red-200 px-4 py-1.5 rounded'>
                                    {searchFilter.location}
                                    <img 
                                        onClick={() => setSearchFilter(prev => ({ ...prev, location: "" }))} 
                                        className='cursor-pointer' 
                                        src={assets.cross_icon} 
                                        alt="Remove location filter" 
                                    />
                                </span>
                            )}
                        </div>
                    </>
                )}
                <button 
                    onClick={() => setShowFilter(prev => !prev)} 
                    className='px-6 py-1.5 rounded border border-gray-400 lg:hidden'
                >
                    {showFilter ? "Hide Filters" : "Show Filters"}
                </button>

                {/* Category Filter */}
                <div className={showFilter ? "" : "max-lg:hidden"}>
                    <h4 className='font-medium text-lg py-4'>Search by Categories</h4>
                    <ul className='space-y-4 text-gray-600'>
                        {JobCategories.map((category, index) => (
                            <li className='flex gap-3 items-center' key={index}>
                                <input
                                    id={`category-${index}`}
                                    className='scale-125'
                                    type="checkbox"
                                    onChange={() => handleCategoryChange(category)}
                                    checked={selectedCategory.includes(category)}
                                />
                                <label htmlFor={`category-${index}`}>{category}</label>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={showFilter ? "" : "max-lg:hidden"}>
                    <h4 className='font-medium text-lg py-4'>Search by Location</h4>
                    <ul className='space-y-4 text-gray-600'>
                        {JobLocations.map((location, index) => (
                            <li className='flex gap-3 items-center' key={index}>
                                <input
                                    id={`location-${index}`}
                                    className='scale-125'
                                    type="checkbox"
                                    onChange={() => handleLocationChange(location)}
                                    checked={selectedLocation.includes(location)}
                                />
                                <label htmlFor={`location-${index}`}>{location}</label>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            
            {/* Job listings */}
            <section className='w-full lg:w-3/4 text-gray-800 max-lg:px-4'>
                <h3 className='font-medium text-3xl py-2' id='job-list'>Latest Jobs</h3>
                <p className='mb-8'>Get your desired job from top companies</p>
                
                {paginatedJobs.length > 0 ? (
                    <>
                        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
                            {paginatedJobs.map((job, index) => (
                                <JobCard key={`${job.id}-${index}`} job={job} />
                            ))}
                        </div>
                        
                        {/* Pagination */}
                        <div className='flex justify-center items-center space-x-2 mt-10'>
                            <button
                                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                                disabled={currentPage === 1}
                                className='p-2 disabled:opacity-50'
                            >
                                <img src={assets.left_arrow_icon} alt="Previous page" />
                            </button>
                            
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={`page-${index}`}
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`w-10 h-10 flex items-center justify-center border rounded ${
                                        currentPage === index + 1 
                                            ? 'bg-blue-100 text-blue-500 border-blue-300' 
                                            : 'text-gray-500 border-gray-300 hover:bg-gray-100'
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            
                            <button
                                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className='p-2 disabled:opacity-50'
                            >
                                <img src={assets.right_arrow_icon} alt="Next page" />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-500">No jobs match your current filters</p>
                        <button
                            onClick={() => {
                                setSelectedCategory([])
                                setSelectedLocation([])
                                setSearchFilter({ title: "", location: "" })
                            }}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </section>
        </div>
    )
}

export default JobListing