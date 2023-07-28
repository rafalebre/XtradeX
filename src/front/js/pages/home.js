import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import "./home.css";
import { useNavigate } from 'react-router-dom';
import Logo from "../../img/Logo.png";

export const Home = () => {
	const { actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = () => {
        if (!validateEmail(email)) {
            alert("Please insert a valid e-mail.");
            return;
        }
        if (password === "") {
            alert("Please insert a password.");
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
                        <input type="email" className="form-control mt-2" placeholder="Email" onChange={e => setEmail(e.target.value)} />
                        <input type="password" className="form-control mt-2" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                        <button className="btn btn-primary mt-2" onClick={handleRegister}>Submit</button>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-center">
              <img src={Logo} alt="X-Trade-X logo" className="logo"/>  {/* Adicionando o logo */}
            </div>
        </div>
    );
};
