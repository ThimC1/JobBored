import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import personIcon from '../assets/person_icon.svg';
// import editIcon from '../assets/edit_icon.svg';
// import starIcon from '../assets/assets.js'; // Assuming you have a star icon in assets.js
// import suitcaseIcon from '../assets/suitcase_icon.svg';
// import moneyIcon from '../assets/money_icon.svg';
import Loading from '../components/Loading';

const JobSeekerDashBoard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    rating: 4.8,
    status: 'Available', // Can be 'Available', 'Busy', or 'Offline'
    nextJob: {
      title: 'Home Plumbing Repair',
      date: '2025-05-23',
      address: '123 Main St, Anytown',
      client: 'Alice Smith'
    },
    earnings: {
      thisMonth: 1240,
      total: 8750
    },
    skills: ['Plumbing', 'Electrical Repair', 'Painting'],
    ratings: [
      { client: 'David Brown', rating: 5, comment: 'Excellent service, very professional', date: '2025-05-15' },
      { client: 'Sarah Johnson', rating: 4, comment: 'Good work but arrived a bit late', date: '2025-05-10' },
      { client: 'Michael Chen', rating: 5, comment: 'Went above and beyond!', date: '2025-05-03' }
    ],
    warnings: {
      declinedJobs: 1,
      lateArrivals: 0
    },
    availability: {
      monday: { available: true, hours: '9:00 AM - 5:00 PM' },
      tuesday: { available: true, hours: '9:00 AM - 5:00 PM' },
      wednesday: { available: true, hours: '9:00 AM - 5:00 PM' },
      thursday: { available: true, hours: '9:00 AM - 5:00 PM' },
      friday: { available: true, hours: '9:00 AM - 5:00 PM' },
      saturday: { available: false, hours: '' },
      sunday: { available: false, hours: '' }
    }
  });

  // Simulate loading data
  useEffect(() => {
    // This would be replaced with an actual API call
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const toggleStatus = () => {
    setUserData(prev => ({
      ...prev,
      status: prev.status === 'Available' ? 'Offline' : 'Available'
    }));
  };

  const renderStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <span key={index} className={`text-yellow-500 text-xl ${
            index < fullStars ? 'font-bold' : 
            (index === fullStars && hasHalfStar ? 'opacity-60' : 'opacity-20')
          }`}>
            ★
          </span>
        ))}
        <span className="ml-2 font-semibold">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <img src="" alt="Profile" className="w-8 h-8" />
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold">Welcome, {userData.name}</h1>
            <p className="text-gray-600">Skilled Professional</p>
          </div>
        </div>
        <button 
          onClick={handleEditProfile}
          className="flex items-center bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-md"
        >
          <img src="" alt="Edit" className="w-4 h-4 mr-2" />
          Edit Profile
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Status</h2>
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              userData.status === 'Available' ? 'bg-green-100 text-green-800' :
              userData.status === 'Busy' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {userData.status}
            </span>
            <button 
              onClick={toggleStatus}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Toggle Status
            </button>
          </div>
        </div>

        {/* Rating Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Rating</h2>
          {renderStarRating(userData.rating)}
          <p className="text-sm text-gray-500 mt-2">Based on {userData.ratings.length} reviews</p>
        </div>

        {/* Next Job Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Next Job</h2>
          {userData.nextJob ? (
            <div>
              <h3 className="font-medium">{userData.nextJob.title}</h3>
              <p className="text-sm text-gray-600">
                <span className="block mt-1">Date: {new Date(userData.nextJob.date).toLocaleDateString()}</span>
                <span className="block mt-1">Client: {userData.nextJob.client}</span>
                <span className="block mt-1">Address: {userData.nextJob.address}</span>
              </p>
            </div>
          ) : (
            <p className="text-gray-500">No upcoming jobs scheduled</p>
          )}
        </div>
      </div>

      {/* Detailed Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Ratings and Feedback */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Ratings & Feedback</h2>
          {userData.ratings.length > 0 ? (
            <div className="space-y-4">
              {userData.ratings.map((review, index) => (
                <div key={index} className="border-b pb-3 last:border-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{review.client}</span>
                    <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                  <div className="my-1">
                    {renderStarRating(review.rating)}
                  </div>
                  <p className="text-gray-700 text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No reviews yet</p>
          )}
        </div>

        {/* Performance and Warnings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Performance & Warnings</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Declined Jobs:</span>
              <span className={`font-medium ${userData.warnings.declinedJobs >= 3 ? 'text-red-600' : 'text-gray-700'}`}>
                {userData.warnings.declinedJobs}/3
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Late Arrivals:</span>
              <span className="font-medium text-gray-700">{userData.warnings.lateArrivals}</span>
            </div>
            <div className="mt-4 p-3 rounded bg-blue-50">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Declining more than 3 bookings will lower your ranking in search results.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Skill Management */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Skill Management</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {userData.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-800">
            Add New Skill
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Don't see your skill? Contact support to add it to our database.
          </p>
        </div>

        {/* Availability Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Availability Settings</h2>
          <div className="space-y-2">
            {Object.entries(userData.availability).map(([day, value]) => (
              <div key={day} className="flex justify-between items-center">
                <span className="capitalize">{day}</span>
                <span className={value.available ? 'text-green-600' : 'text-gray-400'}>
                  {value.available ? value.hours : 'Not Available'}
                </span>
              </div>
            ))}
          </div>
          <button className="mt-4 text-sm text-blue-600 hover:text-blue-800">
            Modify Availability
          </button>
        </div>

        {/* Earnings Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Earnings Summary</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">This Month</p>
              <p className="text-xl font-bold">${userData.earnings.thisMonth.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600">Total Earnings</p>
              <p className="text-xl font-bold">${userData.earnings.total.toFixed(2)}</p>
            </div>
            <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md">
              View Payment History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashBoard;