import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import SummaryTable from "./components/SummaryTable"; 
import DetailedTable from './components/DetailedTable';
import MapViewer from './components/MapViewer';

function App() {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [summary, setSummary] = useState([]);
  const [details, setDetails] = useState([]);
  const [activeView, setActiveView] = useState(''); // controls what is visible

  const handleFileParsed = (parsedGeoJson) => {
    setGeoJsonData(parsedGeoJson);
    processSummary(parsedGeoJson);
    processDetails(parsedGeoJson);
    setActiveView('map'); // default to map view after upload
  };

  const processSummary = (geoJson) => {
    const counts = {};
    geoJson.features.forEach((feature) => {
      const type = feature.geometry.type;
      counts[type] = (counts[type] || 0) + 1;
    });

    const summaryArray = Object.keys(counts).map((key) => ({
      type: key,
      count: counts[key],
    }));

    setSummary(summaryArray);
  };

  const processDetails = (geoJson) => {
    const detailsArray = geoJson.features
      .filter((feature) =>
        ['LineString', 'MultiLineString'].includes(feature.geometry.type)
      )
      .map((feature, index) => ({
        id: index + 1,
        type: feature.geometry.type,
        length: calculateLength(feature.geometry),
      }));

    setDetails(detailsArray);
  };

  const calculateLength = (geometry) => {
    const toRad = (value) => (value * Math.PI) / 180;

    const lineLength = (coords) => {
      let length = 0;
      for (let i = 0; i < coords.length - 1; i++) {
        const [lon1, lat1] = coords[i];
        const [lon2, lat2] = coords[i + 1];

        const R = 6371; // Earth radius in km
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        length += R * c;
      }
      return length.toFixed(2);
    };

    if (geometry.type === 'LineString') {
      return lineLength(geometry.coordinates);
    }

    if (geometry.type === 'MultiLineString') {
      return geometry.coordinates
        .map((line) => lineLength(line))
        .reduce((a, b) => parseFloat(a) + parseFloat(b), 0)
        .toFixed(2);
    }

    return 0;
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>KML File Viewer</h1>

      <FileUploader onFileParsed={handleFileParsed} />

      {geoJsonData && (
        <>
          <div style={{ marginBottom: '20px' }}>
            <button onClick={() => setActiveView('map')} style={buttonStyle}>
              Show Map View
            </button>
            <button onClick={() => setActiveView('summary')} style={buttonStyle}>
              Show Summary
            </button>
            <button onClick={() => setActiveView('details')} style={buttonStyle}>
              Show Details
            </button>
          </div>

          {/* Render the view based on the button click */}
          {activeView === 'map' && <MapViewer geoJson={geoJsonData} />}
          {activeView === 'summary' && <SummaryTable data={summary} />}
          {activeView === 'details' && <DetailedTable data={details} />}
        </>
      )}
    </div>
  );
}

const buttonStyle = {
  marginRight: '10px',
  padding: '10px 20px',
  cursor: 'pointer',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
};

export default App;
