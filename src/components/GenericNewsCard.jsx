import React from 'react';
import './GenericNewsCard.css';
import { Calendar, Clock, Youtube } from 'lucide-react';

const GenericNewsCard = ({ label, title, date, time, image, description, link, linkText, icon: Icon }) => {
    return (
        <div className="generic-news-card">
            <h3 className="news-label">{label}</h3>

            <div className="news-image">
                <img src={image} alt={title} />
            </div>

            <div className="news-details">
                <h4 className="news-title">{title}</h4>

                <div className="news-info-grid">
                    <div className="info-item">
                        <Calendar size={18} className="icon" />
                        <span>{date}</span>
                    </div>
                    <div className="info-item">
                        <Clock size={18} className="icon" />
                        <span>{time}</span>
                    </div>
                </div>

                <p className="news-description">{description}</p>

                {link && (
                    <a href={link} target="_blank" rel="noopener noreferrer" className="btn-news-action">
                        {Icon ? <Icon size={20} /> : <Youtube size={20} />}
                        {linkText}
                    </a>
                )}
            </div>
        </div>
    );
};

export default GenericNewsCard;
