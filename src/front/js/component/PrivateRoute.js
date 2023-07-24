import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';

const PrivateRoute = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    token ? <Outlet /> : null
  );
};

export default PrivateRoute;
