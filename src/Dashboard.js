import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProtectedRoute = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://dc91-183-83-230-172.ngrok-free.app/protected', {
          headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': true },
        });
        setMessage(response.data.message);
      } catch {
        setMessage('Forbidden: You do not have access to this page.');
      }
    };

    fetchProtectedRoute();
  }, []);

  return (
    <div className="container mt-5">
      <h1>Dashboard</h1>
      <p>{message}</p>
    </div>
  );
};

export default Dashboard;
