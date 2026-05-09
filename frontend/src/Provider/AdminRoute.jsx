import React, { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { Navigate } from 'react-router';

const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    
    if (loading) {
        return <div className="flex justify-center items-center py-20"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    // Only allow specific admin email
    if (user && user?.email === 'tamanna.cse.iubat@gmail.com') {
        return children;
    }

    // Redirect others to home
    return <Navigate to={'/'}></Navigate>
};

export default AdminRoute;
