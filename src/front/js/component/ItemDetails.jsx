import React from "react";
import "./ItemDetails.css";

const ItemDetails = ({ item, onClose }) => {
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
    </div>
  );
};

export default ItemDetails;
