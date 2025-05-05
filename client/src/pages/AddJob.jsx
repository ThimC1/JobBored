import React, { useContext, useEffect } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css' // IMPORTANT: Add this CSS import
import { JobCategories, JobLocations } from '../assets/assets'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const AddJob = () => {
    const [title, setTitle] = React.useState('')
    const [location, setLocation] = React.useState('Bangalore')
    const [category, setCategory] = React.useState('Programming')
    const [level, setLevel] = React.useState('Beginner Level')
    const [salary, setSalary] = React.useState(0)

    const editorRef = React.useRef(null)
    const quillRef = React.useRef(null)

    const { backendUrl, companytoken } = useContext(AppContext)

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        try {

            const description = quillRef.current.root.innerHTML

            const { data } = await axios.post(backendUrl+ 'api/company/post-job',
                {title, description, location, salary, category, level},
                {headers: {token:companytoken}}
            )

            if (data.success){
                toast.success(data.message)
                setTitle('')
                setSalary(0)
                quillRef.current.root.innerHTML = ""
                console.log('Job Added Succesfully')
            }else{
                toast.error(data.message)
            }

            
        } catch (error) {
            toast.error(error.message)
        }

    }

    useEffect(() => {
        if (editorRef.current && !quillRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'header': [1, 2, 3, false] }],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['link', 'image'],
                        ['clean']
                    ]
                },
                placeholder: 'Write job description here...',
            })
        }
        
        return () => {
            // Cleanup Quill instance when component unmounts
            if (quillRef.current) {
                quillRef.current = null
            }
        }
    }, [])

    return (
        <form onSubmit={onSubmitHandler} className='container p-4 flex flex-col w-full items-start gap-3'>
            <div className='w-full'>
                <p className='mb-2'>Job Title</p>
                <input 
                    type="text" 
                    placeholder='Type here' 
                    onChange={e => setTitle(e.target.value)} 
                    value={title} 
                    required
                    className='w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded' 
                />
            </div>
            
            <div className='w-full'>
                <p className='mb-2'>Job Description</p>
                <div 
                    ref={editorRef} 
                    className='bg-white border-2 border-gray-300 rounded'
                    style={{ height: '300px' }}
                />
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 w-full'>
                <div>
                    <p className='mb-2'>Job Category</p>
                    <select 
                        onChange={e => setCategory(e.target.value)}
                        className='w-full px-3 py-2 border-2 border-gray-300 rounded'
                    >
                        {JobCategories.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
                
                <div>
                    <p className='mb-2'>Job Location</p>
                    <select 
                        onChange={e => setLocation(e.target.value)} // Fixed: was setCategory
                        className='w-full px-3 py-2 border-2 border-gray-300 rounded'
                    >
                        {JobLocations.map((location, index) => (
                            <option key={index} value={location}>{location}</option>
                        ))}
                    </select>
                </div>
                
                <div>
                    <p className='mb-2'>Job Level</p>
                    <select 
                        onChange={e => setLevel(e.target.value)}
                        className='w-full px-3 py-2 border-2 border-gray-300 rounded'
                    >
                        <option value="Beginner level">Beginner level</option>
                        <option value="Intermediate level">Intermediate level</option>
                        <option value="Senior level">Senior level</option>
                    </select>
                </div>
            </div>
            
            <div className='w-full'>
                <p className='mb-2'>Job Salary</p>
                <input 
                    min={0}
                    type="number" 
                    placeholder='2500' 
                    onChange={e => setSalary(e.target.value)}
                    className='w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded'
                />
            </div>
            
            <button 
                type="submit" 
                className='px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
            >
                ADD
            </button>
        </form>
    )
}

export default AddJob