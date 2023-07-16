import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Context } from "../store/appContext";

const TradeProposal = ({ show, handleClose, itemToTrade, itemType }) => {
  const { store, actions } = useContext(Context);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedItemType, setSelectedItemType] = useState("");
  const [message, setMessage] = useState("");

  // Fetch user items on component mount
  useEffect(() => {
    actions.fetchUserItems();
  }, []);

  const handleTradeProposal = (e) => {
    e.preventDefault();
    console.log(itemToTrade); // item solicitado
    const receiverId = itemToTrade.user_id;
    const isSenderItemProduct = selectedItemType === 'product';
    const isReceiverItemProduct = itemType === 'product';
    actions.sendTradeProposal(store, selectedItemId, receiverId, itemToTrade.id, message, isSenderItemProduct, isReceiverItemProduct);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Trade Proposal</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleTradeProposal}>
        <Modal.Body>
          <Form.Group controlId="selectedItemType">
            <Form.Label>Item Type</Form.Label>
            <Form.Control
              as="select"
              value={selectedItemType}
              onChange={(e) => setSelectedItemType(e.target.value)}
              required
            >
              <option value="">Select type</option>
              <option value="product">Product</option>
              <option value="service">Service</option>
            </Form.Control>
          </Form.Group>
          {selectedItemType === 'product' &&
            <Form.Group controlId="selectedItem">
              <Form.Label>Selected Product</Form.Label>
              <Form.Control
                as="select"
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                required
              >
                <option value="">Select a product</option>
                {store.userProducts &&
                  store.userProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
          }
          {selectedItemType === 'service' &&
            <Form.Group controlId="selectedItem">
              <Form.Label>Selected Service</Form.Label>
              <Form.Control
                as="select"
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                required
              >
                <option value="">Select a service</option>
                {store.userServices &&
                  store.userServices.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
          }
          <Form.Group controlId="message">
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Send Proposal
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default TradeProposal;
