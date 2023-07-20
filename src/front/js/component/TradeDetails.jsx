import React, { useContext, useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { Context } from "../store/appContext";

const TradeDetails = ({ show, handleClose, trade }) => {
  const { actions } = useContext(Context);
  const [tradeStatus, setTradeStatus] = useState(trade.status);

  useEffect(() => {
    setTradeStatus(trade.status);
  }, [trade.status]);

  const handleAccept = async () => {
    await actions.handleAcceptProposal(trade.id);
    setTradeStatus("Accepted");
  };

  const handleDecline = async () => {
    await actions.handleDeclineProposal(trade.id);
    setTradeStatus("Declined");
  };

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
        <p>Status: {tradeStatus}</p>
      </Modal.Body>
      <Modal.Footer>
        {tradeStatus === "Pending" && (
          <div>
            <Button onClick={handleAccept}>Accept</Button>
            <Button onClick={handleDecline}>Decline</Button>
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
