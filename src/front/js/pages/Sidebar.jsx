import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "./Profile.css";

const Sidebar = ({ onMenuSelect, newTradesCount }) => {
  const { store } = useContext(Context);

  return (
    <div className="sidebar">
      <div className="avatar-container">
        {store.user && store.user.image_url && (
          <img src={store.user.image_url} alt="User profile" className="avatar-image"/>
        )}
      </div>
      <ul className="sidebar-menu">
        <li onClick={() => onMenuSelect("addProduct")}>Add a product</li>
        <li onClick={() => onMenuSelect("addService")}>Add a service</li>
        <li onClick={() => onMenuSelect("search")}>Search</li>
        <li onClick={() => onMenuSelect("userItems")}>My Products / Services</li>
        <li onClick={() => onMenuSelect("trades")}>Trades</li>
        {newTradesCount > 0 && (
          <li>
            <span className="notification">{newTradesCount}</span>
          </li>
        )}
        <li onClick={() => onMenuSelect("wishlist")}>Wishlist</li>
        <li onClick={() => onMenuSelect("favorites")}>Favorites</li>
      </ul>
    </div>
  );
};

export default Sidebar;
