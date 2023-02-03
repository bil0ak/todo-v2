import React, { useEffect, useState } from "react";
import {
  googleLogin,
  magicURLLogin,
  phoneLogin,
  verifyPhoneCode,
} from "../../config/appwrite-config";
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

  const [phone, setPhone] = useState(null);
  const [phoneCodeSent, setPhoneCodeSent] = useState(false);
  const [newPhoneUserId, setNewPhoneUserId] = useState(null);
  const [code, setCode] = useState(null);

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handlePhoneLoginBtnClick = (e) => {
    e.preventDefault();

    if (!phone) {
      setError("Phone is required");
      setPhoneCodeSent(false);
      return;
    }

    const promise = phoneLogin(phone);
    promise.then(
      function (response) {
        console.log(response); // Success
        setMessage("Login link sent to your phone");
        setError(null);
        setPhoneCodeSent(true);
        setNewPhoneUserId(response.userId);
      },
      function (error) {
        console.log(error); // Failure
        setError(error.message);
        setPhoneCodeSent(false);
        setNewPhoneUserId(null);
      }
    );
  };

  // if code is sent, disable the phone input and button for 60 seconds
  useEffect(() => {
    if (phoneCodeSent) {
      const phoneInput = document.querySelector(".phone_login_container input");
      const phoneBtn = document.querySelector(".phone_login_container button");
      phoneInput.disabled = true;
      phoneBtn.disabled = true;
      setTimeout(() => {
        phoneInput.disabled = false;
        phoneBtn.disabled = false;
      }, 60000);
    }
  }, [phoneCodeSent]);

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleCodeVerificationBtnClick = (e) => {
    e.preventDefault();

    if (!code) {
      setError("Code is required");
      return;
    }

    const promise = verifyPhoneCode(newPhoneUserId, code);
    promise.then(
      function (response) {
        console.log(response); // Success
        setMessage("Code verified");
        setError(null);
        window.location.href = "/";
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
        <button
          className="login_btn"
          onClick={(e) => handleMagicUrlBtnClick(e)}
        >
          Login
        </button>
      </div>
      <br />
      <div className="phone_login_container">
        <>
          <input
            type="text"
            placeholder="+1 123 456 7890"
            onChange={handlePhoneChange}
          />
          <button
            className="login_btn"
            onClick={(e) => handlePhoneLoginBtnClick(e)}
          >
            Login
          </button>
        </>
      </div>
      <br />
      {phoneCodeSent && (
        <>
          <div className="code_verification_container">
            <input type="text" placeholder="Code" onChange={handleCodeChange} />
            <br />
            <button
              className="login_btn"
              onClick={(e) => handleCodeVerificationBtnClick(e)}
            >
              Verify
            </button>
          </div>
        </>
      )}

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
