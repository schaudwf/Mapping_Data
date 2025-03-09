import React from 'react';
import * as toGeoJSON from '@mapbox/togeojson';

const FileUploader = ({ onFileParsed }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const parser = new DOMParser();
      const kml = parser.parseFromString(e.target.result, 'text/xml');
      const converted = toGeoJSON.kml(kml);
      console.log('Converted GeoJSON:', converted);
      onFileParsed(converted);
    };

    reader.readAsText(file);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <input type="file" accept=".kml" onChange={handleFileChange} />
    </div>
  );
};

export default FileUploader;
