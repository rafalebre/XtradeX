import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import "./Profile.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';


const Sidebar = ({ onMenuSelect, newTradesCount }) => {
  const { store } = useContext(Context);
  const [profilePic, setProfilePic] = useState(() => localStorage.getItem("profilePic") || null);

  useEffect(() => {
    // Carregar a foto de perfil do localStorage quando o componente for montado
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
      // Armazenar a foto de perfil no localStorage
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