import React from "react";
import { googleLogin } from "../../config/appwrite-config";
import "./login.css";

export default function Login() {
  const handleSignInBtnClick = () => {
    googleLogin();
  };

  return (
    <div className="login">
      <button onClick={handleSignInBtnClick} className="login_btn">
        <i className="fa fa-google"></i> Sign in with Google
      </button>
    </div>
  );
}
