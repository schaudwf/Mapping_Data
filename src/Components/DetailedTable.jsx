import React from 'react';

const DetailedTable = ({ data }) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>Detailed Table</h2>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Element Type</th>
            <th>Total Length (km)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.type}</td>
              <td>{item.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DetailedTable;
