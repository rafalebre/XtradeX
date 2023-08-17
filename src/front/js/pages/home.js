import React, { useContext, useState, useEffect } from "react";  
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

            <h2 className="section-title">See some online services from our already registered users</h2>

            <div className="carousel-container">
                <Slider {...sliderSettings}>
                    {store.onlineServices && store.onlineServices.map(service => (
                        <div key={service.id} className="service-card">
                            <img src={service.image_url} alt={service.name} className="service-image" />
                            <h4 className="service-title">{service.name}</h4>
                            <div className="service-description">
                                <p>{service.description}</p>
                            </div>
                            <p className="service-price">{service.currency} {service.estimated_value}</p>
                        </div>
                    ))}
                </Slider>
            </div>

            <h2 className="section-title">Explore the products and services offered by our users</h2>

            <div className="d-flex justify-content-center">
                <HomeSearch />
            </div>
        </div>
    );
};