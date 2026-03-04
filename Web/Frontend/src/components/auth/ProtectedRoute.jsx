import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles = [] }) => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    const userString = localStorage.getItem('USER');
    const user = userString ? JSON.parse(userString) : null;

    if (!token || !user) {
        // Not logged in
        return <Navigate to="/auth/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Logged in but doesn't have the required role
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
