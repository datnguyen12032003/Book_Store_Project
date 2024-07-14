import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken, getUserInfo, getGoogleToken } from './Login/app/static';

const PrivateRoute = ({ element, adminOnly, googleBlock }) => {
    const token = getToken() || getGoogleToken();
    const userInfo = getUserInfo();
    const googleToken = getGoogleToken();

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (adminOnly && !userInfo.admin) {
        return <Navigate to="/not-found" />;
    }

    if (googleBlock && googleToken) {
        return <Navigate to="/profile" />;
    }

    return element;
};

export default PrivateRoute;
