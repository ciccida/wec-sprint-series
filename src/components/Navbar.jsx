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
                    <li><a href="#about">概要</a></li>
                    <li><a href="#latest">最新の配信</a></li>
                    <li><a href="#news">最新ニュース</a></li>
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
