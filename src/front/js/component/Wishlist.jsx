import React, { useState, useEffect } from 'react';

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
        setItems(data);
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
        body: JSON.stringify({ content: newItem })  // Change 'item' to 'content'
      });

      if (response.ok) {
        const data = await response.json();
        setItems(prevItems => [...prevItems, { ...data, priority: newPriority }]);
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
    <div>
      <input value={newItem} onChange={(e) => setNewItem(e.target.value)} />
      <input type="number" min="1" max="5" value={newPriority} onChange={(e) => setNewPriority(e.target.value)} />
      <button onClick={handleAddItem}>Add Item</button>

      {items.sort((a, b) => b.priority - a.priority).map(item => (
        <div key={item.id}>
          <p>{item.content} (Priority: {item.priority})</p>
          <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Wishlist;
