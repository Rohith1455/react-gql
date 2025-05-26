import React from 'react';
import { MapContainer, TileLayer, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function MapComponent() {
  return (
    <MapContainer
      center={[30, 20]} // Adjusted center to fit India and Sweden
      zoom={2.5}
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Bangalore */}
      <CircleMarker
        center={[12.9716, 77.5946]}
        radius={10}
        color="purple"
        fillColor="violet"
        fillOpacity={0.8}
      >
        <Popup>Bangalore</Popup>
      </CircleMarker>

      {/* Chennai */}
      <CircleMarker
        center={[13.0827, 80.2707]}
        radius={10}
        color="green"
        fillColor="lightgreen"
        fillOpacity={0.8}
      >
        <Popup>Chennai</Popup>
      </CircleMarker>

      {/* Hyderabad */}
      <CircleMarker
        center={[17.3850, 78.4867]}
        radius={10}
        color="orange"
        fillColor="orangered"
        fillOpacity={0.8}
      >
        <Popup>Hyderabad</Popup>
      </CircleMarker>

      {/* Sweden */}
      <CircleMarker
        center={[60.1282, 18.6435]}
        radius={10}
        color="blue"
        fillColor="skyblue"
        fillOpacity={0.8}
      >
        <Popup>Sweden</Popup>
      </CircleMarker>
    </MapContainer>
  );
}

export default MapComponent;
