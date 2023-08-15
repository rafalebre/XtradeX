import React from 'react';
import "./About.css";
import About3 from "../../img/About2.png";

const About = () => {
  return (
    <div className="about-container">
      <img src={About3} alt="About Us" className="about-image" />
    </div>
  );
};

export default About;
