import React from 'react';


const LandingPage = ({ user }) => {

  return (
    <div className="container mt-5">
      <h1>Welcome, {user.name}!</h1>
    </div>
  );
};

export default LandingPage;
