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
    actions.deleteTrade(sentTrades.id);


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

  const handleAcceptedProposal = async (proposal) => {
    console.log(proposal);
    actions.handleAcceptProposal(proposal.id);

    try {
      const token = localStorage.getItem("token");
      const headers = new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      });
      const backendUrl = process.env.BACKEND_URL;
      const apiUrl = `${backendUrl}/api/trades/${proposal.id}`;

      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({ status: 'Accepted' }) 
      });

      const data = await response.json();

      if (response.ok) {
        setSelectedSender(data.sender);
        setShowDeal(true);
      } else {
        console.log("Error fetching sender details:", data);
      }
    } catch (error) {
      console.error("Error fetching sender details:", error);
    }
  };

 

  const sentTrades = store.sent_trades || [];
  const receivedTrades = store.received_trades || [];

  const handleDeleteProposal = async (proposalId) => {
    try {
      await actions.deleteTrade(proposalId);
      const updatedSentTrades = sentTrades.filter(proposal => proposal.id !== proposalId);
      setStore({
        ...store,
        sent_trades: updatedSentTrades,
      });
    } catch (error) {
      console.error("Error deleting proposal:", error);
    }
  };

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
          <button className="button-delete" onClick={() => handleDeleteProposal(proposal.id)}>
  Delete
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
