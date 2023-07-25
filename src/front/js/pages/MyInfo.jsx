import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';

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
