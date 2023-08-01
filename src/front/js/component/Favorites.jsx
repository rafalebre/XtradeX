import React, { useEffect, useState } from 'react';
import ItemDetails from './ItemDetails.jsx';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);

    const fetchFavorites = async () => {
        try {
            const token = localStorage.getItem("token");
            console.log("Token:", token); // Adicione este log para verificar se o token está sendo obtido corretamente
            const headers = new Headers({
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            });
            const backendUrl = process.env.BACKEND_URL;
            const apiUrl = `${backendUrl}/api/users/favorites`;

            const response = await fetch(apiUrl, { headers: headers });
            console.log("Response status:", response.status); // Adicione este log para verificar o status da resposta
            const data = await response.json();
            console.log("Response data:", data); // Adicione este log para verificar o conteúdo da resposta
        
            if (response.ok) {
                // Verificar se 'data' é um array antes de atualizar o estado
                if (Array.isArray(data.favorites)) {
                    setFavorites(data.favorites);
                } else {
                    console.error("Invalid data format:", data);
                }
            } else {
                console.error("Failed to fetch favorites:", data);
            }
        } catch (error) {
            console.error("Error fetching favorites:", error);
        }
    }

    useEffect(() => {
        fetchFavorites();
    }, []);

    return (
        <div>
            {favorites.map(item => (
                <ItemDetails key={item.id} item={item} />
            ))}
        </div>
    );
};

export default Favorites;
