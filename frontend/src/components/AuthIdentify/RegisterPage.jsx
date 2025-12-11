import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function RegisterPage() {
    const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const onChange = (e) => {
        setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
        setError("");
    };

    const validate = () => {
        if (!form.name.trim() || !form.email.trim() || !form.password) {
            setError("All fields are required.");
            return false;
        }
        if (form.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return false;
        }
        if (form.password !== form.confirm) {
            setError("Passwords do not match.");
            return false;
        }
        return true;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await axios.post("/api/auth/register", {
                name: form.name,
                email: form.email,
                password: form.password,
            });
            navigate("/login");
        } catch (err) {
            setError(err?.response?.data?.message || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 420, margin: "40px auto", padding: 20, border: "1px solid #ddd", borderRadius: 6 }}>
            <h2 style={{ marginBottom: 12 }}>Create an account</h2>
            {error && <div style={{ color: "white", background: "#e74c3c", padding: 8, borderRadius: 4, marginBottom: 12 }}>{error}</div>}
            <form onSubmit={onSubmit}>
                <div style={{ marginBottom: 10 }}>
                    <label style={{ display: "block", marginBottom: 6 }}>Name</label>
                    <input name="name" value={form.name} onChange={onChange} autoComplete="name" style={{ width: "100%", padding: 8 }} />
                </div>
                <div style={{ marginBottom: 10 }}>
                    <label style={{ display: "block", marginBottom: 6 }}>Email</label>
                    <input name="email" value={form.email} onChange={onChange} type="email" autoComplete="email" style={{ width: "100%", padding: 8 }} />
                </div>
                <div style={{ marginBottom: 10 }}>
                    <label style={{ display: "block", marginBottom: 6 }}>Password</label>
                    <input name="password" value={form.password} onChange={onChange} type="password" autoComplete="new-password" style={{ width: "100%", padding: 8 }} />
                </div>
                <div style={{ marginBottom: 14 }}>
                    <label style={{ display: "block", marginBottom: 6 }}>Confirm Password</label>
                    <input name="confirm" value={form.confirm} onChange={onChange} type="password" autoComplete="new-password" style={{ width: "100%", padding: 8 }} />
                </div>
                <button type="submit" disabled={loading} style={{ width: "100%", padding: 10 }}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
            <div style={{ marginTop: 12, fontSize: 14 }}>
                Already have an account? <Link to="/login">Login</Link>
            </div>
        </div>
    );
}