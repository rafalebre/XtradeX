import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import GoogleMaps from "../component/GoogleMaps.jsx";
import "./MyInfo.css";

const MyInfo = () => {
  const navigate = useNavigate();
  const { store, actions } = useContext(Context);
  const [image, setImage] = useState(null);

  const [userInfo, setUserInfo] = useState({
    first_name: "",
    last_name: "",
    username: "",
    gender: "",
    birth_date: "",
    phone: "",
    location: "",
    latitude: "", // added latitude state
    longitude: "", // added longitude state
    business_phone: "", // adicionado para lidar com os trades apenas
    image_url: image,
  });

  const [mapOpen, setMapOpen] = useState(true); // set to true to open map when page is loaded
  const [mapLocation, setMapLocation] = useState(null);

  useEffect(() => {
    actions.getUserInfo();
  }, []); // 'Actions' removido das dependências para prevenir o loop infinito

  useEffect(() => {
    if (store.user) {
        const updatedUserInfo = Object.keys(store.user).reduce((obj, key) => {
            obj[key] = store.user[key] ?? userInfo[key];
            return obj;
        }, {});

        setUserInfo(prevUserInfo => ({
            ...prevUserInfo,
            ...updatedUserInfo,
        }));
    }
}, [store.user]);


useEffect(() => {
  if (mapLocation) {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      location: mapLocation.address,
      latitude: mapLocation.lat ?? "", // caso seja null ou undefined, será ""
      longitude: mapLocation.lng ?? "", // caso seja null ou undefined, será ""
    }));
  }
}, [mapLocation]);


  const handleChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await actions.updateUserInfo(userInfo);
    if (success) {
      navigate("/profile");
    }
  };


  const handleDelete = () => {
    actions.deleteUserInfo();
    navigate("/login")};
     
  const handleLocationChange = async (location) => {
    // Check if location is defined before accessing properties
    if (!location) {
      console.log("Location is null");
      return;
    }

    console.log("Location Changed:", location);
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
      setMapLocation({ address, lat: location.lat, lng: location.lng }); // updated to include lat and lng in the mapLocation state
    } catch (error) {
      console.error("Failed to fetch address:", error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
  
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
  
      // Aqui, atualizamos o userInfo com o link da imagem recém-carregada.
      setUserInfo(prevState => ({
        ...prevState,
        image_url: data.data.link,
      }));
  
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="my-info-container">
      <h1>My Info</h1>
      <form onSubmit={handleSubmit} className="my-info-form">
        <label>
          First Name:
          <input
            type="text"
            name="first_name"
            value={userInfo.first_name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            name="last_name"
            value={userInfo.last_name}
            onChange={handleChange}
          />
        </label>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={userInfo.username}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Gender:
          <input
            type="text"
            name="gender"
            value={userInfo.gender}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Birth Date:
          <input
            type="date"
            name="birth_date"
            value={userInfo.birth_date}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Phone:
          <input
            type="tel"
            pattern="[\+\-\(\)\s\d]+"
            name="phone"
            value={userInfo.phone}
            onChange={handleChange}
            required
          />
          <small>Accepts numbers, + -, and ( )</small>
        </label>
        <br />
        <label>
          Location:
          <input
            type="text"
            name="location"
            value={userInfo.location}
            onChange={handleChange}
            readOnly
          />
          <button type="button" onClick={() => setMapOpen(!mapOpen)}>
            Hide Map
          </button>
          {mapOpen && (
            <GoogleMaps
              onLocationChange={handleLocationChange}
              initialLocation={mapLocation}
              showMarkers={false}
            />
          )}
        </label>
        <br />

        <label>
          Upload a picture to your profile
          <input type="file" onChange={handleImageUpload} />
        </label>

        <br />

        <br />
        <button type="submit">Update Info</button>
        <button
          type="button"
          onClick={handleDelete}
          style={{backgroundColor: "red", borderRadius: "15px", color: "white", marginLeft: "10px"}}
        >
          Delete Account
        </button>
      </form>
    </div>
  );
};

export default MyInfo;
