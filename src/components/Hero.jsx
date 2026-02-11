import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 style={{ color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
          Bihar's Most Trusted <span style={{ color: '#fbbf24' }}>Admission Consultancy</span>
        </h1>
        <p style={{ fontSize: '1.2rem', fontWeight: '500', color: '#fbbf24', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
          UP B.ED Special Offer: Total Fee ₹49,000 | Seat Booking ₹5,000
        </p>
        <p style={{ color: '#e2e8f0' }}>
          Online Cyber Center & Photo State - Your one-stop solution for all government forms, 
          cards, and university admissions.
        </p>
        
        <div className="hero-actions">
          <Link to="/status" className="btn btn-primary">
            <Search size={18} />
            Check Application Status
          </Link>
          <a href="#services" className="btn btn-secondary">
            View Services
            <ArrowRight size={18} />
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
