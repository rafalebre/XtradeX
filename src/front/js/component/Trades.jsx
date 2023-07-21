import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import TradeDetails from "./TradeDetails.jsx";

const Trades = () => {
  const { store, actions } = useContext(Context);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);

  useEffect(() => {
    // Chamada para getTrades quando o componente é montado
    actions.getTrades();
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
        />
      )}
    </div>
  );
};

export default Trades;
