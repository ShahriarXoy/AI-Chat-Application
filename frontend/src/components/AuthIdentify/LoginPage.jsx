import React from "react";
import "./loginpage.css";


import userIcon from "../../assets/user-icon.png";
import emailIcon from "../../assets/email-icon.jpg";
import passwordIcon from "../../assets/password-icon.png";

const LoginPage = () => {
  return (
    <div className="container">
      <div className="header">
        <div className="text">Sign Up</div>
        <div className="underline"></div>
      </div>

      <div className="inputs">
        <div className="input">
          <img className="icon" src={userIcon} alt="User" />
          <input type="text" />
        </div>
      </div>

      <div className="inputs">
        <div className="input">
          <img className="icon" src={emailIcon} alt="Email" />
          <input type="email" />
        </div>
      </div>

      <div className="inputs">
        <div className="input">
          <img className="icon" src={passwordIcon} alt="Password" />
          <input type="password" />
        </div>
      </div>

      <div className="forget-password">
        Forgot Password ? <span>Click Here!</span>
      </div>

      <div className="submit-container">
        <div className="submit">Sign Up</div>
        <div className="submit">Login</div>
      </div>
    </div>
  );
};

export default LoginPage;
