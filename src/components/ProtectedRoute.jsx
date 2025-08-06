import React from 'react';
import { useAuth } from './AuthContext';
import Login from '../pages/Login';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? children : <Login />;
};

export default ProtectedRoute;