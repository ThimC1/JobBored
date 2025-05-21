import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext'; // Adjust path as needed
import { assets } from '../assets/assets'; // Adjust path as needed

const JobSeekerLoginModal = () => {
    const navigate = useNavigate();
    const [state, setState] = useState('Login');
    const [registrationStep, setRegistrationStep] = useState(1);

    // Personal Information (Step 1)
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('Other');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [nic, setNic] = useState('');
    const [password, setPassword] = useState('');
    
    // Address (Step 1)
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [province, setProvince] = useState('');
    
    // Skills (Step 2)
    const [skills, setSkills] = useState([]);
    const [selectedSkill, setSelectedSkill] = useState('');
    const [specificSkills, setSpecificSkills] = useState('');
    const [yearsOfExperience, setYearsOfExperience] = useState('');
    const [certification, setCertification] = useState('');
    const [skillDescription, setSkillDescription] = useState('');
    const [otherSkill, setOtherSkill] = useState('');
    
    // Availability & Rates (Step 3)
    const [availableDays, setAvailableDays] = useState([]);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [tempTimeSlot, setTempTimeSlot] = useState('');
    const [serviceRadius, setServiceRadius] = useState(10);
    const [hourlyRate, setHourlyRate] = useState('');
    const [dayRate, setDayRate] = useState('');
    const [fullRate, setFullRate] = useState('');
    const [image, setImage] = useState(null);

    // Get the context properly
    const appContext = useContext(AppContext);
    
    // Destructure the context values
    const setShowJobSeekerLogin = appContext?.setShowJobSeekerLogin;
    const backendUrl = appContext?.backendUrl || 'http://localhost:5000/';
    const setJobSeekerToken = appContext?.setJobSeekerToken;
    const setJobSeekerData = appContext?.setJobSeekerData;

    // Verify context values are available
    useEffect(() => {
        if (!appContext) {
            console.error('AppContext is not available');
        } else {
            console.log('AppContext loaded successfully', appContext);
        }
    }, [appContext]);

    // Sample skill categories - in production, these would come from an API
    const availableSkills = [
        'Plumbing', 
        'Electrical', 
        'Carpentry', 
        'Painting',
        'Gardening',
        'Cleaning',
        'Cooking',
        'Tutoring',
        'Other'
    ];

    const daysOfWeek = [
        'Monday', 
        'Tuesday', 
        'Wednesday', 
        'Thursday', 
        'Friday', 
        'Saturday', 
        'Sunday'
    ];
    
    const addSkill = () => {
        if (!selectedSkill) return;
        
        if (selectedSkill === 'Other' && otherSkill.trim() === '') {
            toast.error("Please enter a skill name");
            return;
        }

        if (!yearsOfExperience) {
            toast.error("Please enter years of experience");
            return;
        }

        const skillName = selectedSkill === 'Other' ? otherSkill : selectedSkill;
        
        // Check if skill already exists
        if (skills.some(s => s.skillName === skillName)) {
            toast.error("This skill is already added");
            return;
        }

        const newSkill = {
            skillName,
            SpecificSkills: specificSkills,
            yearsOfExperience: parseInt(yearsOfExperience),
            certification,
            descrption: skillDescription
        };

        setSkills([...skills, newSkill]);
        
        // Reset skill form
        setSelectedSkill('');
        setSpecificSkills('');
        setYearsOfExperience('');
        setCertification('');
        setSkillDescription('');
        setOtherSkill('');
        
        toast.success("Skill added successfully!");
    };
    
    const removeSkill = (skillName) => {
        setSkills(skills.filter(skill => skill.skillName !== skillName));
    };

    const toggleDay = (day) => {
        if (availableDays.includes(day)) {
            setAvailableDays(availableDays.filter(d => d !== day));
        } else {
            setAvailableDays([...availableDays, day]);
        }
    };

    const addTimeSlot = () => {
        if (tempTimeSlot && !availableTimeSlots.includes(tempTimeSlot)) {
            setAvailableTimeSlots([...availableTimeSlots, tempTimeSlot]);
            setTempTimeSlot('');
        }
    };

    const removeTimeSlot = (slot) => {
        setAvailableTimeSlots(availableTimeSlots.filter(s => s !== slot));
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (state === "Sign Up") {
            // Validation for each step before proceeding
            if (registrationStep === 1) {
                if (!firstName || !lastName || !dateOfBirth || !phoneNumber || !email || !nic || !password) {
                    toast.error("Please fill in all required fields");
                    return;
                }
                return setRegistrationStep(2);
            } 
            else if (registrationStep === 2) {
                if (skills.length === 0) {
                    toast.error("Please add at least one skill");
                    return;
                }
                return setRegistrationStep(3);
            }
            else if (registrationStep < 3) {
                return setRegistrationStep(registrationStep + 1);
            }
        }

        try {
            if (state === "Login") {
                // Handle login
                const { data } = await axios.post(`${backendUrl}api/skillers/login`, { email, password });

                if (data.success) {
                    if (typeof setJobSeekerData === 'function') {
                        setJobSeekerData(data.skiller);
                    } else {
                        console.error('setJobSeekerData is not a function', setJobSeekerData);
                        localStorage.setItem('jobSeekerData', JSON.stringify(data.skiller));
                    }
                    
                    if (typeof setJobSeekerToken === 'function') {
                        setJobSeekerToken(data.token);
                    } else {
                        console.error('setJobSeekerToken is not a function', setJobSeekerToken);
                    }
                    
                    localStorage.setItem('jobSeekerToken', data.token);
                    
                    if (typeof setShowJobSeekerLogin === 'function') {
                        setShowJobSeekerLogin(false);
                    } else {
                        console.error('setShowJobSeekerLogin is not a function', setShowJobSeekerLogin);
                    }
                    
                    navigate('/jobseeker-dashboard');
                } else {
                    toast.error(data.message);
                }
            } else {
                // Handle registration
                const formData = new FormData();
                formData.append('firstName', firstName);
                formData.append('lastName', lastName);
                formData.append('dateOfBirth', dateOfBirth);
                formData.append('gender', gender);
                formData.append('phoneNumber', phoneNumber);
                formData.append('email', email);
                formData.append('nic', nic);
                formData.append('address', JSON.stringify({
                    street,
                    city,
                    province
                }));
                formData.append('skills', JSON.stringify(skills)); // Convert skills array to JSON string
                formData.append('availability', JSON.stringify({
                    days: availableDays,
                    timeSlots: availableTimeSlots
                }));
                formData.append('radius', serviceRadius);
                formData.append('hourlyRate', hourlyRate);
                formData.append('DayRate', dayRate);
                formData.append('FullRate', fullRate);
                formData.append('password', password);
                
                if (image) {
                    formData.append('profilePicture', image);
                }

                const { data } = await axios.post(`${backendUrl}api/skillers/register`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (data.success) {
                    if (typeof setJobSeekerData === 'function') {
                        setJobSeekerData(data.skiller);
                    } else {
                        console.error('setJobSeekerData is not a function', setJobSeekerData);
                        localStorage.setItem('jobSeekerData', JSON.stringify(data.skiller));
                    }
                    
                    if (typeof setJobSeekerToken === 'function') {
                        setJobSeekerToken(data.token);
                    } else {
                        console.error('setJobSeekerToken is not a function', setJobSeekerToken);
                    }
                    
                    localStorage.setItem('jobSeekerToken', data.token);
                    
                    if (typeof setShowJobSeekerLogin === 'function') {
                        setShowJobSeekerLogin(false);
                    } else {
                        console.error('setShowJobSeekerLogin is not a function', setShowJobSeekerLogin);
                    }
                    
                    navigate('/jobseeker-dashboard');
                } else {
                    toast.error(data.message);
                }
            }
            
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    const renderRegistrationSteps = () => {
        if (registrationStep === 1) {
            return (
                <>
                    {/* Personal Information */}
                    <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                        <img src={assets.person_icon} alt="" />
                        <input 
                            className="outline-none text-sm w-full" 
                            onChange={e => setFirstName(e.target.value)} 
                            value={firstName} 
                            type="text" 
                            placeholder="First Name" 
                            required
                        />
                    </div>
                    <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                        <img src={assets.person_icon} alt="" />
                        <input 
                            className="outline-none text-sm w-full" 
                            onChange={e => setLastName(e.target.value)} 
                            value={lastName} 
                            type="text" 
                            placeholder="Last Name" 
                            required
                        />
                    </div>
                    <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                        <img src={assets.person_icon} alt="" />
                        <input 
                            className="outline-none text-sm w-full" 
                            onChange={e => setDateOfBirth(e.target.value)} 
                            value={dateOfBirth} 
                            type="date" 
                            placeholder="Date of birth" 
                            required
                        />
                    </div>
                    <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                        <img src={assets.person_icon} alt="" />
                        <select 
                            className="outline-none text-sm w-full" 
                            onChange={e => setGender(e.target.value)} 
                            value={gender}
                            required
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    
                    <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                        <img src={assets.person_icon} alt="" />
                        <input 
                            className="outline-none text-sm w-full" 
                            onChange={e => setPhoneNumber(e.target.value)} 
                            value={phoneNumber} 
                            type="tel" 
                            placeholder="Mobile Number" 
                            required
                        />
                    </div>
                    <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                        <img src={assets.email_icon} alt="" />
                        <input 
                            className="outline-none text-sm w-full" 
                            onChange={e => setEmail(e.target.value)} 
                            value={email} 
                            type="email" 
                            placeholder="Email Address" 
                        />
                    </div>
                    <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                        <img src={assets.person_icon} alt="" />
                        <input 
                            className="outline-none text-sm w-full" 
                            onChange={e => setNic(e.target.value)} 
                            value={nic} 
                            type="text" 
                            placeholder="National ID Card" 
                        />
                    </div>
                    
                    {/* Address */}
                    <p className="text-sm font-medium mt-5 mb-2">Address</p>
                    <div className="border px-4 py-2 flex items-center gap-2 rounded-full">
                        <img src={assets.person_icon} alt="" />
                        <input 
                            className="outline-none text-sm w-full" 
                            onChange={e => setStreet(e.target.value)} 
                            value={street} 
                            type="text" 
                            placeholder="Street" 
                        />
                    </div>
                    <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-3">
                        <img src={assets.person_icon} alt="" />
                        <input 
                            className="outline-none text-sm w-full" 
                            onChange={e => setCity(e.target.value)} 
                            value={city} 
                            type="text" 
                            placeholder="City" 
                        />
                    </div>
                    <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-3">
                        <img src={assets.person_icon} alt="" />
                        <input 
                            className="outline-none text-sm w-full" 
                            onChange={e => setProvince(e.target.value)} 
                            value={province} 
                            type="text" 
                            placeholder="Province" 
                        />
                    </div>
                    
                    <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                        <img src={assets.lock_icon} alt="" />
                        <input 
                            className="outline-none text-sm w-full" 
                            onChange={e => setPassword(e.target.value)} 
                            value={password} 
                            type="password" 
                            placeholder="Password" 
                            required
                        />
                    </div>
                </>
            );
        } else if (registrationStep === 2) {
            return (
                <>
                    <div className="mt-5">
                        <p className="text-sm mb-2 font-medium">Your Skills</p>
                        
                        {/* Display added skills */}
                        {skills.length > 0 && (
                            <div className="mb-4">
                                <p className="text-xs mb-1">Added Skills:</p>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {skills.map((skill, index) => (
                                        <div key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center">
                                            {skill.skillName} ({skill.yearsOfExperience} yrs)
                                            <button 
                                                type="button" 
                                                onClick={() => removeSkill(skill.skillName)} 
                                                className="ml-2 text-blue-700 font-bold"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Add new skill */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-xs mb-3 font-medium">Add a new skill:</p>
                            
                            <div className="flex gap-2 mb-3">
                                <select 
                                    className="border px-4 py-2 rounded-full text-sm flex-grow"
                                    value={selectedSkill}
                                    onChange={e => setSelectedSkill(e.target.value)}
                                >
                                    <option value="">Select a skill</option>
                                    {availableSkills.map((skill, index) => (
                                        <option key={index} value={skill}>{skill}</option>
                                    ))}
                                </select>
                            </div>
                            
                            {selectedSkill === 'Other' && (
                                <div className="border px-4 py-2 flex items-center gap-2 rounded-full mb-3">
                                    <input 
                                        className="outline-none text-sm w-full" 
                                        onChange={e => setOtherSkill(e.target.value)} 
                                        value={otherSkill} 
                                        type="text" 
                                        placeholder="Enter your skill" 
                                    />
                                </div>
                            )}
                            
                            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mb-3">
                                <input 
                                    className="outline-none text-sm w-full" 
                                    onChange={e => setSpecificSkills(e.target.value)} 
                                    value={specificSkills} 
                                    type="text" 
                                    placeholder="Specific skills (e.g., Pipe fitting, Fixture installation)" 
                                />
                            </div>
                            
                            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mb-3">
                                <input 
                                    className="outline-none text-sm w-full" 
                                    onChange={e => setYearsOfExperience(e.target.value)} 
                                    value={yearsOfExperience} 
                                    type="number" 
                                    min="0"
                                    placeholder="Years of Experience" 
                                />
                            </div>
                            
                            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mb-3">
                                <input 
                                    className="outline-none text-sm w-full" 
                                    onChange={e => setCertification(e.target.value)} 
                                    value={certification} 
                                    type="text" 
                                    placeholder="Certification (if any)" 
                                />
                            </div>
                            
                            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mb-3">
                                <textarea 
                                    className="outline-none text-sm w-full resize-none" 
                                    onChange={e => setSkillDescription(e.target.value)} 
                                    value={skillDescription} 
                                    rows="2"
                                    placeholder="Brief description of your experience" 
                                />
                            </div>
                            
                            <button 
                                type="button"
                                onClick={addSkill}
                                className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm w-full"
                            >
                                Add Skill
                            </button>
                        </div>
                    </div>
                </>
            );
        } else if (registrationStep === 3) {
            return (
                <>
                    {/* Availability Settings */}
                    <div className="mt-5">
                        <p className="text-sm mb-2 font-medium">Profile Picture</p>
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <label htmlFor="image" className="cursor-pointer">
                                <div className="w-24 h-24 border-2 border-dashed border-blue-300 rounded-full flex items-center justify-center overflow-hidden">
                                    {image ? (
                                        <img 
                                            className="w-full h-full object-cover" 
                                            src={URL.createObjectURL(image)} 
                                            alt="Profile Preview" 
                                        />
                                    ) : (
                                        <div className="text-blue-500 text-xs text-center">
                                            <img src={assets.upload_area} alt="Upload" className="w-8 h-8 mx-auto mb-1" />
                                            Upload Photo
                                        </div>
                                    )}
                                </div>
                                <input 
                                    onChange={e => setImage(e.target.files[0])} 
                                    type="file" 
                                    id='image' 
                                    accept="image/*"
                                    hidden 
                                />
                            </label>
                        </div>
                        
                        <p className="text-sm mb-2 font-medium">Availability</p>
                        <div className="mb-4">
                            <p className="text-xs mb-2">Available Days:</p>
                            <div className="flex flex-wrap gap-2">
                                {daysOfWeek.map((day, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => toggleDay(day)}
                                        className={`px-3 py-1 rounded-full text-xs ${
                                            availableDays.includes(day) 
                                                ? 'bg-blue-600 text-white' 
                                                : 'bg-gray-100 text-gray-700'
                                        }`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <p className="text-xs mb-2">Time Slots:</p>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    className="border px-4 py-2 rounded-full text-sm flex-grow"
                                    placeholder="e.g., 09:00 - 17:00"
                                    value={tempTimeSlot}
                                    onChange={(e) => setTempTimeSlot(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={addTimeSlot}
                                    className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {availableTimeSlots.map((slot, index) => (
                                    <div key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs flex items-center">
                                        {slot}
                                        <button
                                            type="button"
                                            onClick={() => removeTimeSlot(slot)}
                                            className="ml-2 text-blue-700 font-bold"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <p className="text-sm mb-2 font-medium">Service Settings</p>
                        <div className="border px-4 py-2 flex items-center gap-2 rounded-full mb-3">
                            <input 
                                className="outline-none text-sm w-full" 
                                onChange={e => setServiceRadius(e.target.value)} 
                                value={serviceRadius} 
                                type="number" 
                                min="1"
                                placeholder="Service Radius (km)" 
                            />
                        </div>
                        
                        <p className="text-xs mb-2">Your Rates:</p>
                        <div className="border px-4 py-2 flex items-center gap-2 rounded-full mb-3">
                            <input 
                                className="outline-none text-sm w-full" 
                                onChange={e => setHourlyRate(e.target.value)} 
                                value={hourlyRate} 
                                type="number" 
                                min="0"
                                placeholder="Hourly Rate" 
                            />
                        </div>
                        <div className="border px-4 py-2 flex items-center gap-2 rounded-full mb-3">
                            <input 
                                className="outline-none text-sm w-full" 
                                onChange={e => setDayRate(e.target.value)} 
                                value={dayRate} 
                                type="number" 
                                min="0"
                                placeholder="Day Rate" 
                            />
                        </div>
                        <div className="border px-4 py-2 flex items-center gap-2 rounded-full mb-3">
                            <input 
                                className="outline-none text-sm w-full" 
                                onChange={e => setFullRate(e.target.value)} 
                                value={fullRate} 
                                type="number" 
                                min="0"
                                placeholder="Full Project Rate" 
                            />
                        </div>
                    </div>
                </>
            );
        }
    };

    return (
        <div className="absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
            <form onSubmit={onSubmitHandler} className="relative bg-white p-8 rounded-xl text-slate-500 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <h1 className="text-center text-2xl text-neutral-700 font-medium">JobSeeker {state}</h1>
                
                {state === "Login" ? (
                    <p className="text-center">Welcome back! Please sign in to continue</p>
                ) : (
                    <p className="text-center">Step {registrationStep} of 3: {
                        registrationStep === 1 
                            ? 'Personal Information' 
                            : registrationStep === 2 
                                ? 'Skills & Expertise' 
                                : 'Availability & Rates'
                    }</p>
                )}

                {state === "Login" ? (
                    <>
                        <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                            <img src={assets.email_icon} alt="" />
                            <input 
                                className="outline-none text-sm w-full" 
                                onChange={e => setEmail(e.target.value)} 
                                value={email} 
                                type="email" 
                                placeholder="Email Address" 
                                required
                            />
                        </div>
                        <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                            <img src={assets.lock_icon} alt="" />
                            <input 
                                className="outline-none text-sm w-full" 
                                onChange={e => setPassword(e.target.value)} 
                                value={password} 
                                type="password" 
                                placeholder="Password" 
                                required
                            />
                        </div>
                        <p className="text-sm text-blue-600 my-4 cursor-pointer">Forgot password?</p>
                    </>
                ) : (
                    renderRegistrationSteps()
                )}

                <div className="mt-6">
                    {state === "Sign Up" && registrationStep > 1 && (
                        <button 
                            type="button" 
                            onClick={() => setRegistrationStep(registrationStep - 1)}
                            className="bg-gray-300 w-[48%] text-gray-700 py-2 rounded-full mr-[4%]"
                        >
                            Back
                        </button>
                    )}
                    
                    <button 
                        type="submit" 
                        className={`bg-blue-600 ${state === "Sign Up" && registrationStep > 1 ? 'w-[48%]' : 'w-full'} text-white py-2 rounded-full`}
                    >
                        {state === 'Login' 
                            ? 'Login' 
                            : registrationStep < 3 
                                ? 'Next' 
                                : 'Create Account'}
                    </button>
                </div>
                
                {state === 'Login' ? (
                    <p className="mt-5 text-center">Don't have an account? <span className="text-blue-600 cursor-pointer" onClick={() => {setState("Sign Up"); setRegistrationStep(1);}}>Sign Up</span></p>
                
            ) : (
                <p className="mt-5 text-center">Already have an account? <span className="text-blue-600 cursor-pointer" onClick={() => setState("Login")}>Login</span></p>
            )}
            
            <img 
                onClick={() => {
                    if (typeof setShowJobSeekerLogin === 'function') {
                        setShowJobSeekerLogin(false);
                    }
                }} 
                className="absolute top-5 right-5 cursor-pointer" 
                src={assets.cross_icon} 
                alt="" 
            />
        </form>
    </div>
    );
};

export default JobSeekerLoginModal;