import React from 'react';

const Table = ({ headers, data }) => {
  return (
    <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} style={{ padding: '10px' }}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        
        {data.map((row, index) => (
          <tr key={index}>
            {headers.map((header, idx) => (
              <td key={idx} style={{ padding: '8px' }}>
                {row[header] || 'N/A'}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
