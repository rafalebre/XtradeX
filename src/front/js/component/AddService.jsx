import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import GoogleMaps from "./GoogleMaps.jsx";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import './AddService.css';

const AddService = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedValue, setEstimatedValue] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const { store, actions } = useContext(Context);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [currency, setCurrency] = useState("");
  const [image, setImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const userLocation = store.user ? store.user.location : "";
  const [isOnline, setIsOnline] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    actions.getServiceCategories(); // Fetch service categories
    actions.getUserInfo(); // Fetch user info
  }, []);

  const onLocationChange = async (location, bounds) => {
    if (location) {
      // Monta a URL da API
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
  
      try {
        // Faz a requisição
        const response = await fetch(url);
        const data = await response.json();
  
        // Verifica se houve erro
        if (data.error_message) {
          console.error("Google Geocoding API error:", data.error_message);
          return;
        }
  
        // Pega o endereço formatado
        const address = data.results[0].formatted_address;
  
        // Atualiza o estado
        setLocation(address);
        setLatitude(location.lat);
        setLongitude(location.lng);
      } catch (error) {
        console.error("Failed to fetch address:", error);
      }
    } else {
      console.log('Location is null');
    }
  };
  

  const createNewService = async () => {
    try {
      const backendUrl = process.env.BACKEND_URL;
      const authToken = localStorage.getItem("token");

      if (!authToken) {
        console.error("Authentication Token not found");
        return;
      }

      const response = await fetch(`${backendUrl}/api/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name,
          description,
          category: selectedCategory,
          subcategory: selectedSubcategory,
          estimated_value: estimatedValue,
          currency,
          location: isOnline ? "online" : location,
          online: isOnline,
          latitude: isOnline ? null : latitude,
          longitude: isOnline ? null : longitude,
          image_url: image
        }),
      });

      const data = await response.json();

      if (response.ok) {
        window.confirm("Service successfully created!");
        setName("");
        setDescription("");
        setEstimatedValue("");
        setLocation("");
        setSelectedCategory("");
        setSelectedSubcategory("");
        setIsOnline(false); // Reset to default
      } else {
        console.error("Failed creating service:", data);
      }
    } catch (error) {
      console.error("Error in the request:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !name ||
      !description ||
      (!isOnline && !location) || // If not online, location should not be empty
      !estimatedValue ||
      !currency ||
      !selectedCategory ||
      !selectedSubcategory
    ) {
      setShowModal(true);
      return;
    }
    createNewService();
  };


  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    setImageLoading(true);

    try {
      const response = await fetch("https://api.imgur.com/3/image", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Client-ID ${process.env.REACT_APP_IMGUR_CLIENT_ID}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setImage(data.data.link);
      setImageLoading(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      setImageLoading(false);
    }
  }; 

  const handleCategoryChange = async (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);

    if (categoryId) {
      actions.getServiceSubcategories(categoryId);
    }

    setSelectedSubcategory("");
  };

  const filteredSubcategories = selectedCategory
    ? store.serviceSubcategories.filter(
        (sub) => sub.category_id == selectedCategory
      )
    : [];

  return (
    <div className="add-product-form">
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Form Incomplete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Please fill out all fields before submitting.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <form onSubmit={handleSubmit}>
        <div className="left-column">
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label>
            Description:
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <label>
            Upload Image (optional):
            <input type="file" onChange={handleImageUpload} />
            {imageLoading ? <p>Uploading image...</p> : <img src={image} />}
          </label>
        </div>

        <div className="right-column">
          <label>
            Estimated Value:
            <input
              type="text"
              value={estimatedValue}
              onChange={(e) => setEstimatedValue(e.target.value)}
            />
          </label>

          <label>
            Currency:
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="">Select Currency</option>
              <option value="USD">United States Dollar</option>
              <option value="EUR">Euro</option>
              <option value="JPY">Japanese Yen</option>
              <option value="GBP">British Pound</option>
              <option value="AUD">Australian Dollar</option>
              <option value="CAD">Canadian Dollar</option>
              <option value="CHF">Swiss Franc</option>
              <option value="CNY">Chinese Yuan</option>
              <option value="SEK">Swedish Krona</option>
              <option value="NZD">New Zealand Dollar</option>
              <option value="MXN">Mexican Peso</option>
              <option value="SGD">Singapore Dollar</option>
              <option value="HKD">Hong Kong Dollar</option>
              <option value="NOK">Norwegian Krone</option>
              <option value="KRW">South Korean Won</option>
              <option value="TRY">Turkish Lira</option>
              <option value="INR">Indian Rupee</option>
              <option value="RUB">Russian Ruble</option>
              <option value="BRL">Brazilian Real</option>
              <option value="ZAR">South African Rand</option>
            </select>
          </label>

          <label>
            Category:
            <select
              name="category_id"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">Select Category</option>
              {store.serviceCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Subcategory:
            <select
              name="subcategory_id"
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
            >
              <option value="">Select Subcategory</option>
              {filteredSubcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="location-section">
          <label>
            <b>Search Location or </b>
            <button
              type="button"
              onClick={() => {
                setLocation(userLocation);
                setLatitude(store.user.latitude);
                setLongitude(store.user.longitude);
              }}
            >
              Use my registered address
            </button>
          </label>

          {!isOnline && <GoogleMaps onLocationChange={onLocationChange} showMarkers={false}/>}

          <label>
            Location
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              readOnly={!isOnline}
            />
            <p>This field will be filled when you pick a location</p>
          </label>
        </div>

        <div>
          <label>
            Online Service:
            <input
              type="checkbox"
              checked={isOnline}
              onChange={() => setIsOnline(!isOnline)}
            />
          </label>
        </div>

        <button type="submit">Add Service</button>
      </form>
    </div>
  );
};

export default AddService;
