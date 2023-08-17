import React, { useState, useEffect } from 'react';
import './Wishlist.css';

function Wishlist() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [newPriority, setNewPriority] = useState(1);
  const backendUrl = process.env.BACKEND_URL;
  const authToken = localStorage.getItem('token');

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const response = await fetch(`${backendUrl}/api/wishlist`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
  
      if (response.ok) {
        const data = await response.json();
        
        // Convertendo prioridades para números inteiros
        const processedItems = data.map(item => ({
          ...item,
          priority: parseInt(item.priority, 10)
        }));
  
        setItems(processedItems);
      } else {
        console.error("Failed fetching items:", data);
      }
    } catch (error) {
      console.error("Error in the request:", error);
    }
  }
  

  async function handleAddItem() {
    try {
      const response = await fetch(`${backendUrl}/api/wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ item: newItem, priority: newPriority })
      });

      if (response.ok) {
        const data = await response.json();
        const newItem = { ...data, priority: parseInt(newPriority, 10) }; // Convertendo para inteiro
        setItems(prevItems => [...prevItems, newItem]);
        setNewItem('');
        setNewPriority(1);
      } else {
        const errorData = await response.json();
        console.error("Failed adding item:", errorData);
      }
    } catch (error) {
      console.error("Error in the request:", error);
    }
  }

  async function handleDeleteItem(itemId) {
    try {
      const response = await fetch(`${backendUrl}/api/wishlist/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
      });

      if (response.ok) {
        setItems(items.filter(item => item.id !== itemId));
      } else {
        console.error("Failed deleting item:", data);
      }
    } catch (error) {
      console.error("Error in the request:", error);
    }
  }

  return (
    <div className="wishlist-container">
      <div className="wishlist-add-item-section">
        <h2>Add an item</h2>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Item name"
        />
        <select
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value)}
        >
          <option value="1">Add a priority</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <button onClick={handleAddItem}>Add to the list</button>
      </div>

      {items.sort((a, b) => b.priority - a.priority).map(item => (
        <div className="wishlist-item" key={item.id}>
          <div className="wishlist-item-details">
            <p>{item.item} (Priority: {item.priority})</p>
            <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Wishlist;