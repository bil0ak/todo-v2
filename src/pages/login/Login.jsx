import React, { useEffect, useState } from "react";
import { googleLogin, magicURLLogin } from "../../config/appwrite-config";
import "./login.css";

export default function Login() {
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSignInBtnClick = () => {
    googleLogin();
  };

  const [email, setEmail] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleMagicUrlBtnClick = (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    const promise = magicURLLogin(email);
    promise.then(
      function (response) {
        console.log(response); // Success
        setMessage("Login link sent to your email");
        setError(null);
      },
      function (error) {
        console.log(error); // Failure
        setError(error.message);
      }
    );
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");
    if (error === "failure") {
      setError("Login failed");
    }
  }, []);

  return (
    <div className="login">
      <button onClick={handleSignInBtnClick} className="login_btn">
        <i className="fa fa-google"></i> Sign in with Google
      </button>
      <div className="magic_url_login_container">
        <input type="text" placeholder="Email" onChange={handleEmailChange} />
        <br />
        <button
          className="login_btn"
          onClick={(e) => handleMagicUrlBtnClick(e)}
        >
          Login
        </button>
      </div>
      <br />
      <span className="message">
        {message && (
          <>
            <i className="fa fa-check"></i>
            {message}
          </>
        )}
      </span>
      <br />
      <span className="error">
        {error && (
          <>
            <i className="fa fa-exclamation-triangle"></i>
            {error}
          </>
        )}
      </span>
    </div>
  );
}
