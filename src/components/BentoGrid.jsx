import React from 'react';
import ServiceCard from './ServiceCard';
import { GraduationCap, FileText, Briefcase, CreditCard, Printer, Stamp } from 'lucide-react';
import './BentoGrid.css';

const services = [
  {
    icon: FileText,
    title: 'SSC & Govt Forms',
    description: 'Complete application support for SSC, Railways, and other central government exams.',
    className: 'bento-grid-item-large' // Optional: if we want to span
  },
  {
    icon: GraduationCap,
    title: 'B.Ed. Registration',
    description: 'Hassle-free registration and counseling form filling for B.Ed aspirants.'
  },
  {
    icon: Briefcase,
    title: 'UPSC / BPSC',
    description: 'Expert assistance for detailed UPSC and BPSC civil services applications.'
  },
  {
    icon: CreditCard,
    title: 'Pan & Aadhar',
    description: 'Apply for new cards, corrections, or linking services quickly.'
  },
  {
    icon: Printer,
    title: 'Printing & Scanning',
    description: 'High-quality laser printing, color scanning, and large format solutions.'
  },
  {
    icon: Stamp,
    title: 'Certificates',
    description: 'Caste, Income, and Residence certificate applications.'
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
