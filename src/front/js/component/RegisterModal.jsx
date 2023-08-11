// RegisterModal.jsx
import React, { useState, useContext } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { Context } from "../store/appContext";
import { useNavigate } from 'react-router-dom';

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
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Register</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {showAlert && (
                    <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                        <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                        <p>{alertMessage}</p>
                    </Alert>
                )}

                <form onSubmit={handleRegister}>
                    <input type="email" className="form-control mt-2" placeholder="Email" onChange={e => setEmail(e.target.value)} />
                    <input type="password" className="form-control mt-2" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                    <button className="btn btn-primary mt-2" type="submit">Submit</button>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default RegisterModal;
