import React, { useEffect, useState } from 'react';
import '../css/UserPage.css';

const UserPage = ({ user }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      // Validate user and userId
      if (!user || !user.userId) {
        setError('User ID is not available. Please log in again.');
        return;
      }

      console.log('Fetching details for user ID:', user.userId);

      try {
        const response = await fetch(`http://localhost:5000/api/user/${user.userId}`); // Use user.userId
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched user details:', data);
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
  }, [user]);

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
