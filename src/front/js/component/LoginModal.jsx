import React, { useState, useContext } from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import './LoginModal.css';

const LoginModal = ({ show, handleClose }) => {
  const { actions } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);  
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    if (!validateEmail(email)) {
      setAlertMessage("Please insert a valid email");
      setShowAlert(true);
      return;
    }
    if (password === "") {
      setAlertMessage("Please insert a password");
      setShowAlert(true);
      return;
    }
    actions.loginUser(email, password, navigate, handleClose);
  };

  const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  return (
    <Modal show={show} onHide={handleClose} className="loginModal">
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleLogin}>
        <Modal.Body>
          {showAlert && (
            <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
              <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
              <p>{alertMessage}</p>
            </Alert>
          )}
          <div className="mb-3">
            <label htmlFor="email" className="form-label login-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control login-input"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label login-label">
              Password
            </label>
            <input
              type="password"
              className="form-control login-input"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit" className="login-submit">
            Login
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default LoginModal;
