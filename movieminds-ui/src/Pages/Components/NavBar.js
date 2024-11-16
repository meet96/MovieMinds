import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import "./styles/NavBarStyles.css";
import Logo from "./images/Logo2.png";

const NavBar = ({ isHome }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const popupRef = useRef(null);
  const profileMenuRef = useRef(null);
  const gitRepoLink = "https://github.com/meet96/MovieMinds";
  const apiUrl =
    process.env.REACT_APP_API_BASE_URL || window._env_.REACT_APP_API_BASE_URL;

  const handleLoginClick = () => {
    setShowLogin(!showLogin);
    setShowRegister(false);
    setShowProfileMenu(false);
    setErrorMsg(""); // Clear any previous error messages
  };

  const handleRegisterClick = () => {
    setShowRegister(!showRegister);
    setShowLogin(false);
    setShowProfileMenu(false);
    setErrorMsg(""); // Clear any previous error messages
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowLogin(false);
    setShowRegister(false);
    setErrorMsg(""); // Clear any previous error messages
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowProfileMenu(false);
    setErrorMsg(""); // Clear any previous error messages
  };

  const handleClickOutside = (event) => {
    if (
      (popupRef.current && !popupRef.current.contains(event.target)) ||
      (profileMenuRef.current && !profileMenuRef.current.contains(event.target))
    ) {
      setShowLogin(false);
      setShowRegister(false);
      setShowProfileMenu(false);
      setErrorMsg(""); // Clear any previous error messages
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    if (!username || !password) {
      setErrorMsg("All fields are required.");
      return;
    }

    const response = await fetch(`${apiUrl}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: username, password }),
    });

    const data = await response.json();
    if (data.token) {
      // Save the token (you might want to use localStorage or a state management library)
      console.log("Login successful:", data.token);
      setIsLoggedIn(true);
      setShowLogin(false);
      setErrorMsg(""); // Clear error message
    } else {
      setErrorMsg("Error occurred: " + data.error);
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const gender = event.target.gender.value;

    if (!name || !email || !password || !gender) {
      setErrorMsg("All fields are required.");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMsg("Invalid email format.");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    const response = await fetch(`${apiUrl}/api/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, gender }),
    });

    const data = await response.json();
    if (data.id) {
      // Handle registration success
      console.log("Registration successful:", data);
      setShowRegister(false);
      setShowLogin(true);
      setErrorMsg(""); // Clear error message
    } else {
      setErrorMsg("Error occurred: " + data.error);
    }
  };

  return (
    <div className="container header">
      <Link to="/ ">
        <img src={Logo} className="logo" alt="" />
      </Link>
      {isHome ? (
        <a href="/" className="header-btn1 bouncy">
          <i className="fas fa-home"></i> Home
        </a>
      ) : (
        <a
          href={gitRepoLink}
          target="_blank"
          rel="noreferrer"
          className="header-btn1 bouncy"
        >
          <i className="fa-brands fa-github"></i> Github
        </a>
      )}
      {isLoggedIn ? (
        <a href="#" onClick={handleProfileClick} className="header-btn1 bouncy">
          <i className="fas fa-user"></i> Profile
        </a>
      ) : (
        <a href="#" onClick={handleLoginClick} className="header-btn1 bouncy">
          <i className="fas fa-home"></i> Login
        </a>
      )}

      {showLogin && (
        <div className="popup" ref={popupRef}>
          <h2>Login</h2>
          <form onSubmit={handleLoginSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
            />
            <button type="submit">Submit</button>
          </form>
          <p>
            Not registered?{" "}
            <a href="#" onClick={handleRegisterClick}>
              Click here to register
            </a>
          </p>
          {errorMsg && <p className="error">{errorMsg}</p>}
        </div>
      )}

      {showRegister && (
        <div className="popup" ref={popupRef}>
          <h2>Register</h2>
          <form onSubmit={handleRegisterSubmit}>
            <input type="text" name="name" placeholder="Name" required />
            <input type="email" name="email" placeholder="Email" required />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
            />
            <select name="gender" required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <button type="submit">Register</button>
          </form>
          {errorMsg && <p className="error">{errorMsg}</p>}
        </div>
      )}

      {showProfileMenu && (
        <div className="profile-menu" ref={profileMenuRef}>
          <ul>
            <li>
              <a href="/account">Account</a>
            </li>
            <li>
              <a href="/watchlist">Watchlist</a>
            </li>
            <li>
              <a href="#" onClick={handleLogout}>
                Logout
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default NavBar;
