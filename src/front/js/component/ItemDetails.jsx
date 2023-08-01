import React, { useState, useContext } from "react";
import "./ItemDetails.css";
import CurrencyConverterModal from "./CurrencyConverterModal.jsx";
import { Context } from "../store/appContext";

const ItemDetails = ({ item, onClose }) => {
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const { actions } = useContext(Context);

  if (!item) {
    return null;
  }

  const renderProperty = (key, property) => {
    if (key === "id" || key === "user_id" || key === "name") {
      return null;
    }

    if (key === "category" || key === "subcategory") {
      return (
        <span key={key}>
          <strong>{key}:</strong> {property.name}
        </span>
      );
    }

    if (typeof property === "object" && property !== null) {
      return null;
    }

    return (
      <span key={key}>
        <strong>{key}:</strong> {property}
      </span>
    );
  };

  return (
    <div className="item-details-container">
      <h2>Item Details</h2>

      {/* Display the name at the top */}
      <h3 className="item-name" onClick={onClose}>{item.name}</h3>

      {/* Display image if it exists */}
      {item.image_url && <img src={item.image_url} alt={item.name} />}
      
      <div>
        {Object.keys(item).map((key) => (
          <div key={key}>
            {renderProperty(key, item[key])}
          </div>
        ))}
      </div>

      <button onClick={onClose}>Close</button>
      <button onClick={() => setShowCurrencyModal(true)}>Convert Currency</button>
      <button onClick={() => actions.addFavorite(item)}>Add to Favorites</button>


      {showCurrencyModal && (
        <CurrencyConverterModal
          baseValue={item.estimated_value}
          baseCurrency={item.currency}
          onClose={() => setShowCurrencyModal(false)}
        />
      )}
    </div>
  );
};

export default ItemDetails;