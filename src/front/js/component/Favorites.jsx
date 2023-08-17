import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import ItemDetails from "./ItemDetails.jsx";
import TradeProposal from "./TradeProposal.jsx";
import "./Favorites.css";

const Favorites = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showTradeProposal, setShowTradeProposal] = useState(false);
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getFavorites();
  }, []);

  const handleOpenDetails = (item, itemType) => {
    setSelectedItem(item);
    setSelectedItemType(itemType);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const handleOpenTradeProposal = (item, itemType) => {
    setSelectedItem(item);
    setSelectedItemType(itemType);
    setShowTradeProposal(true);
  };

  const handleCloseTradeProposal = () => {
    setShowTradeProposal(false);
  };

  const handleRemoveFromFavorites = (itemId) => {
    actions.removeFavorite(itemId);
  };

  return (
    <div className="fav-container">
        <h2 className="fav-heading">Favorites</h2>
        <div className="fav-list">
            {store.favorites.map((item, index) => (
                <div key={index} className="fav-card">
                    <h3 className="fav-card-title">{item.details.name}</h3>
                    <p className="fav-card-description">{item.details.description}</p>
                    {item.type === "product" && <p className="fav-card-condition">Condition: {item.details.condition}</p>}
                    <p className="fav-card-value">Estimated Value: {item.details.estimated_value}{item.details.currency}</p>
                    <div className="fav-card-actions">
                        <button className="fav-details-btn" onClick={() => handleOpenDetails(item.details, item.type)}>Check details</button>
                        <button className="fav-trade-btn" onClick={() => handleOpenTradeProposal(item.details, item.type)}>Propose Trade</button>
                        <button className="fav-remove-btn" onClick={() => handleRemoveFromFavorites(item.details.id)}>Remove from Favorites</button>
                    </div>
                </div>
            ))}
        </div>

        {/* Modals */}
        {showDetails && selectedItem && selectedItemType && (
            <ItemDetails
                item={selectedItem}
                itemType={selectedItemType}
                onClose={handleCloseDetails}
            />
        )}
        {selectedItem && (
            <TradeProposal
                show={showTradeProposal}
                handleClose={handleCloseTradeProposal}
                itemToTrade={selectedItem}
                itemType={selectedItemType}
            />
        )}
    </div>
);
};

export default Favorites;