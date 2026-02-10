
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Wait for auth check to complete
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-text-secondary">Verificando sesión...</p>
                </div>
            </div>
        );
    }

    // If not authenticated, redirect to login with return path
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // User is authenticated, render the protected component
    return children;
};

export default ProtectedRoute;
