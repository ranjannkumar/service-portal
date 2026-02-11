import React from 'react';
import ServiceCard from './ServiceCard';
import { GraduationCap, FileText, Briefcase, CreditCard, Printer, Stamp } from 'lucide-react';
import './BentoGrid.css';

const services = [
  {
    icon: GraduationCap,
    title: 'UP B.Ed Admission',
    description: 'Special Package: Total Fee ₹59,000. Seat Booking only ₹10,000. 100% Trusted.',
    className: 'bento-grid-item-large'
  },
  {
    icon: CreditCard,
    title: 'Pan Card & Aadhar',
    description: 'New Pan Card, Corrections, Aadhar Printing, and Linking services.'
  },
  {
    icon: FileText,
    title: 'Passport & VIsa',
    description: 'Apply for Passport online. Fast and reliable service.'
  },
  {
    icon: Briefcase,
    title: 'Job Applications',
    description: 'SSC, BPSC, Railways, Army, and all other government job forms.'
  },
  {
    icon: Printer,
    title: 'Printing & Xerox',
    description: 'High-quality Color/BW Printing, Photo State, Lamination, and Scanning.'
  },
  {
    icon: Stamp,
    title: 'Certificates',
    description: 'Caste, Income, Residence, Birth, and Death certificates.'
  }
];

const BentoGrid = () => {
  return (
    <div className="bento-grid">
      {services.map((service, index) => (
        <div key={index} className={service.className || ''}>
          <ServiceCard 
            icon={service.icon}
            title={service.title}
            description={service.description}
            delay={index * 0.1}
          />
        </div>
      ))}
    </div>
  );
};

export default BentoGrid;
