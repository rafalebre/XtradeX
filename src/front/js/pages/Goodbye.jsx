import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import "./Goodbye.css"; 

const Goodbye = () => {
  const navigate = useNavigate(); 

  const handleBackToHome = () => {
    navigate('/'); 
  };

  return (
    <div className="goodbye-container">
      <h1 className="goodbye-title">You've been logged out.<br/>See you Soon!</h1>
      <button className="goodbye-button" onClick={handleBackToHome}>Back to Home</button>
    </div>
  );
};

export default Goodbye;