import React, { useContext, useEffect, useState } from "react"; 
import { Context } from "../store/appContext"; 
import Sidebar from "./Sidebar.jsx";
import AddProducts from "../component/AddProducts.jsx";
import AddService from "../component/AddService.jsx";
import Search from "../component/Search.jsx";
import UserItems from "../component/UserItems.jsx";
import Trades from "../component/Trades.jsx";
import Wishlist from "../component/Wishlist.jsx";
import Favorites from "../component/Favorites.jsx";
import OnlineServicesSearch from "../component/OnlineServicesSearch.jsx";

const Profile = () => {
  
  const [showInitialMessage, setShowInitialMessage] = useState(true);
  // Estado para rastrear a opção de menu selecionada
  const [selectedMenu, setSelectedMenu] = useState(null);
  
  // Use useContext para acessar o estado global da loja
  const { actions, store } = useContext(Context); 

  // Estado para armazenar o intervalId
  const [intervalId, setIntervalId] = useState(null);

  // Função para atualizar a opção de menu selecionada
  const handleMenuSelection = (menu) => {
    setSelectedMenu(menu);
    setShowInitialMessage(false);
  };

  useEffect(() => {
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
      {showInitialMessage && (
          <div className="initial-message-container">
            <h2>Choose an option</h2>
            <div className="arrow-right" />
          </div>)}
        {/* Renderiza o componente AddProduct se 'Add a product' estiver selecionado */}
        {selectedMenu === "addProduct" && <AddProducts />}
        {/* Aqui iremos adicionando condições adicionais para outras opções de menu */}
        {selectedMenu === "addService" && <AddService />}
        {selectedMenu === "search" && <Search />}
        {selectedMenu === "onlineSearch" && <OnlineServicesSearch />}
        {selectedMenu === "userItems" && <UserItems />}
        {selectedMenu === "trades" && <Trades intervalId={intervalId} clearInterval={clearInterval}/>}
        {selectedMenu === "favorites" && <Favorites />}
        {selectedMenu === "wishlist" && <Wishlist />}
      </div>
    </div>
  );
};

export default Profile;