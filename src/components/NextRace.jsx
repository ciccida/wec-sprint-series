import React from 'react';
import raceInfo from '../data/race-info.json';
import './NextRace.css';
import { Calendar, MapPin, Clock, Youtube } from 'lucide-react';

const NextRace = () => {
    return (
        <div id="news" className="next-race-container">
            <h3 className="section-title">LATEST NEWS</h3>

            <div className="events-grid">
                {/* Special Stream Card */}
                {raceInfo.specialStream && (
                    <div className="event-card special-stream">
                        <div className="event-label">SPECIAL STREAM</div>
                        <div className="event-image">
                            <img src={raceInfo.specialStream.image} alt={raceInfo.specialStream.title} />
                        </div>
                        <div className="event-details">
                            <h4 className="event-title">{raceInfo.specialStream.title}</h4>
                            <div className="event-info">
                                <span className="info-badge date"><Calendar size={14} /> {raceInfo.specialStream.date}</span>
                                <span className="info-badge time"><Clock size={14} /> {raceInfo.specialStream.time}</span>
                            </div>
                            <p className="event-desc">{raceInfo.specialStream.description}</p>
                            <a href={raceInfo.specialStream.link} target="_blank" rel="noopener noreferrer" className="btn-event">
                                <Youtube size={18} /> Watch Stream
                            </a>
                        </div>
                    </div>
                )}

                {/* Next Race Card */}
                <div className="event-card next-race">
                    <div className="event-label">NEXT RACE</div>
                    <div className="event-image">
                        <img src={raceInfo.image} alt="Next Race" />
                    </div>
                    <div className="event-details">
                        <h4 className="event-title">{raceInfo.title || `${raceInfo.round} - ${raceInfo.circuit}`}</h4>
                        <div className="event-info">
                            <span className="info-badge date"><Calendar size={14} /> {raceInfo.date}</span>
                            <span className="info-badge time"><Clock size={14} /> {raceInfo.time}</span>
                        </div>
                        <p className="event-desc">{raceInfo.description}</p>
                        {raceInfo.broadcastLink && (
                            <a href={raceInfo.broadcastLink} target="_blank" rel="noopener noreferrer" className="btn-event primary">
                                <Youtube size={18} /> Watch Live
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NextRace;
