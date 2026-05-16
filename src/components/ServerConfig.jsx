import React from 'react';
import { generateWeatherSlots } from '../utils/lmuConverter';
import { CloudRain, Sun, Copy } from 'lucide-react';
import './Components.css';

export const ServerConfig = ({ weather, trackName, hourlyData }) => {
    if (!weather || !hourlyData) return null;

    // generateWeatherSlots now returns { Practice, Qualify, Race }
    const sessionData = generateWeatherSlots(weather.time, hourlyData);

    if (!sessionData) return <div style={{ color: '#f87171' }}>Error generating weather slots.</div>;

    const copyToClipboard = () => {
        const json = JSON.stringify(sessionData, null, 2);
        navigator.clipboard.writeText(json);
        alert("Full Server Config (15 slots) copied!");
    };

    const renderSession = (sessionName, slots) => (
        <div key={sessionName} className="session-block">
            <h3 className="session-header">
                <span className="session-pill"></span>
                {sessionName}
                <span className="session-count">5 Slots</span>
            </h3>

            <div className="slots-grid">
                {slots.map((slot) => (
                    <div key={slot.slot} className="slot-card group">
                        {/* Visual Hint Background */}
                        <div className="weather-icon-bg">
                            {slot.Sky.includes("Rain") || slot.Sky.includes("Drizzle") || slot.Sky.includes("Storm")
                                ? <CloudRain size={60} />
                                : <Sun size={60} />}
                        </div>

                        <div className="slot-number">Slot {slot.slot}</div>
                        <div className="slot-time">{slot.timeLabel}</div>

                        <div className="slot-condition">
                            <div className="condition-text">
                                {slot.Sky.replace("Overcast", "Ovc.").replace("Partially", "Part.").replace("Mostly", "Most.")}
                            </div>
                        </div>

                        <div className="slot-metrics">
                            <div className="metric-col">
                                <span className="metric-label">Rain %</span>
                                {!slot.allowRainChance ? (
                                    <span className="metric-locked" title="Locked">N/A</span>
                                ) : (
                                    <span className="metric-value-rain">{slot.ChanceOfRain}%</span>
                                )}
                            </div>
                            <div className="metric-col border-left">
                                <span className="metric-label">Temp</span>
                                <span className="metric-value-temp">{slot.Temp}°</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="server-config-card">
            <div className="config-header">
                <div>
                    <h2 className="config-title">Weather Schedule</h2>
                    <p className="config-subtitle">Full 15-slot configuration for all sessions</p>
                </div>
                <div>
                    <div className="config-timestamp">
                        {weather.time}
                    </div>
                </div>
            </div>

            <div>
                {renderSession('Practice', sessionData.Practice)}
                {renderSession('Qualify', sessionData.Qualify)}
                {renderSession('Race', sessionData.Race)}
            </div>

            {/* JSON Output */}
            <div className="json-section">
                <div className="json-header">
                    <label className="json-label">Server CONFIG (JSON)</label>
                    <button
                        onClick={copyToClipboard}
                        className="copy-btn"
                    >
                        <Copy size={12} /> Copy JSON
                    </button>
                </div>
                <pre className="json-pre">
                    {JSON.stringify(sessionData, null, 2)}
                </pre>
            </div>
        </div>
    );
};
