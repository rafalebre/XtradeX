import React, { useContext, useEffect, useState } from "react"; 
import { Context } from "../store/appContext"; 
import Sidebar from "./Sidebar.jsx";
import AddProduct from "../component/AddProducts.jsx";
import AddService from "../component/AddService.jsx";
import Search from "../component/Search.jsx";
import UserItems from "../component/UserItems.jsx";
import Trades from "../component/Trades.jsx";

const Profile = () => {
  // Estado para rastrear a opção de menu selecionada
  const [selectedMenu, setSelectedMenu] = useState(null);
  
  // Use useContext para acessar o estado global da loja
  const { actions, store } = useContext(Context); 

  // Estado para armazenar o intervalId
  const [intervalId, setIntervalId] = useState(null);

  // Função para atualizar a opção de menu selecionada
  const handleMenuSelection = (menu) => {
    setSelectedMenu(menu);
  };

  useEffect(() => {
    // Verifica se o usuário está logado antes de definir o intervalo
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    const id = setInterval(() => {
      actions.getTrades(); 
    }, 60000);

    setIntervalId(id);

    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <div className="profile-container">
      {/* Passa a função de callback para o componente Sidebar */}
      <Sidebar 
        onMenuSelect={handleMenuSelection} 
        newTradesCount={store.new_sent_trades.length + store.new_received_trades.length}
      />
      <div className="content-area">
        {/* Renderiza o componente AddProduct se 'Add a product' estiver selecionado */}
        {selectedMenu === "addProduct" && <AddProduct />}
        {/* Aqui iremos adicionando condições adicionais para outras opções de menu */}
        {selectedMenu === "addService" && <AddService />}
        {selectedMenu === "search" && <Search />}
        {selectedMenu === "userItems" && <UserItems />}
        {selectedMenu === "trades" && <Trades clearInterval={clearInterval} intervalId={intervalId}/>}
      </div>
    </div>
  );
};

export default Profile;
