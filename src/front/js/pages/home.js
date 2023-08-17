import React, { useContext, useState, useEffect } from "react";  // Adicionado useEffect
import { Context } from "../store/appContext";
import "./home.css";
import { useNavigate } from 'react-router-dom';
import homehowto from "../../img/homehowto.png";  
import { Alert } from "react-bootstrap";
import HomeSearch from "../component/HomeSearch.jsx";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

export const Home = () => {
    const { actions, store } = useContext(Context);
    const [showAlert, setShowAlert] = useState(false);  
    const [alertMessage, setAlertMessage] = useState("");
    const navigate = useNavigate();

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4
    };

    useEffect(() => {
        actions.fetchOnlineServices(null, null, { random: true, limit: 8 });
    }, []);

    return (
        <div className="home-container">
            {showAlert && (
                <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                    <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                    <p>{alertMessage}</p>
                </Alert>
            )}

            <div className="d-flex justify-content-center">
              <img src={homehowto} alt="Your Custom Image Description" className="homehowto"/>  
            </div>

            <div className="carousel-container">
                <Slider {...sliderSettings}>
                    {store.onlineServices && store.onlineServices.map(service => (
                        <div key={service.id}>
                            <img src={service.image} alt={service.name} />
                            <h4>{service.name}</h4>
                            <p>{service.description}</p>
                        </div>
                    ))}
                </Slider>
            </div>

            <div className="d-flex justify-content-center">
                <HomeSearch />
            </div>
        </div>
    );
};
