import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";

const Trades = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getTrades(); // Faz o fetch das trades quando o componente é montado
  }, []);

  const handleAcceptProposal = (proposalId) => {
    actions.handleAcceptProposal(proposalId);
  };

  const handleDeclineProposal = (proposalId) => {
    actions.handleDeclineProposal(proposalId);
  };

  const sentTrades = store.sent_trades || []; // Verifica se sent_trades existe na store
  const receivedTrades = store.received_trades || []; // Verifica se received_trades existe na store

  return (
    <div>
      <h2>Trade Proposals</h2>
      <h3>Proposals Sent:</h3>
      {sentTrades.map((proposal) => (
        <div key={proposal.id}>
          <p>
            You have offered "{proposal.sender_item_name}" in exchange for "{proposal.receiver_item_name}"
          </p>
        </div>
      ))}
      <h3>Proposals Received:</h3>
      {receivedTrades.map((proposal) => (
        <div key={proposal.id}>
          <p>
            Check the offer: "{proposal.sender_item_name}" in exchange for your "{proposal.receiver_item_name}"
          </p>
          {proposal.status === "Pending" && (
            <div>
              <button onClick={() => handleAcceptProposal(proposal.id)}>
                Accept
              </button>
              <button onClick={() => handleDeclineProposal(proposal.id)}>
                Decline
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Trades;
