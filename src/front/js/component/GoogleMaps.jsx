import React, { useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, Autocomplete, useJsApiLoader } from "@react-google-maps/api";

const mapContainerStyle = {
  height: "400px",
  width: "800px",
};

// Declarando a constante libraries aqui
const libraries = ["places"];

export default function GoogleMaps({ onLocationChange }) {
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(null);
  const autoCompleteRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    libraries: libraries // Passando a constante libraries
  });

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);

    // Defina a função onBoundsChanged
    map.addListener('bounds_changed', () => {
      const ne = map.getBounds().getNorthEast();
      const sw = map.getBounds().getSouthWest();

      // A função onLocationChange deve aceitar dois argumentos: location e bounds
      if (onLocationChange) {
        onLocationChange(center, { ne: { lat: ne.lat(), lng: ne.lng() }, sw: { lat: sw.lat(), lng: sw.lng() } });
      }
    });

  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const onPlaceChanged = () => {
    if (autoCompleteRef.current != null) {
      const place = autoCompleteRef.current.getPlace();
  
      if (place && place.geometry) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
  
        setCenter(location);
        if (map) {
          map.panTo(location);
        }
        if (onLocationChange) {
          const ne = map.getBounds().getNorthEast();
          const sw = map.getBounds().getSouthWest();
          onLocationChange(location, { ne: { lat: ne.lat(), lng: ne.lng() }, sw: { lat: sw.lat(), lng: sw.lng() } });
        }
      }
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };

  const onClick = (...args) => {
    const lat = args[0].latLng.lat();
    const lng = args[0].latLng.lng();
    const location = { lat, lng };
    setCenter(location);
    if (map) { // Verifique se o 'map' não é 'null'
      map.panTo(location);
    }
    if (onLocationChange) {
      const ne = map.getBounds().getNorthEast();
    const sw = map.getBounds().getSouthWest();
      onLocationChange(location, { ne: { lat: ne.lat(), lng: ne.lng() }, sw: { lat: sw.lat(), lng: sw.lng() } });
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        setCenter({ lat, lng });
      }
    );
  }, []);

  return isLoaded ? (
    <div>
      <Autocomplete onLoad={(autoComplete) => (autoCompleteRef.current = autoComplete)} onPlaceChanged={onPlaceChanged}>
        <input type="text" placeholder="Search Location" />
      </Autocomplete>
      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={onClick}
      />
    </div>
  ) : <></>
}
