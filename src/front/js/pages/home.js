import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import "./home.css";
import { useNavigate } from 'react-router-dom';
import homehowto from "../../img/homehowto.png";  
import { Alert } from "react-bootstrap";
import HomeSearch from "../component/HomeSearch.jsx";

export const Home = () => {
    const { actions } = useContext(Context);
    const [showAlert, setShowAlert] = useState(false);  
    const [alertMessage, setAlertMessage] = useState("");
    const navigate = useNavigate();

    
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

            
        </div>
    );
};
