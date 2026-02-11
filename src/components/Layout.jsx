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
        <p>© 2024 Patna Computer Shop. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
