import React, { useContext, useState, useEffect } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import { Context } from "../store/appContext";
import "./TradeDetails.css";

const TradeDetails = ({ show, handleClose, trade, refreshTrades }) => {
  const { store, actions } = useContext(Context);
  const [tradeStatus, setTradeStatus] = useState(trade.status);

  useEffect(() => {
    setTradeStatus(trade.status);
  }, [trade]);

  const handleAccept = async () => {
    await actions.handleAcceptProposal(trade.id);
    setTradeStatus("Accepted");
    refreshTrades();
  };

  const handleDecline = async () => {
    await actions.handleDeclineProposal(trade.id);
    setTradeStatus("Declined");
    refreshTrades();
  };

  const isReceivedTrade = store.received_trades.some(
    (receivedTrade) => receivedTrade.id === trade.id
  );

  return (
    <Modal show={show} onHide={handleClose} className="TradeDetails">
      <Modal.Header closeButton className="modal-header">
        <Modal.Title className="modal-title">Trade Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col lg={6}>
            <div className="details-section">
              <h4>Sender Item: {trade.sender_item_name}</h4>
              {trade.sender_product_details && (
                <table>
                  <tbody>
                    <tr>
                      <td><strong>Name:</strong></td>
                      <td>{trade.sender_product_details.name}</td>
                    </tr>
                    <tr>
                      <td><strong>Description:</strong></td>
                      <td>{trade.sender_product_details.description}</td>
                    </tr>
                    <tr>
                      <td><strong>Estimated Value:</strong></td>
                      <td>{trade.sender_product_details.estimated_value}</td>
                    </tr>
                    <tr>
                      <td><strong>Location:</strong></td>
                      <td>{trade.sender_product_details.location}</td>
                    </tr>
                  </tbody>
                </table>
              )}
              {trade.sender_service_details && (
                <table>
                  <tbody>
                    <tr>
                      <td><strong>Name:</strong></td>
                      <td>{trade.sender_service_details.name}</td>
                    </tr>
                    <tr>
                      <td><strong>Description:</strong></td>
                      <td>{trade.sender_service_details.description}</td>
                    </tr>
                    <tr>
                      <td><strong>Estimated Value:</strong></td>
                      <td>{trade.sender_service_details.estimated_value}</td>
                    </tr>
                    <tr>
                      <td><strong>Location:</strong></td>
                      <td>{trade.sender_service_details.location}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </Col>
          <Col lg={6}>
            <div className="details-section">
              <h4>Receiver Item: {trade.receiver_item_name}</h4>
              {trade.receiver_product_details && (
                <table>
                  <tbody>
                    <tr>
                      <td><strong>Name:</strong></td>
                      <td>{trade.receiver_product_details.name}</td>
                    </tr>
                    <tr>
                      <td><strong>Description:</strong></td>
                      <td>{trade.receiver_product_details.description}</td>
                    </tr>
                    <tr>
                      <td><strong>Estimated Value:</strong></td>
                      <td>{trade.receiver_product_details.estimated_value}</td>
                    </tr>
                    <tr>
                      <td><strong>Location:</strong></td>
                      <td>{trade.receiver_product_details.location}</td>
                    </tr>
                  </tbody>
                </table>
              )}
              {trade.receiver_service_details && (
                <table>
                  <tbody>
                    <tr>
                      <td><strong>Name:</strong></td>
                      <td>{trade.receiver_service_details.name}</td>
                    </tr>
                    <tr>
                      <td><strong>Description:</strong></td>
                      <td>{trade.receiver_service_details.description}</td>
                    </tr>
                    <tr>
                      <td><strong>Estimated Value:</strong></td>
                      <td>{trade.receiver_service_details.estimated_value}</td>
                    </tr>
                    <tr>
                      <td><strong>Location:</strong></td>
                      <td>{trade.receiver_service_details.location}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </Col>
        </Row>
        <Row className="message-status-row">
          <Col className="text-center">
            <p><strong>Message:</strong> {trade.message}</p>
            <p><strong>Status:</strong> {tradeStatus}</p>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        {isReceivedTrade && tradeStatus === "Pending" && (
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