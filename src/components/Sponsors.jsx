import React from 'react';
import './Sponsors.css';

const Sponsors = () => {
    return (
        <section id="partner" className="section sponsors-section">
            <div className="container">
                <h2 className="section-title">Partner</h2>
                <p className="sponsors-subtitle">シリーズを支える公認パートナー</p>

                <div className="sponsors-grid">
                    <a href="https://www.endless-sport.co.jp/" target="_blank" rel="noopener noreferrer" className="sponsor-card huge">
                        <img src="/assets/sponsor-endless.png" alt="ENDLESS" />
                    </a>
                    <a href="https://jp.pimax.com/" target="_blank" rel="noopener noreferrer" className="sponsor-card huge">
                        <img src="/assets/sponsor-partner.png" alt="Pimax" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Sponsors;
