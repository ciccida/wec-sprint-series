import React from 'react';
import { rankingData, rounds } from '../data/ranking';
import './Ranking.css';

const Ranking = () => {
    // Calculate total points and sort drivers
    const sortedRanking = rankingData
        .map(driver => ({
            ...driver,
            totalPoints: driver.points.reduce((sum, p) => sum + (p || 0), 0)
        }))
        .sort((a, b) => b.totalPoints - a.totalPoints);

    // Identify which rounds are "finished" (i.e., have at least one valid point entry)
    const finishedRounds = new Set();
    rankingData.forEach(driver => {
        driver.points.forEach((p, index) => {
            if (p !== null) {
                finishedRounds.add(index);
            }
        });
    });

    return (
        <div className="ranking-container">
            <div className="ranking-header">
                <h2>Series Point Ranking</h2>
                <p>Vol.2 Standings</p>
            </div>

            <div className="table-responsive">
                <table className="ranking-table">
                    <thead>
                        <tr>
                            <th className="sticky-col">Pos</th>
                            <th className="sticky-col">Driver</th>
                            {rounds.map(round => (
                                <th key={round.id} className="round-col" title={round.venue}>
                                    {round.name}
                                </th>
                            ))}
                            <th className="total-col">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedRanking.map((driver, index) => (
                            <tr key={driver.id} className={index < 3 ? `top-${index + 1}` : ''}>
                                <td className="sticky-col pos">{index + 1}</td>
                                <td className="sticky-col driver-name">{driver.name}</td>
                                {driver.points.map((p, i) => {
                                    // If round is finished but points are null, show 0
                                    const displayValue = p !== null ? p : (finishedRounds.has(i) ? 0 : '-');
                                    return (
                                        <td key={i} className="point-val">
                                            {displayValue}
                                        </td>
                                    );
                                })}
                                <td className="total-val">{driver.totalPoints}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="ranking-footer">
                <p>* Ranking is automatically updated based on race results.</p>
            </div>
        </div>
    );
};

export default Ranking;
