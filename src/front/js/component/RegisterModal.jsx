import React, { useState, useContext } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { Context } from "../store/appContext";
import { useNavigate } from 'react-router-dom';
import './RegisterModal.css';

const RegisterModal = ({ show, handleClose }) => {
    const { actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const navigate = useNavigate();

    const handleRegister = (event) => {
        event.preventDefault();

        if (!validateEmail(email)) {
            setAlertMessage("Please insert a valid e-mail.");
            setShowAlert(true);
            return;
        }

        if (password === "") {
            setAlertMessage("Please insert a password.");
            setShowAlert(true);
            return;
        }

        actions.registerUser(email, password)
            .then(success => {
                if (success) {
                    handleClose();
                    navigate('/myinfo');
                }
            });
    };

    const validateEmail = email => {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    return (
        <Modal show={show} onHide={handleClose} className="registerModal">
            <Modal.Header closeButton>
                <Modal.Title>Register</Modal.Title>
            </Modal.Header>
            <form onSubmit={handleRegister}>
                <Modal.Body>
                    {showAlert && (
                        <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                            <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                            <p>{alertMessage}</p>
                        </Alert>
                    )}
                    <div className="mb-3">
                        <label htmlFor="email-register" className="form-label">Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email-register"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password-register" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password-register"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit" className="register-submit">
                        Register
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default RegisterModal;
