import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Deal = ({ show, handleClose, sender }) => {
  console.log(sender);
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Trade Accepted</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {sender && (
          <>
            <p>First Name: {sender.first_name}</p>
            <p>Email: {sender.email}</p>
            <p>Phone: {sender.phone}</p>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Deal;
