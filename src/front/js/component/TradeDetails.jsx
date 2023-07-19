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
        {trade.sender_product_details && (
          <div>
            <h5>Product Details:</h5>
            <p>Name: {trade.sender_product_details.name}</p>
            <p>Description: {trade.sender_product_details.description}</p>
            <p>Condition: {trade.sender_product_details.condition}</p>
            <p>Estimated Value: {trade.sender_product_details.estimated_value}</p>
            <p>Location: {trade.sender_product_details.location}</p>
          </div>
        )}
        {trade.sender_service_details && (
          <div>
            <h5>Service Details:</h5>
            <p>Name: {trade.sender_service_details.name}</p>
            <p>Description: {trade.sender_service_details.description}</p>
            <p>Estimated Value: {trade.sender_service_details.estimated_value}</p>
            <p>Location: {trade.sender_service_details.location}</p>
          </div>
        )}
        <h4>Receiver Item: {trade.receiver_item_name}</h4>
        {trade.receiver_product_details && (
          <div>
            <h5>Product Details:</h5>
            <p>Name: {trade.receiver_product_details.name}</p>
            <p>Description: {trade.receiver_product_details.description}</p>
            <p>Condition: {trade.receiver_product_details.condition}</p>
            <p>Estimated Value: {trade.receiver_product_details.estimated_value}</p>
            <p>Location: {trade.receiver_product_details.location}</p>
          </div>
        )}
        {trade.receiver_service_details && (
          <div>
            <h5>Service Details:</h5>
            <p>Name: {trade.receiver_service_details.name}</p>
            <p>Description: {trade.receiver_service_details.description}</p>
            <p>Estimated Value: {trade.receiver_service_details.estimated_value}</p>
            <p>Location: {trade.receiver_service_details.location}</p>
          </div>
        )}
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
