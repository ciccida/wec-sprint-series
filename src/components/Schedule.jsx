import React from 'react';
import './Schedule.css';

const scheduleData = [
    { round: "Rd1公式プラクティス", date: "5/1", venue: "モンツァ" },
    { round: "Round1", date: "5/9", venue: "モンツァ" },
    { round: "Round2", date: "5/23", venue: "アルガルヴェ" },
    { round: "Round3", date: "6/6", venue: "シルバーストン" },
    { round: "Round4", date: "6/20", venue: "カタロニア" },
    { round: "Round5", date: "7/4", venue: "ポールリカール" },
    { round: "Round6", date: "7/18", venue: "セブリング" },
    { round: "Round7", date: "8/1", venue: "スパ・フランコルシャン" },
    { round: "Round8", date: "8/22", venue: "サルト" }
];

const Schedule = () => {
    return (
        <div className="schedule-container">
            <h2 className="section-title">Race Schedule & Points <span style={{ fontSize: '0.6em', opacity: 0.8, marginLeft: '10px' }}>Season 3</span></h2>
            <div className="schedule-content">
                <table className="schedule-table">
                    <thead>
                        <tr>
                            <th>Round</th>
                            <th>Date</th>
                            <th>Venue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scheduleData.map((row, index) => (
                            <tr key={index} className="schedule-row">
                                <td>{row.round}</td>
                                <td>{row.date}</td>
                                <td>{row.venue}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="points-system-container">
                    <h3>Points System</h3>
                    <table className="points-table">
                        <thead>
                            <tr>
                                <th>Pos</th>
                                <th>Pts</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>1st</td><td>25</td></tr>
                            <tr><td>2nd</td><td>18</td></tr>
                            <tr><td>3rd</td><td>15</td></tr>
                            <tr><td>4th</td><td>12</td></tr>
                            <tr><td>5th</td><td>10</td></tr>
                            <tr><td>6th</td><td>8</td></tr>
                            <tr><td>7th</td><td>6</td></tr>
                            <tr><td>8th</td><td>4</td></tr>
                            <tr><td>9th</td><td>2</td></tr>
                            <tr><td>10th</td><td>1</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Schedule;
