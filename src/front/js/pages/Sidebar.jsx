import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import "./Profile.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ onMenuSelect, selectedMenu, newTradesCount }) => {
  const { store } = useContext(Context);
  const [profilePic, setProfilePic] = useState(() => localStorage.getItem("profilePic") || null);

  useEffect(() => {
    const storedProfilePic = localStorage.getItem("profilePic");
    if (storedProfilePic) {
      setProfilePic(storedProfilePic);
    }
  }, []);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataURL = reader.result;
      setProfilePic(dataURL);
      localStorage.setItem("profilePic", dataURL);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="sidebar">
      <div className="avatar-container">
        <input
          type="file"
          accept="image/*"
          onChange={handleProfilePicChange}
        />
        {profilePic ? (
          <img src={profilePic} alt="User profile" className="avatar-image" />
        ) : (
          store.user && store.user.image_url ? (
            <img src={store.user.image_url} alt="User profile" className="avatar-image" />
          ) : (
            <div className="no-profile-pic">
              <FontAwesomeIcon icon={faCamera} size="lg" />
            </div>
          )
        )}
      </div>
      <ul className="sidebar-menu">
        <li
          onClick={() => onMenuSelect("addProduct")}
          className={selectedMenu === "addProduct" ? "selected" : ""}
        >
          Add a product
        </li>
        <li
          onClick={() => onMenuSelect("addService")}
          className={selectedMenu === "addService" ? "selected" : ""}
        >
          Add a service
        </li>
        <li
          onClick={() => onMenuSelect("search")}
          className={selectedMenu === "search" ? "selected" : ""}
        >
          Search
        </li>
        <li
          onClick={() => onMenuSelect("onlineSearch")}
          className={selectedMenu === "onlineSearch" ? "selected" : ""}
        >
          Online Services
        </li>
        <li
          onClick={() => onMenuSelect("userItems")}
          className={selectedMenu === "userItems" ? "selected" : ""}
        >
          My Products / Services
        </li>
        <li
          onClick={() => onMenuSelect("trades")}
          className={selectedMenu === "trades" ? "selected" : ""}
        >
          Trades
        </li>
        {newTradesCount > 0 && (
          <li>
            <span className="notification">{newTradesCount}</span>
          </li>
        )}
        <li
          onClick={() => onMenuSelect("wishlist")}
          className={selectedMenu === "wishlist" ? "selected" : ""}
        >
          Wishlist
        </li>
        <li
          onClick={() => onMenuSelect("favorites")}
          className={selectedMenu === "favorites" ? "selected" : ""}
        >
          Favorites
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
