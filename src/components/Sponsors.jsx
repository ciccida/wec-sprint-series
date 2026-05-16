import React from 'react';
import { Link } from 'react-router-dom';
import './Sponsors.css';

const Sponsors = () => {
    return (
        <section id="partner" className="section sponsors-section">
            <div className="container">
                <h2 className="section-title">Partner</h2>
                <p className="sponsors-subtitle">シリーズを支える公認パートナー</p>

                <div className="sponsors-grid">
                    <a href="https://jp.pimax.com/" target="_blank" rel="noopener noreferrer" className="sponsor-card huge">
                        <img src="/assets/sponsor-partner.png" alt="Pimax" />
                    </a>
                    <a href="https://www.endless-sport.co.jp/" target="_blank" rel="noopener noreferrer" className="sponsor-card huge">
                        <img src="/assets/sponsor-endless.png" alt="ENDLESS" />
                    </a>
                    
                    {/* スポンサー募集枠 */}
                    <Link to="/sponsorship" className="sponsor-card huge" style={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        border: '2px dashed rgba(255,255,255,0.2)', 
                        background: 'rgba(0,0,0,0.3)',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = '#ff003c';
                        e.currentTarget.style.background = 'rgba(255,0,60,0.05)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                        e.currentTarget.style.background = 'rgba(0,0,0,0.3)';
                    }}
                    >
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff', letterSpacing: '1px' }}>YOUR LOGO HERE</span>
                        <span style={{ fontSize: '0.8rem', color: '#ff003c', marginTop: '10px', fontWeight: 'bold' }}>BECOME A PARTNER ➔</span>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Sponsors;
