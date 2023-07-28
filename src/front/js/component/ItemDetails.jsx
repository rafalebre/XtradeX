import React, { useState } from "react";
import "./ItemDetails.css";
import CurrencyConverterModal from "./CurrencyConverterModal.jsx";

const ItemDetails = ({ item, onClose }) => {
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  if (!item) {
    return null;
  }

  const renderProperty = (key, property) => {
    if (key === "id" || key === "user_id") {
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

       {/* Display image if it exists */}
       {item.image_url && <img src={item.image_url} alt={item.name} />}
      <div>
        {Object.keys(item).map((key) => (
          <div key={key}>
            {key === "name" ? (
              <span className="item-name" onClick={onClose}>
                {item[key]}
              </span>
            ) : (
              renderProperty(key, item[key])
            )}
          </div>
        ))}
      </div>
      <button onClick={onClose}>Close</button>
      <button onClick={() => setShowCurrencyModal(true)}>Convert Currency</button>

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
