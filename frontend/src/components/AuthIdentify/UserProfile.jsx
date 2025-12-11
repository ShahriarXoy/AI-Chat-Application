import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";

const UserProfile = () => {
	const { user, logout } = useContext(AuthContext);

	if (!user) return null;

	const initials = (() => {
		const name = user.name || user.username || "";
		return name
			.split(" ")
			.map((n) => n[0])
			.slice(0, 2)
			.join("")
			.toUpperCase();
	})();

	const handleLogout = () => {
		logout();
		try {
			window.location.href = "/login";
		} catch (e) {
			// noop
		}
	};

	return (
		<div className="user-profile" style={{ display: "flex", alignItems: "center", gap: 12 }}>
			<div
				className="avatar"
				style={{
					width: 48,
					height: 48,
					borderRadius: "50%",
					background: "#ddd",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontWeight: 600,
				}}
			>
				{user.avatar || user.profilePic ? (
					<img src={user.avatar || user.profilePic} alt="avatar" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
				) : (
					<span>{initials}</span>
				)}
			</div>

			<div className="user-info" style={{ display: "flex", flexDirection: "column" }}>
				<span style={{ fontWeight: 700 }}>{user.name || user.username || "User"}</span>
				{user.email && <span style={{ fontSize: 12, color: "#666" }}>{user.email}</span>}
			</div>

			<div style={{ marginLeft: "auto" }}>
				<button onClick={handleLogout} style={{ padding: "6px 10px" }}>
					Logout
				</button>
			</div>
		</div>
	);
};

export default UserProfile;
