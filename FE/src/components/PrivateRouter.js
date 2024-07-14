import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken, getUserInfo, getGoogleToken } from './Login/app/static';

const PrivateRoute = ({ element, adminOnly }) => {
    const token = getToken() || getGoogleToken();
    const userInfo = getUserInfo();

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (adminOnly && !userInfo.admin) {
        return <Navigate to="/not-found" />;
    }

    return element;
};

export default PrivateRoute;
