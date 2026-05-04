import React, { use } from 'react';
import { AuthContext } from './AuthProvider';
import { Navigate } from 'react-router';

const PrivateRoute = ({ children }) => {
    const {user} = use(AuthContext);
    console.log(user);
    return children;
};

export default PrivateRoute;