import React from "react";
import { Modal, Button } from "react-bootstrap";

const TradeDetails = ({
  show,
  handleClose,
  trade,
  handleAcceptProposal,
  handleDeclineProposal,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Trade Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Sender Item: {trade.sender_item_name}</h4>
        <h4>Receiver Item: {trade.receiver_item_name}</h4>
        <p>Message: {trade.message}</p>
        <p>Status: {trade.status}</p>
      </Modal.Body>
      <Modal.Footer>
        {trade.status === "Pending" && (
          <div>
            <Button onClick={() => handleAcceptProposal(trade.id)}>Accept</Button>
            <Button onClick={() => handleDeclineProposal(trade.id)}>Decline</Button>
          </div>
        )}
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TradeDetails;
