import React from 'react';
import './AboutSection.css';

const AboutSection = () => {
  return (
    <section className="about-section">
      <div className="about-container">
        
        {/* Left: Video */}
        <div className="about-video-wrapper">
          <h2 className="section-title">Director's Message</h2>
          <div className="video-container">
            <video 
              controls 
              className="about-video"
            >
              <source src="/owner_video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Right: Owner Profile */}
        <div className="about-profile-wrapper">
          <div className="profile-card">
            <img src="/Shop_owner.png" alt="Shop Director" className="profile-image" />
            <div className="profile-content">
              <h3>Meet the Director</h3>
              <p className="director-title">Founder, Online Cyber Center</p>
              <p className="director-message">
                "We are committed to providing the most reliable and affordable admission consultancy 
                and online services in Bihar. Your career dreams are our priority."
              </p>
              <div className="trust-badges">
                <span className="badge">10+ Years Experience</span>
                <span className="badge">Verified Consulting</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
