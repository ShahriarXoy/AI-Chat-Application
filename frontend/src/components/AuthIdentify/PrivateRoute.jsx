import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import LoginPage from "./LoginPage";

const PrivateRoute = ({ children, fallback = null }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div style={{ color: "white", textAlign: "center", marginTop: "20%" }}>Loading...</div>;
    }

    if (user) return children || null;

    if (fallback) return fallback;

    return <LoginPage />;
};

export default PrivateRoute;