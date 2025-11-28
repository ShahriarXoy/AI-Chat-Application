import React from "react";
import "./App.css"; // If you have global styles
import Chat from "./components/Chat"; // <--- This imports the component from Chat.jsx

function App() {
  return (
    <div className="App">
      <Chat />
    </div>
  );
}

export default App;
