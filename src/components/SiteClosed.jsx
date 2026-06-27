import React from 'react';
import './SiteClosed.css';

const SiteClosed = () => {
    return (
        <div className="site-closed-container">
            <div className="site-closed-content">
                <img src="/assets/logo.png" alt="WEC Sprint Series" className="site-closed-logo" />
                <h1>Thank you for participating.</h1>
                <p>The WEC Sprint Series has officially concluded.</p>
                <p className="hint">...but who knows what the future holds.</p>
            </div>
            <div className="site-closed-bg" style={{ backgroundImage: 'url(/images/closure_bg.png)' }}></div>
            <div className="site-closed-overlay"></div>
        </div>
    );
};

export default SiteClosed;
