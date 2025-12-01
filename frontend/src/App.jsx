import React from "react";
import "./App.css";
import Chat from "./components/Chat";
import LoginPage from "./components/AuthIdentify/LoginPage.jsx";
import { AuthContext } from "./components/AuthIdentify/AuthContext"; // Correct Path

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div style={{ color: "white", textAlign: "center", marginTop: "20%"}}>Loading...</div>;
  }


  return (
    <div className="App">
      {/* Logic: If User exists, show Chat. If not, show Login */}
      {user ? <Chat /> : <LoginPage />}
    </div>
  );
}

export default App;
