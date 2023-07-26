import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import GoogleMaps from "./GoogleMaps.jsx";

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
  const userLocation = store.user ? store.user.location : "";

  useEffect(() => {
    actions.getServiceCategories(); // Fetch service categories
    actions.getUserInfo(); // Fetch user info
  }, []);

  const onLocationChange = async (location) => {
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
          location,
          latitude,
          longitude,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        window.confirm("Service successfully created!"); // Alerta personalizado para o usuário
        setName("");
        setDescription("");
        setEstimatedValue("");
        setLocation("");
        setSelectedCategory("");
        setSelectedSubcategory("");
      } else {
        console.error("Failed creating service:", data);
      }
    } catch (error) {
      console.error("Error in the request:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createNewService();
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
    ? store.serviceSubcategories.filter((sub) => sub.category_id == selectedCategory)
    : [];

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="text"
          placeholder="Estimated Value"
          value={estimatedValue}
          onChange={(e) => setEstimatedValue(e.target.value)}
        />

        <label>
          Location:
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            readOnly
          />
          <GoogleMaps onLocationChange={onLocationChange} />
        </label>
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

        <button type="submit">Add Service</button>
      </form>
    </div>
  );
};

export default AddService;
