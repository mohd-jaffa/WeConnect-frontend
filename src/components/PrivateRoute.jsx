import UserContext from "@/context/UserContext";
import NotFound from "@/pages/NotFound";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, allowedRoles }) {
    const { user, isLoggedIn } = useContext(UserContext);

    const id = localStorage.getItem("token");
    if (id && !isLoggedIn) {
        return <p>Loading...</p>;
    } else if (id && allowedRoles.includes(user.role)) {
        return children;
    } else if (id && !allowedRoles.includes(user.role)) {
        return <NotFound />;
    } else {
        return <Navigate to="/login" replace />;
    }
}
