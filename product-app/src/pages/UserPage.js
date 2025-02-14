import React, { useEffect, useState } from 'react';
import '../css/UserPage.css';

const UserPage = ({ userId: propUserId }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState('');

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = propUserId || storedUser?.user?.id;
  useEffect(() => {

    const fetchUserDetails = async () => {
      // Validate user and userId
      if (!userId ) {
        setError('User ID is not available. Please log in again.');
        return;
      }


      try {
        const response = await fetch(`http://localhost:5000/api/user/${userId}`); 
        if (response.ok) {
          const data = await response.json();
          setUserDetails(data);
        } else {
          console.error('Failed to fetch user details. Status:', response.status);
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch user details.');
        }
      } catch (error) {
        console.error('Error fetching user details:', error.message);
        setError('Error fetching user details. Please try again later.');
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!userDetails) {
    return <p>Loading user information...</p>;
  }

  return (
    <div className="user-page">
      <h1>User Information</h1>
      <div className="user-details">
        <p><strong>Name:</strong> {userDetails.name}</p>
        <p><strong>Email:</strong> {userDetails.email}</p>
        <p><strong>Address:</strong> {userDetails.address || 'No address provided'}</p>
        <p><strong>Role:</strong> {userDetails.role}</p>
      </div>
    </div>
  );
};

export default UserPage;
