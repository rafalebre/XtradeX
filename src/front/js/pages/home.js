import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import "./home.css";
import { useNavigate } from 'react-router-dom';
import homehowto from "../../img/homehowto.png";  
import { Alert } from "react-bootstrap";
import HomeSearch from "../component/HomeSearch.jsx";

export const Home = () => {
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
                    navigate('/myinfo');
                }
            });
    };

    const validateEmail = email => {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    return (
        <div className="home-container">
            {showAlert && (
                <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                    <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                    <p>{alertMessage}</p>
                </Alert>
            )}

            <div className="d-flex justify-content-center"> {/* Adicionando a imagem que você fez no topo da página */}
              <img src={homehowto} alt="Your Custom Image Description" className="homehowto"/>  
            </div>

            <div className="d-flex justify-content-center">
                <HomeSearch /> {/* Adicionando a ferramenta de busca completa */}
            </div>

            <div className="row">
                <div className="col-6">
                    <h1>How does it work?</h1>
                    <ol>
                        <li>You register a product or service.</li>
                        <li>You search for other services and products.</li>
                        <li>You propose a trade.</li>
                        <li>You also receive proposals.</li>
                        <li>You become part of the X-Trade-X community.</li>
                    </ol>
                </div>
                <div className="col-6">
                    <div className="d-flex flex-column align-items-center justify-content-center">
                        <h1>REGISTER</h1>
                        <form onSubmit={handleRegister}>
                            <input type="email" className="form-control mt-2" placeholder="Email" onChange={e => setEmail(e.target.value)} />
                            <input type="password" className="form-control mt-2" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                            <button className="btn btn-primary mt-2" type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
