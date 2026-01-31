import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-content">
                <a href="#" className="logo">
                    <img src="/assets/logo.png" alt="WEC Sprint Series" />
                </a>
                <ul className="nav-links">
                    <li><a href="#news">最新ニュース</a></li>
                    <li><a href="#latest">最新の配信</a></li>
                    <li><a href="#ranking">ランキング</a></li>
                    <li><a href="#about">概要</a></li>
                    <li><a href="#calculator" className="accent" style={{ fontWeight: 'bold' }}>PIT CALC (TRIAL)</a></li>
                    <li className="header-sponsors">
                        <span className="supported-by">SUPPORTED BY:</span>
                        <a href="https://www.endless-sport.co.jp/" target="_blank" rel="noopener noreferrer">
                            <img src="/assets/sponsor-endless.png" alt="ENDLESS" />
                        </a>
                        <a href="https://jp.pimax.com/" target="_blank" rel="noopener noreferrer">
                            <img src="/assets/sponsor-partner.png" alt="Pimax" />
                        </a>
                    </li>
                    <li>
                        <a href="https://www.youtube.com/@WECSS81" target="_blank" rel="noopener noreferrer" className="btn-social">
                            YouTube
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
