import React, { useContext } from "react";
import "./App.css";
import Chat from "./components/Chat";
import LoginPage from "./components/AuthIdentify/LoginPage.jsx";
<<<<<<< HEAD
import { AuthContext } from "./components/AuthIdentify/AuthContext"; 

function App() {
  
  const { user, loading, logout } = useContext(AuthContext);

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="App">
      {user ? (
       
        <div className="chat-container">
          
          <div className="navbar">
            <h3>Chat App</h3>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </div>

          <Chat />
        </div>
      ) : (
        
        <LoginPage />
      )}
=======
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
>>>>>>> e67230f1ad2502e3fceda8b967ed55cbb39fdaa4
    </div>
  );
}

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> e67230f1ad2502e3fceda8b967ed55cbb39fdaa4
