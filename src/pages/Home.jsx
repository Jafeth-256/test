import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Dashboard from './Dashboard'; // Import the new Dashboard component
import '../styles/custom.css';

const Home = () => {
  return (
    <div className="app-layout bg-light">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Contenido principal */}
      <div className="main-content">
        {/* Header */}
        <Header />
        
        {/* Área de contenido */}
        <div className="content-area">
          <div className="container-fluid p-4">
            <Dashboard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;