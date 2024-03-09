import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { useEffect, useState } from "react";
import useCities from "../Hooks/useCities.jsx";
import { useGeolocation } from "../Hooks/useGeolocation";
import Button from "./Button";

function Map() {
  const [mapPosition, setMapPosition] = useState([23.23, 72.22]);
  const { cities } = useCities();
  const [coordinates] = useSearchParams();
  const {
    isLoading: isLocationLoading,
    getPosition,
    position: geoPosition,
  } = useGeolocation();
  const lat = coordinates.get("lat");
  const lng = coordinates.get("lng");

  useEffect(
    function () {
      if (lat) setMapPosition([lat, lng]);
    },
    [lat, lng]
  );

  useEffect(
    function () {
      if (geoPosition) setMapPosition([geoPosition.lat, geoPosition.lng]);
    },
    [geoPosition]
  );

  return (
    <div className={styles.mapContainer}>
      <Button onClick={getPosition} type="position">
        {isLocationLoading ? "Loading..." : "Use Your Position"}
      </Button>
      <MapContainer
        center={mapPosition}
        zoom={8}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((item) => (
          <Marker
            position={[item.position.lat, item.position.lng]}
            key={item.id}
          >
            <Popup>
              <span>{item.emoji}</span>
              {item.country}
            </Popup>
          </Marker>
        ))}
        <ChangeMap />
        <Addform />
      </MapContainer>
    </div>
  );

  function ChangeMap() {
    const map = useMap();
    map.setView(mapPosition);
  }

  function Addform() {
    const navigate = useNavigate();
    useMapEvent({
      click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
    });
  }
}
export default Map;
