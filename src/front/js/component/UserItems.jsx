import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "./UserItems.css";

const UserItems = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.fetchUserItems(); // Fetch user items on component mount
  }, []);

  return (
    <div className="user-items-container">
      <div className="user-items-list">
        <h2 className="user-items-title">My Products</h2>
        <ul>
          {store.userProducts &&
            store.userProducts.map((product) => (
              <li key={product.id} className="user-item">
                {product.name} - {product.description} - {product.currency}{product.estimated_value}
              </li>
            ))}
        </ul>
      </div>

      <div className="user-items-list">
        <h2 className="user-items-title">My Services</h2>
        <ul>
          {store.userServices &&
            store.userServices.map((service) => (
              <li key={service.id} className="user-item">
                {service.name} - {service.description} - {service.currency}{service.estimated_value}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default UserItems;
