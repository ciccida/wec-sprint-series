import React from 'react';
import './TimeAttackResults.css';

const TimeAttackResults = ({ data, limit }) => {
  if (!data || data.length === 0) return <p>No data available.</p>;

  const hypercars = data.filter(d => d.class === 'HY' || d.class === 'HYPERCAR');
  const lmgt3s = data.filter(d => d.class === 'LMGT3');

  const renderTable = (list, title, type) => {
    const displayList = limit ? list.slice(0, limit) : list;
    
    return (
      <div className="ta-category-section">
        <h3 className={`ta-category-title ${type}`}>{title}</h3>
        <div className="table-responsive">
          <table className="ta-results-table">
            <thead>
              <tr>
                <th>Pos</th>
                <th>Driver</th>
                <th>Car</th>
                <th>Time</th>
                <th>Attempt</th>
              </tr>
            </thead>
            <tbody>
              {displayList.map((driver, index) => (
                <tr key={index} className={index < 3 ? `top-${index + 1}` : ''}>
                  <td className="ta-pos">{index + 1}</td>
                  <td className="ta-driver">{driver.name}</td>
                  <td className="ta-car">{driver.car}</td>
                  <td className="ta-time">{driver.time}</td>
                  <td className="ta-attempt">{driver.attempt}回目</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="time-attack-results">
      {hypercars.length > 0 && renderTable(hypercars, "Hypercar Ranking", "hypercar")}
      {lmgt3s.length > 0 && renderTable(lmgt3s, "LMGT3 Ranking", "lmgt3")}
    </div>
  );
};

export default TimeAttackResults;
