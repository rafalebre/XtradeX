import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import TradeDetails from "./TradeDetails.jsx";

const Trades = ({intervalId, clearInterval}) => {
  const { store, actions } = useContext(Context);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);

  useEffect(() => {
    clearInterval(intervalId);

    actions.getTrades();
    actions.clearTradeNotifications();

    return () => {
        intervalId = setInterval(() => {
            actions.getTrades(); // Supondo que a ação getTrades exista no contexto.
        }, 60000);
    };
  }, []);

  const handleOpenDetails = (trade) => {
    setSelectedTrade(trade);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const sentTrades = store.sent_trades || [];
  const receivedTrades = store.received_trades || [];

  return (
    <div>
      <h2>Trade Proposals</h2>
      <h3>Proposals Sent:</h3>
      {sentTrades.map((proposal) => (
        <div key={proposal.id}>
          <p>
            You have offered "
            <span
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => handleOpenDetails(proposal)}
            >
              {proposal.sender_item_name}
            </span>
            " in exchange for "
            <span
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => handleOpenDetails(proposal)}
            >
              {proposal.receiver_item_name}
            </span>
            "
          </p>
          <button onClick={() => handleOpenDetails(proposal)}>Check Details</button>
        </div>
      ))}
      <h3>Proposals Received:</h3>
      {receivedTrades.map((proposal) => (
        <div key={proposal.id}>
          <p>
            Check the offer: "
            <span
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => handleOpenDetails(proposal)}
            >
              {proposal.sender_item_name}
            </span>
            " in exchange for your "
            <span
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => handleOpenDetails(proposal)}
            >
              {proposal.receiver_item_name}
            </span>
            "
          </p>
          <button onClick={() => handleOpenDetails(proposal)}>Check Details</button>
        </div>
      ))}
      {showDetails && selectedTrade && (
        <TradeDetails
          show={showDetails}
          handleClose={handleCloseDetails}
          trade={selectedTrade}
          refreshTrades={actions.getTrades}  // adicionado
        />
      )}
    </div>
  );
};

export default Trades;
