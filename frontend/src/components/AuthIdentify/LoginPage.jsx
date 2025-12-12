import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

function LoginPage() {
  const { login } = useContext(AuthContext);

  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const API_BASE = "http://localhost:5000"; // ✅ FIXED

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";

    const payload = isRegister
      ? { username: formData.username, email: formData.email, password: formData.password }
      : { emailOrUsername: formData.username, password: formData.password };

    try {
      const res = await axios.post(`${API_BASE}${endpoint}`, payload); // ✅ FIXED URL

      login(res.data, res.data.token);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  const containerStyle = {
    maxWidth: "400px",
    margin: "100px auto",
    padding: "30px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
    textAlign: "center"
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box"
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    background: isRegister ? "#6f42c1" : "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px"
  };

  return (
    <div style={containerStyle}>
      <h2>{isRegister ? "Create Account" : "Welcome Back"}</h2>

      {error && <p style={{ color: "red", fontSize: "0.9em" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder={isRegister ? "Username" : "Username or Email"}
          value={formData.username}
          onChange={handleChange}
          style={inputStyle}
          required
        />

        {isRegister && (
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        )}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={inputStyle}
          required
        />

        <button type="submit" style={buttonStyle}>
          {isRegister ? "Sign Up" : "Login"}
        </button>
      </form>

      <p style={{ marginTop: "20px", fontSize: "0.9em" }}>
        {isRegister ? "Already have an account? " : "New here? "}
        <span
          onClick={() => { setIsRegister(!isRegister); setError(""); }}
          style={{ color: "#007bff", cursor: "pointer", textDecoration: "underline" }}
        >
          {isRegister ? "Login" : "Register"}
        </span>
      </p>
    </div>
  );
}

export default LoginPage;
