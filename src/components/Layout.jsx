import React from 'react';
import Navbar from './Navbar';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">
        <div className="footer-image-container" style={{ maxWidth: '300px', margin: '0 auto 1rem' }}>
          <img src="/footer.png" alt="Footer Branding" style={{ width: '100%', height: 'auto' }} />
        </div>
        <div className="footer-content">
          <p>© 2024 Online Cyber Center. All rights reserved.</p>
          <p><strong>Address:</strong> Chandmari, Motihari (Near Ram Sharan Gate)</p>
          <p><strong>Contact:</strong> 7321000215, 7635066677</p>
          <p><strong>Email:</strong> onlinecybercenter111@gmail.com</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
