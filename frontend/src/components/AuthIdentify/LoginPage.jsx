import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { auth, googleProvider } from "../../firebaseConfig";
import {
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

function LoginPage() {
  const { login } = useContext(AuthContext);

  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "", // Required for Firebase
    password: "",
  });
  const [error, setError] = useState("");

  const API_BASE = "http://localhost:5000";

  // --- 1. HANDLE GOOGLE REDIRECT (Keep existing logic) ---
  useEffect(() => {
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const user = result.user;
          await syncWithBackend(user);
        }
      } catch (err) {
        console.error("Redirect Login Error:", err);
      }
    };
    checkRedirect();
  }, []);

  // --- 2. HELPER: Sync Firebase User with Your Backend ---
  const syncWithBackend = async (firebaseUser) => {
    try {
      // We reuse the /google route because it does exactly what we want:
      // "Find user by email, or create if missing, then give me a Token"
      const res = await axios.post(`${API_BASE}/api/auth/google`, {
        name: firebaseUser.displayName || formData.username || "User",
        email: firebaseUser.email,
        profilePicture: firebaseUser.photoURL,
        googleId: firebaseUser.uid, // We link the Firebase UID
      });

      login(res.data, res.data.token);
    } catch (err) {
      console.error("Backend Sync Error:", err);
      setError("Login successful, but server sync failed.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 3. NEW: Handle Email/Password Login via Firebase ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let userCredential;

      if (isRegister) {
        // A. REGISTER: Create account in Firebase
        userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        // Add Name to Firebase Profile
        await updateProfile(userCredential.user, {
          displayName: formData.username,
        });
      } else {
        // B. LOGIN: Authenticate with Firebase
        // Note: Firebase requires EMAIL, not Username
        userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
      }

      // C. Sync with MongoDB
      await syncWithBackend(userCredential.user);
    } catch (err) {
      console.error("Auth Error:", err);
      // Firebase error codes are helpful, let's show them
      if (err.code === "auth/email-already-in-use") {
        setError("That email is already taken.");
      } else if (err.code === "auth/invalid-credential") {
        setError("Incorrect email or password.");
      } else {
        setError(err.message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (err) {
      setError("Failed to initialize Google Login.");
    }
  };

  // --- STYLES ---
  const containerStyle = {
    maxWidth: "400px",
    margin: "100px auto",
    padding: "30px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  };
  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
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
    marginTop: "10px",
  };
  const googleBtnStyle = {
    ...buttonStyle,
    background: "#db4437",
    marginTop: "10px",
  };

  return (
    <div style={containerStyle}>
      <h2>{isRegister ? "Create Account" : "Welcome Back"}</h2>
      {error && <p style={{ color: "red", fontSize: "0.9em" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Username is only for Registration display name */}
        {isRegister && (
          <input
            type="text"
            name="username"
            placeholder="Display Name"
            value={formData.username}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        )}

        {/* Firebase requires EMAIL for login */}
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          style={inputStyle}
          required
        />

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

      <div style={{ display: "flex", alignItems: "center", margin: "15px 0" }}>
        <div style={{ flex: 1, height: "1px", background: "#ddd" }}></div>
        <span style={{ padding: "0 10px", color: "#888", fontSize: "12px" }}>
          OR
        </span>
        <div style={{ flex: 1, height: "1px", background: "#ddd" }}></div>
      </div>

      <button onClick={handleGoogleLogin} style={googleBtnStyle} type="button">
        Sign in with Google
      </button>

      <p style={{ marginTop: "20px", fontSize: "0.9em" }}>
        {isRegister ? "Already have an account? " : "New here? "}
        <span
          onClick={() => {
            setIsRegister(!isRegister);
            setError("");
          }}
          style={{
            color: "#007bff",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          {isRegister ? "Login" : "Register"}
        </span>
      </p>
    </div>
  );
}

export default LoginPage;
