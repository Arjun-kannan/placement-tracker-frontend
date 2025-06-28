import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext'; // Import the AuthContext

const ProtectedRoute = ({ children, allowedRoles }) => {
    const {token, role} = React.useContext(AuthContext);

    if(!token) {
        // If no token, redirect to login
        return <Navigate to="/login"/>;
    }
    if(!allowedRoles.includes(role)) {
        // If role is not allowed, redirect to home
        console.warn(`Access denied for role: ${role}`);
        return <Navigate to="/"/>;
    }

    return children;
}

export default ProtectedRoute;