import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import TradeDetails from "./TradeDetails.jsx";
import Deal from "./Deal.jsx";
import "./Trades.css";

const Trades = ({ intervalId, clearInterval }) => {
  const { store, actions } = useContext(Context);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [showDeal, setShowDeal] = useState(false);
  const [selectedSender, setSelectedSender] = useState(null);

  useEffect(() => {
    clearInterval(intervalId);

    actions.getTrades();
    actions.clearTradeNotifications();

    return () => {
      intervalId = setInterval(() => {
        actions.getTrades();
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

  const handleAcceptedProposal = (proposal) => {
    console.log(proposal);
    actions.handleAcceptProposal(proposal.id);
    setSelectedSender(proposal.sender_id);
    setShowDeal(true);
  };

  const sentTrades = store.sent_trades || [];
  const receivedTrades = store.received_trades || [];

  return (
    <div>
      <h2>Trade Proposals</h2>
      <h3 className="sent-proposals">Proposals Sent:</h3>
      {sentTrades.map((proposal) => (
        <div key={proposal.id}>
          <p>
            You have offered "
            <span
              className="underline-text"
              onClick={() => handleOpenDetails(proposal)}
            >
              {proposal.sender_item_name}
            </span>
            " in exchange for "
            <span
              className="underline-text"
              onClick={() => handleOpenDetails(proposal)}
            >
              {proposal.receiver_item_name}
            </span>
            "
          </p>
          <button className="button-details" onClick={() => handleOpenDetails(proposal)}>
            Check Details
          </button>
        </div>
      ))}
      <h3 className="received-proposals">Proposals Received:</h3>
      {receivedTrades.map((proposal) => (
        <div key={proposal.id}>
          <p>
            Check the offer: "
            <span
              className="underline-text"
              onClick={() => handleOpenDetails(proposal)}
            >
              {proposal.sender_item_name}
            </span>
            " in exchange for your "
            <span
              className="underline-text"
              onClick={() => handleOpenDetails(proposal)}
            >
              {proposal.receiver_item_name}
            </span>
            "
          </p>
          <button className="button-details" onClick={() => handleOpenDetails(proposal)}>
            Check Details
          </button>
          {proposal.status === "Accepted" ? (
            <button className="button-accept" onClick={() => handleAcceptedProposal(proposal)}>
              {proposal.status}
            </button>
          ) : (
            <span>{proposal.status}</span>
          )}
        </div>
      ))}
      {showDetails && selectedTrade && (
        <TradeDetails
          show={showDetails}
          handleClose={handleCloseDetails}
          trade={selectedTrade}
          refreshTrades={actions.getTrades} 
        />
      )}
       {showDeal && selectedSender && (
        <Deal show={showDeal} handleClose={() => setShowDeal(false)} sender={selectedSender} />
      )}
    </div>
  );
};

export default Trades;
