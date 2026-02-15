import React, { useState } from 'react';
import './RaceResults.css';

const RaceResults = ({ results, roundName }) => {
    // If results is undefined or null, default to empty array
    const safeResults = results || [];

    const hypercars = safeResults.filter(r => r.category === 'Hypercar');
    const lmgt3s = safeResults.filter(r => r.category === 'LMGT3');

    return (
        <div className="race-results-container">
            {roundName && <div className="round-header"><h3>{roundName}</h3></div>}

            <div className="category-section">
                <h3 className="category-title hypercar">HYPERCAR RESULTS</h3>
                <div className="table-responsive">
                    <table className="results-table">
                        <thead>
                            <tr>
                                <th>Pos</th>
                                <th>Driver</th>
                                <th>Car</th>
                                <th>Best Time</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hypercars.map((r, i) => {
                                const isDNF = r.time && (
                                    r.time.includes('DNF') ||
                                    r.time.includes('Accident') ||
                                    r.time.includes('Fuel') ||
                                    r.time.includes('Suspension') ||
                                    r.time.includes('Retired')
                                );
                                return (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{r.driver}</td>
                                        <td>{r.car}</td>
                                        <td className="time-col">{r.best}</td>
                                        <td className="status-col">
                                            {isDNF ? (
                                                <span className="uk-badge uk-badge-danger">{r.time}</span>
                                            ) : (
                                                <span className="uk-text-success">Finished</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="category-section">
                <h3 className="category-title lmgt3">LMGT3 RESULTS</h3>
                <div className="table-responsive">
                    <table className="results-table">
                        <thead>
                            <tr>
                                <th>Pos</th>
                                <th>Driver</th>
                                <th>Car</th>
                                <th>Best Time</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lmgt3s.map((r, i) => {
                                const isDNF = r.time && (
                                    r.time.includes('DNF') ||
                                    r.time.includes('Accident') ||
                                    r.time.includes('Fuel') ||
                                    r.time.includes('Suspension') ||
                                    r.time.includes('Retired')
                                );
                                return (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{r.driver}</td>
                                        <td>{r.car}</td>
                                        <td className="time-col">{r.best}</td>
                                        <td className="status-col">
                                            {isDNF ? (
                                                <span className="uk-badge uk-badge-danger">{r.time}</span>
                                            ) : (
                                                <span className="uk-text-success">Finished</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RaceResults;
