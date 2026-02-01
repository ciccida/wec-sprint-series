import React from 'react';
import './Schedule.css';

const scheduleData = [
    { round: "Test Round 1", date: "1/15", venue: "Sebring" },
    { round: "Test Round 2", date: "1/16", venue: "Sebring" },
    { round: "Rd1", date: "1/17", venue: "Lusail" },
    { round: "Rd2", date: "1/31", venue: "Imola" },
    { round: "Rd3", date: "2/14", venue: "Spa-Francorchamps" },
    { round: "Rd4", date: "2/28", venue: "Sarthe (Le Mans)" },
    { round: "Rd5", date: "3/14", venue: "Interlagos" },
    { round: "Rd6", date: "3/28", venue: "COTA" },
    { round: "Rd7", date: "4/11", venue: "Fuji" },
    { round: "Rd8", date: "4/25", venue: "Bahrain" },
];

const Schedule = () => {
    return (
        <div className="schedule-container">
            <h2 className="section-title">Race Schedule & Points <span style={{ fontSize: '0.6em', opacity: 0.8, marginLeft: '10px' }}>Vol.2</span></h2>
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
