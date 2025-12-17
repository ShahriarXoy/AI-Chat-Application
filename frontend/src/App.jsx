import React, { useContext } from "react";
import "./App.css";
import Chat from "./components/Chat";
import LoginPage from "./components/AuthIdentify/LoginPage.jsx";
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
    </div>
  );
}

export default App;
