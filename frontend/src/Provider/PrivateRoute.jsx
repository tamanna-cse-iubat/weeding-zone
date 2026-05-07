import React, {  useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { Navigate } from 'react-router';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    console.log(user);
    
    if (loading) {
        return <div className="flex justify-center items-center py-20"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    if (user && user?.email === 'tamanna.cse.iubat@gmail.com') {
        return children;
    }
    if (user && user?.email) {
        return <Navigate to={'/customer-dashboard'}></Navigate>
    }
    return <Navigate to={'/'}></Navigate>
};

export default PrivateRoute;