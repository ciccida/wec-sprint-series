import React from 'react';
import './Ranking.css';

const Ranking = ({ limit, data, rounds, seasonName, selector, titleColor }) => {
    // 外部からデータが渡されない場合のフォールバック
    const displayData = data || [];
    const displayRounds = rounds || [];

    // Calculate total points and sort drivers
    let currentRank = 0;
    let lastPoints = -1;
    let sortedRanking = displayData
        .map(driver => ({
            ...driver,
            totalPoints: driver.points.reduce((sum, p) => sum + (p || 0), 0)
        }))
        .sort((a, b) => b.totalPoints - a.totalPoints);

    if (limit) {
        sortedRanking = sortedRanking.slice(0, limit);
    }

    sortedRanking = sortedRanking.map((driver, index) => {
            if (driver.totalPoints !== lastPoints) {
                currentRank = index + 1;
            }
            lastPoints = driver.totalPoints;
            return { ...driver, displayRank: currentRank };
        });

    // Identify which rounds are "finished" (i.e., have at least one valid point entry)
    const finishedRounds = new Set();
    displayData.forEach(driver => {
        driver.points.forEach((p, index) => {
            if (p !== null) {
                finishedRounds.add(index);
            }
        });
    });

    return (
        <div className="ranking-container">
            <div className="ranking-header">
                <h2 style={titleColor ? { color: titleColor } : {}}>Series Point Ranking</h2>
                {selector}
                <p>{seasonName || 'Season Standings'}</p>
            </div>

            <div className="table-responsive">
                <table className="ranking-table">
                    <thead>
                        <tr>
                            <th className="sticky-col">Pos</th>
                            <th className="sticky-col">Driver</th>
                            {displayRounds.map(round => (
                                <th key={round.id} className="round-col" title={round.venue}>
                                    {round.name}
                                </th>
                            ))}
                            <th className="total-col">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedRanking.map((driver) => (
                            <tr key={driver.id} className={driver.displayRank <= 3 ? `top-${driver.displayRank}` : ''}>
                                <td className="sticky-col pos">{driver.displayRank}</td>
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
