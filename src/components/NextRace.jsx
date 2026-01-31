import React from 'react';
import raceInfo from '../data/race-info.json';
import './NextRace.css';
import { Calendar, MapPin, Clock, Youtube } from 'lucide-react';

const NextRace = () => {
    return (
        <div className="next-race-card">
            <h3 className="next-race-label">NEXT RACE</h3>

            <div className="next-race-content">
                <div className="next-race-image">
                    <img src={raceInfo.image} alt="Next Race" />
                </div>

                <div className="next-race-details">
                    <div className="race-header">
                        <span className="race-round">{raceInfo.round}</span>
                        <h4 className="race-circuit">{raceInfo.circuit}</h4>
                    </div>

                    <div className="race-info-grid">
                        <div className="info-item">
                            <Calendar size={18} className="icon" />
                            <span>{raceInfo.date}</span>
                        </div>
                        <div className="info-item">
                            <Clock size={18} className="icon" />
                            <span>{raceInfo.time}</span>
                        </div>
                    </div>

                    <p className="race-description">{raceInfo.description}</p>

                    {raceInfo.broadcastLink && (
                        <a href={raceInfo.broadcastLink} target="_blank" rel="noopener noreferrer" className="btn-broadcast">
                            <Youtube size={20} />
                            配信リマインダーを設定
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NextRace;
