import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import './ServiceCard.css';

const ServiceCard = ({ icon: Icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      className="service-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="card-top">
        <div className="card-icon">
          <Icon size={24} />
        </div>
      </div>
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
      
      {/* Subtle indicator icon */}
      <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', opacity: 0.2 }}>
        <ArrowUpRight size={20} />
      </div>
    </motion.div>
  );
};

export default ServiceCard;
