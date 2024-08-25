import React, { useEffect } from "react";
import { useLocation, Navigate, Outlet, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import jwt_decode from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { setLogout } from '../state/AuthState';

const RequireAuth = () => {
    const { auth } = useAuth();
    const location = useLocation();
    const { client } = useParams();
    const dispatch = useDispatch();

    // useEffect(() => {
    //     // Check authentication conditions and dispatch logout if needed
    //     if (!auth || !auth.token || auth.roles === "VENDOR" || auth?.userData?.stageCount !== 5 || auth.allData.isOrgDisable|| auth.allData.isUserDisable) {
    //         dispatch(setLogout());
    //     }
    // }, [auth, dispatch]);

    if (!auth || !auth.token || auth.roles === "VENDOR" || auth?.userData?.stageCount !== 5 || auth.allData.isOrgDisable || auth.allData.isUserDisable) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const payloadToken = jwt_decode(auth.token);
    const isTokenExpired = Date.now() >= payloadToken.exp * 1000;

    if (!isTokenExpired) {
        if (auth.companyName.toLowerCase() === client.toLowerCase()) {
            return <Outlet />;
        } else {
            dispatch(setLogout());
            return <Navigate to="/login" state={{ from: location }} replace />;
        }
    } else {
        dispatch(setLogout());
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
};

export default RequireAuth;
