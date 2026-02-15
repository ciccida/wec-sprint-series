import React from 'react';
import { Cloud, CloudRain, Sun, Thermometer } from 'lucide-react';
import './Components.css';

export const WeatherCard = ({ weather, isSelected = false }) => {
    if (!weather) return null;

    const date = new Date(weather.time);
    const dateStr = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    const isRaining = weather.precipitation_sum > 0.5;
    const isCloudy = weather.cloudcover_mean > 50;

    return (
        <div className={`weather-card ${isSelected ? 'selected' : 'unselected'}`}>
            <div className="weather-card-date">{dateStr}</div>

            <div className="weather-icon-container">
                {isRaining ? (
                    <CloudRain size={48} className="icon-rain" />
                ) : isCloudy ? (
                    <Cloud size={48} className="icon-cloud" />
                ) : (
                    <Sun size={48} className="icon-sun" />
                )}
            </div>

            <div className="weather-details">
                <div className="weather-detail-item">
                    <Thermometer size={16} className="icon-temp" />
                    <span>{weather.temperature_2m_max}°C</span>
                </div>
                <div className="weather-detail-item">
                    <CloudRain size={16} className="icon-rain" />
                    <span>{weather.precipitation_sum}mm</span>
                </div>
            </div>
            {/* Debug/Meta info */}
            <div className="weather-meta">
                Cloud: {weather.cloudcover_mean}%
            </div>
        </div>
    );
};
