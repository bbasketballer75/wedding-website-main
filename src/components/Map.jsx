'use client';
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ pins }) => {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      // onClick={handleMapClick}
      className="map-container"
      aria-label="World map showing guest locations"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
      />
      {pins.map((pin, idx) => (
        <Marker key={idx} position={[pin.lat, pin.lng]}>
          <Popup>{pin.label || 'Guest'}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;