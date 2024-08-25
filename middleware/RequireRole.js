import { useLocation, Navigate, Outlet, useParams } from "react-router-dom";

import useAuth from "../hooks/useAuth";


const RequireRole = ({allowedRoles}) => {
    const { auth } = useAuth();
    const location = useLocation();
    const { client } = useParams();

    return (
        
        allowedRoles?.includes(auth?.roles)
            ? <Outlet />
            : auth?.userData
                ? <Navigate to={"/unauthorized"} state={{ from: location }} replace />
                : <Navigate to={"/login"} state={{ from: location }} replace />
       
    )
}

export default RequireRole;