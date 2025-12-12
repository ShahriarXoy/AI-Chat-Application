import React, { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom"; 
import ProfilePictureUpload from "./ProfilePictureUpload";
import "./UserProfile.css";

const UserProfile = () => {
	const { user, logout } = useContext(AuthContext);
	const navigate = useNavigate();
	const [showPictureUpload, setShowPictureUpload] = useState(false);
	const [userProfile, setUserProfile] = useState(user);

	if (!userProfile) return null;

	// Helper function to generate initials
	const initials = (() => {
		const name = userProfile.name || userProfile.username || "";
		return name
			.split(" ")
			.map((n) => n[0])
			.slice(0, 2)
			.join("")
			.toUpperCase();
	})();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const handlePictureUploadSuccess = (updatedUser) => {
		setUserProfile(updatedUser);
		setShowPictureUpload(false);
	};

	return (
		<div className="user-profile-container">
			{/* Avatar with Click to Upload */}
			<div 
				className="avatar"
				onClick={() => setShowPictureUpload(!showPictureUpload)}
				style={{ cursor: "pointer", position: "relative" }}
			>
				{userProfile.profilePicture ? (
					<img src={userProfile.profilePicture} alt="avatar" className="avatar-img" />
				) : (
					<span className="avatar-initials">{initials}</span>
				)}
				<span style={{
					position: "absolute",
					bottom: 0,
					right: 0,
					background: "#6f42c1",
					color: "white",
					borderRadius: "50%",
					width: "30px",
					height: "30px",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontSize: "16px",
				}}>📸</span>
			</div>

			{/* Picture Upload Modal */}
			{showPictureUpload && (
				<div style={{
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: "rgba(0, 0, 0, 0.5)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					zIndex: 1000,
				}}>
					<div style={{
						background: "white",
						padding: "25px",
						borderRadius: "12px",
						boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
						maxWidth: "400px",
						width: "90%",
					}}>
						<h3 style={{ margin: "0 0 20px 0", color: "#1a1a1a" }}>Update Profile Picture</h3>
						<ProfilePictureUpload 
							currentPicture={userProfile.profilePicture}
							onSuccess={handlePictureUploadSuccess}
						/>
						<button
							onClick={() => setShowPictureUpload(false)}
							style={{
								width: "100%",
								marginTop: "15px",
								padding: "10px",
								background: "#f0f0f0",
								border: "none",
								borderRadius: "6px",
								cursor: "pointer",
								fontWeight: "600",
							}}
						>
							Close
						</button>
					</div>
				</div>
			)}

			<div className="user-info">
				<span className="user-name">{userProfile.name || userProfile.username || "User"}</span>
				{userProfile.email && <span className="user-email">{userProfile.email}</span>}
			</div>

			<div className="logout-section">
				<button onClick={handleLogout} className="logout-button">
					Logout
				</button>
			</div>
		</div>
	);
};

export default UserProfile;
