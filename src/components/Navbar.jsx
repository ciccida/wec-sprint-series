import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isHome = location.pathname === '/';

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-content">
                <Link to="/" className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <img src="/assets/logo.png" alt="WEC Sprint Series" />
                </Link>
                <ul className="nav-links">
                    {/* Only show scroll links on Home page, otherwise link to Home */}
                    <li>{isHome ? <a href="#news">最新ニュース</a> : <Link to="/#news">最新ニュース</Link>}</li>
                    <li>{isHome ? <a href="#latest">最新の配信</a> : <Link to="/#latest">最新の配信</Link>}</li>
                    <li>{isHome ? <a href="#schedule">スケジュール</a> : <Link to="/#schedule">スケジュール</Link>}</li>
                    <li>{isHome ? <a href="#results">レース結果</a> : <Link to="/#results">レース結果</Link>}</li>

                    {/* New Tool Links */}
                    <li>
                        <Link to="/weather" className="nav-tool-link">
                            WEATHER RANDOMIZER
                        </Link>
                    </li>
                    <li>
                        <Link to="/calculator" className="accent" style={{ fontWeight: 'bold' }}>
                            PIT CALC (TRIAL)
                        </Link>
                    </li>

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
