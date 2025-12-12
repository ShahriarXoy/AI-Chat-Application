import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import LoginPage from "./LoginPage";

const PrivateRoute = ({ children, fallback = null }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        // Updated style for consistency
        return <div style={{ color: "#007bff", textAlign: "center", marginTop: "20%", fontSize: "20px" }}>Loading...</div>;
    }

    if (user) return children || null;

    if (fallback) return fallback;

    return <LoginPage />;
};

export default PrivateRoute;