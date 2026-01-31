import React from 'react';
import './Sponsors.css';

const Sponsors = () => {
    return (
        <section className="section sponsors-section">
            <div className="container">
                <h2 className="section-title">Partner</h2>
                <p className="sponsors-subtitle">シリーズを支える公認パートナー</p>

                <div className="sponsors-grid">
                    <div className="sponsor-card huge">
                        <img src="/assets/sponsor-endless.png" alt="ENDLESS" />
                    </div>
                    <div className="sponsor-card huge">
                        <img src="/assets/sponsor-partner.png" alt="Partner" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Sponsors;
