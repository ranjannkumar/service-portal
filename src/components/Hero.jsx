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
        <h1>
          Your Trusted <span style={{ color: 'var(--color-secondary)' }}>Service Portal</span>
          <br /> in Patna
        </h1>
        <p>
          Fast, reliable, and online. Apply for government forms, get certificates, 
          and check your application status from home.
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
