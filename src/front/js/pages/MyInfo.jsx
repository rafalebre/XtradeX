import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import GoogleMaps from '../component/GoogleMaps.jsx';

const MyInfo = () => {
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);

    const [userInfo, setUserInfo] = useState({
        first_name: '',
        last_name: '',
        username: '',
        gender: '',
        birth_date: '',
        phone: '',
        location: '',
        business_phone: '' // adicionado para lidar com os trades apenas
    });
    
    const [mapOpen, setMapOpen] = useState(false);
    const [mapLocation, setMapLocation] = useState(null);
    
    useEffect(() => {
        actions.getUserInfo();
    }, []); // 'Actions' removido das dependências para prevenir o loop infinito
    
    useEffect(() => {
        if (store.user) {
            setUserInfo(prevUserInfo => ({
                ...prevUserInfo,
                ...store.user
            }));
        }
    }, [store.user]);

    useEffect(() => {
        if (mapLocation) {
            setUserInfo(prevUserInfo => ({
                ...prevUserInfo,
                location: mapLocation
            }));
        }
    }, [mapLocation]);

    const handleChange = (e) => {
        setUserInfo({
            ...userInfo,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        actions.updateUserInfo(userInfo);
        navigate('/profile');
    };

    const handleLocationChange = async (location) => {
        // Monta a URL da API
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

        try {
            // Faz a requisição
            const response = await fetch(url);
            const data = await response.json();

            // Verifica se houve erro
            if (data.error_message) {
                console.error('Google Geocoding API error:', data.error_message);
                return;
            }

            // Pega o endereço formatado
            const address = data.results[0].formatted_address;

            // Atualiza o estado
            setMapLocation(address);
        } catch (error) {
            console.error('Failed to fetch address:', error);
        }
    };

    return (
        <div>
            <h1>My Info</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    First Name:
                    <input
                        type="text"
                        name="first_name"
                        value={userInfo.first_name}
                        onChange={handleChange}
                    />
                </label>
                <br/>
                <label>
                    Last Name:
                    <input
                        type="text"
                        name="last_name"
                        value={userInfo.last_name}
                        onChange={handleChange}
                    />
                </label>
                <br/>
                <label>
                    Username:
                    <input
                        type="text"
                        name="username"
                        value={userInfo.username}
                        onChange={handleChange}
                    />
                </label>
                <br/>
                <label>
                    Gender:
                    <input
                        type="text"
                        name="gender"
                        value={userInfo.gender}
                        onChange={handleChange}
                    />
                </label>
                <br/>
                <label>
                    Birth Date:
                    <input
                        type="date"
                        name="birth_date"
                        value={userInfo.birth_date}
                        onChange={handleChange}
                    />
                </label>
                <br/>
                <label>
                    Phone:
                    <input
                        type="text"
                        name="phone"
                        value={userInfo.phone}
                        onChange={handleChange}
                    />
                </label>
                <br/>
                <label>
                    Location:
                    <input
                        type="text"
                        name="location"
                        value={userInfo.location}
                        onChange={handleChange}
                    />
                    <button type="button" onClick={() => setMapOpen(true)}>Select on Map</button>
                    {mapOpen && <GoogleMaps onLocationChange={handleLocationChange} />}
                </label>
                <br/>
                <label>
                    Business Phone:
                    <input
                        type="text"
                        name="business_phone"
                        value={userInfo.business_phone}
                        onChange={handleChange}
                        disabled // Este campo está desabilitado por enquanto, até que o backend esteja pronto para lidar com ele
                    />
                </label>
                <br/>
                <button type="submit">Update Info</button>
            </form>
        </div>
    );
};

export default MyInfo;
