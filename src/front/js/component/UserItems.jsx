import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import "./UserItems.css";

const UserItems = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.fetchUserItems(); // Fetch user items on component mount
  }, []);

  const renderItems = (items, deleteFunction) => {
    return items.map((item) => (
      <Card key={item.id} className="user-item-card">
        <Card.Body>
          <Card.Text className="user-item-text">
            <span className="bold-text">{item.name}</span> - {item.description} - <span className="bold-text">{item.currency}{item.estimated_value}</span>
          </Card.Text>
          <Button variant="danger" className="user-item-button" onClick={() => deleteFunction(store, item.id)}>Delete</Button>
        </Card.Body>
      </Card>
    ));
  };

  return (
    <div className="user-items-container">
      <div className="user-items-list">
        <h2 className="user-items-title">My Products</h2>
        <div className="user-items-ul">
          {store.userProducts && renderItems(store.userProducts, actions.deleteProduct)}
        </div>
      </div>

      <div className="user-items-list">
        <h2 className="user-items-title">My Services</h2>
        <div className="user-items-ul">
          {store.userServices && renderItems(store.userServices, actions.deleteService)}
        </div>
      </div>
    </div>
  );
};

export default UserItems;
