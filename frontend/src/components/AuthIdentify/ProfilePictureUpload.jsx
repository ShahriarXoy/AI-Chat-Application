import React, { useState } from "react";
import axios from "axios";

function ProfilePictureUpload({ currentPicture, onSuccess }) {
  const [preview, setPreview] = useState(currentPicture || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("File size must be less than 2MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Read file as Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!preview) {
      setError("Please select an image");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("❌ No authentication token found. Please login again.");
        setLoading(false);
        return;
      }

      console.log("📤 Uploading picture with token:", token.substring(0, 20) + "...");
      
      const res = await axios.post(
        "http://localhost:5000/api/users/upload-picture",
        { profilePicture: preview },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Picture uploaded successfully:", res.data);
      setError(null);
      if (onSuccess) onSuccess(res.data.user);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to upload picture";
      const fullError = err.response?.status 
        ? `(${err.response.status}) ${errorMsg}` 
        : errorMsg;
      
      console.error("❌ Upload failed:", fullError);
      console.error("Full error:", err);
      setError(`Failed: ${fullError}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "15px",
      padding: "20px",
      borderRadius: "12px",
      background: "#f8f9fa",
      border: "1px solid #e0e0e0",
    }}>
      {/* Preview */}
      <div style={{
        width: "100px",
        height: "100px",
        borderRadius: "50%",
        background: "#e0e0e0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(111, 66, 193, 0.2)",
      }}>
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ fontSize: "40px" }}>📷</span>
        )}
      </div>

      {/* File Input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={loading}
        style={{
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #ddd",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      />

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={loading || !preview}
        style={{
          padding: "10px 20px",
          background: loading ? "#ccc" : "linear-gradient(135deg, #6f42c1 0%, #5a369e 100%)",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: loading || !preview ? "not-allowed" : "pointer",
          fontWeight: "600",
          transition: "all 0.3s ease",
        }}
      >
        {loading ? "⏳ Uploading..." : "✅ Save Picture"}
      </button>

      {/* Error Message */}
      {error && (
        <div style={{
          color: "#d32f2f",
          fontSize: "14px",
          textAlign: "center",
          background: "#ffebee",
          padding: "10px",
          borderRadius: "6px",
          width: "100%",
        }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default ProfilePictureUpload;
