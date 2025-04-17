import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-page">
      <h1>About WavyBoard</h1>
      <div className="about-content">
        <section className="mission">
          <h2>Our Mission</h2>
          <p>
            At WavyBoard, we're dedicated to revolutionizing the way people experience audio content.
            Our mission is to provide a seamless platform for text-to-speech conversion and audio
            content management, making information more accessible to everyone.
          </p>
        </section>

        <section className="values">
          <h2>Our Values</h2>
          <ul>
            <li>Accessibility: Making content available to everyone</li>
            <li>Innovation: Constantly improving our technology</li>
            <li>Quality: Delivering the best user experience</li>
            <li>Community: Building a platform for users to connect</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AboutUs; 