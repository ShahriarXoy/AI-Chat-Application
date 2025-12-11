// ...existing code...
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function UserProfile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;
        const fetchProfile = async () => {
            try {
                const res = await axios.get("/api/auth/me");
                if (!mounted) return;
                setUser(res.data);
            } catch (err) {
                setError(err?.response?.data?.message || "Could not load profile.");
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetchProfile();
        return () => (mounted = false);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        navigate("/login");
    };

    if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
    if (error) return <div style={{ padding: 20, color: "red" }}>{error}</div>;
    if (!user) return <div style={{ padding: 20 }}>No profile data.</div>;

    return (
        <div style={{ maxWidth: 600, margin: "32px auto", padding: 20, border: "1px solid #ddd", borderRadius: 6 }}>
            <h2 style={{ marginBottom: 8 }}>Your Profile</h2>
            <div style={{ marginBottom: 8 }}><strong>Name:</strong> {user.name}</div>
            <div style={{ marginBottom: 8 }}><strong>Email:</strong> {user.email}</div>
            <div style={{ marginTop: 14 }}>
                <Link to="/profile/edit" style={{ marginRight: 12 }}>Edit profile</Link>
                <button onClick={handleLogout} style={{ padding: "6px 12px" }}>Logout</button>
            </div>
        </div>
    );
}
// ...existing code...