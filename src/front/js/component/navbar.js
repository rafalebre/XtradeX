import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import LoginModal from "./LoginModal.jsx";
import { useNavigate } from "react-router-dom";
import Logo from "../../img/Logo.png";
import navbar from "./navbar.css";

export const Navbar = () => {
  const { store, actions } = useContext(Context);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    actions.logoutUser(() => {
      navigate("/Goodbye");
    });
  };

  const logoPath = store.isLoggedIn ? "/profile" : "/";

  return (
    <nav className="navbar navbar-dark">
      <div className="container">
        <Link to={logoPath} className="logo-link">
          <img src={Logo} alt="Logo" className="logo-image" />
        </Link>
        <Link to="/about" className="about-link">
          About
        </Link>
        <div className="login-logout-button">
          {!store.isLoggedIn ? (
            <button
              className="btn login-button"
              onClick={() => setShowLoginModal(true)}
            >
              Login
            </button>
          ) : (
            <button className="btn logout-button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
        <LoginModal
          show={showLoginModal}
          handleClose={() => setShowLoginModal(false)}
        />
      </div>
    </nav>
  );
};