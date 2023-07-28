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
        <li onClick={() => onMenuSelect("userItems")}>
          My Products / Services
        </li>
        <li onClick={() => onMenuSelect("trades")}>
          Trades{" "}
          {newTradesCount > 0 && (
            <span className="notification">{newTradesCount}</span>
          )}
        </li>
        <li>Wishlist</li>
        <li>Favorites</li>
      </ul>
    </div>
  );
};

export default Sidebar;
