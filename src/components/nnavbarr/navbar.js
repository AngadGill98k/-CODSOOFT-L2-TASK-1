import React from 'react';
import './nav.css';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate('/home')}>JobConnect</div>
      <div className="nav-buttons">
        <button className="nav-btn" onClick={() => navigate('/home')}>Home</button>
        <button className="nav-btn" onClick={() => navigate('/create')}>Create a Post</button>
        <button className="nav-btn" onClick={() => navigate('/dashboard')}>User</button>
      </div>
    </nav>
  );
};

export default Navbar;
