import React, { useContext, useState, useEffect } from "react";
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
  const [selectedMenu, setSelectedMenu] = useState(null);
  const { actions, store } = useContext(Context);
  const [intervalId, setIntervalId] = useState(null);

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
      <Sidebar 
        onMenuSelect={handleMenuSelection} 
        selectedMenu={selectedMenu} 
        newTradesCount={store.new_sent_trades.length + store.new_received_trades.length}
      />
      <div className="content-area">
        {showInitialMessage && (
          <div className="initial-message-container">
            <h2>Choose an option</h2>
            <div className="arrow-right" />
          </div>)}
        {selectedMenu === "addProduct" && <AddProducts />}
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
