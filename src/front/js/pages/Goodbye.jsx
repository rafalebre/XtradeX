import React from 'react';
import "./Goodbye.css"; // Importando o arquivo CSS criado

const Goodbye = () => {
  return (
    <div className="goodbye-container">
      <h1 className="goodbye-title">You've been logged out.<br/>See you Soon!</h1>
      <button className="goodbye-button">Back to Home</button>
    </div>
  );
};

export default Goodbye;
