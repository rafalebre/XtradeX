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
  const [favoriteDetails, setFavoriteDetails] = useState(null); // Estado para armazenar os detalhes do favorito
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getFavorites();
  }, []);

  const handleOpenDetails = async (item, itemType) => {
    setSelectedItem(item);
    setSelectedItemType(itemType);
    setShowDetails(true);

    // Carregar os detalhes do favorito usando o ID do item
    try {
      const favorite = await actions.getFavoriteById(item.id);
      setFavoriteDetails(favorite);
    } catch (error) {
      console.error("Error loading favorite details:", error);
    }
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

  const renderItems = (items, isProduct) => {
    if (!items) {
      return null;
    }

    return items.map((item, index) => (
      <div key={index} className="item-card">
        <h3>{item.name}</h3>
        {isProduct && <p>Condition: {item.condition}</p>}
        <p>Estimated Value: {item.estimated_value}{item.currency}</p>
        <button
          className="orange-button"
          onClick={() =>
            handleOpenDetails(item, isProduct ? "product" : "service")
          }
        >
          Check details
        </button>
        {/* Botão para abrir oTradeProposal */}
        <button
          className="orange-button"
          onClick={() =>
            handleOpenTradeProposal(item, isProduct ? "product" : "service")
          }
        >
          Propose Trade
        </button>
        {/* Botão para remover dos favoritos */}
        <button
          className="orange-button"
          onClick={() => handleRemoveFromFavorites(item.id)}
        >
          Remove from Favorites
        </button>
      </div>
    ));
  };

  return (
    <div>
      <h2>Favorites</h2>
      <div className="item-list">
        {renderItems(store.favorites, true)}
      </div>
      {/* Aqui é onde colocamos o trecho para renderizar o modal */}
      {showDetails && selectedItem && selectedItemType && (
        <ItemDetails
          item={selectedItem}
          itemType={selectedItemType}
          onClose={handleCloseDetails}
        />
      )}
      {/* Botão para abrir oTradeProposal */}
      {selectedItem && (
        <TradeProposal
          show={showTradeProposal}
          handleClose={handleCloseTradeProposal}
          itemToTrade={selectedItem}
          itemType={selectedItemType} // passa o tipo de item selecionado 
        />
      )}
      {/* Renderizar os detalhes do favorito */}
      {showDetails && favoriteDetails && (
        <div>
          <h2>Favorite Details</h2>
          <p>Name: {favoriteDetails.name}</p>
          {/* Adicione mais detalhes conforme necessário */}
        </div>
      )}
    </div>
  );
};

export default Favorites;
