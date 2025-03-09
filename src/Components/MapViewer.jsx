import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapViewer = ({ geoJson }) => {
  const center = [20, 0]; // Default center, you can dynamically adjust this

  return (
    <div style={{ height: '500px', marginBottom: '20px' }}>
      <h2>Map Viewer</h2>
      <MapContainer center={center} zoom={2} style={{ height: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON data={geoJson} />
      </MapContainer>
    </div>
  );
};

export default MapViewer;
