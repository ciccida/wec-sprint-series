import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    console.log("--- NAVBAR RENDERED v3.9 ---");
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

    const handleLogoClick = (e) => {
        if (isHome) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-content">
                <Link to="/" className="logo" onClick={handleLogoClick}>
                    <img src="/assets/logo.png" alt="WEC" />
                </Link>
                <ul className="nav-links" style={{ display: 'flex', alignItems: 'center' }}>
                    <li>{isHome ? <a href="#news">最新ニュース</a> : <Link to="/#news">最新ニュース</Link>}</li>
                    <li>{isHome ? <a href="#latest">最新の配信</a> : <Link to="/#latest">最新の配信</Link>}</li>
                    <li>{isHome ? <a href="#schedule">スケジュール</a> : <Link to="/#schedule">スケジュール</Link>}</li>
                    {/* <li><Link to="/results">RESULTS</Link></li> */}
                    {/* <li><Link to="/regulations">REGULATIONS</Link></li> */}

                    {/* [RELEASE 4/29] Uncomment the block below to show the full public menu */}
                    {/* 
                    <li><Link to="/">HOME</Link></li>
                    <li><Link to="/results">RESULTS</Link></li>
                    <li><Link to="/regulations">REGULATIONS</Link></li>
                    <li><Link to="/setup-engineer">AI SETUP ENGINEER</Link></li>
                    <li><a href="/weather/">WEATHER</a></li>
                    <li><Link to="/calculator" className="accent">PIT CALC</Link></li>
                    */}

                    <li>
                        <a href="/weather/" className="nav-tool-link">
                            WEATHER RANDOMIZER
                        </a>
                    </li>
                    <li>
                        <Link to="/calculator" className="accent" style={{ fontWeight: 'bold' }}>
                            PIT CALC (TRIAL)
                        </Link>
                    </li>
                    
                    {/* v3.9 FORCE VISIBILITY with explicit styles */}
                    <li className="header-sponsors-container" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: '20px', paddingLeft: '20px', borderLeft: '1px solid rgba(255,255,255,0.2)', visibility: 'visible', opacity: 1 }}>
                        <span style={{ fontSize: '0.7rem', color: '#fff', fontWeight: 'bold' }}>SUPPORTED BY:</span>
                        <a href="https://jp.pimax.com/" target="_blank" rel="noopener noreferrer" style={{ display: 'block', height: '24px', width: '80px', position: 'relative', zIndex: 100 }}>
                            <img src="/assets/sponsor-partner.png" alt="Pimax" style={{ height: '24px', width: 'auto', display: 'block', pointerEvents: 'auto' }} />
                        </a>
                        <a href="https://www.endless-sport.co.jp/" target="_blank" rel="noopener noreferrer" style={{ display: 'block', height: '24px', width: '60px', position: 'relative', zIndex: 100 }}>
                            <img src="/assets/sponsor-endless.png" alt="ENDLESS" style={{ height: '24px', width: 'auto', display: 'block', pointerEvents: 'auto' }} />
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
