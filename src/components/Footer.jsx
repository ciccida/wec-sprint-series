import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-left">
                    <h3>WEC Sprint Series</h3>
                    <p>The premier Le Mans Ultimate simulation racing series in Japan.</p>
                </div>
                <div className="footer-right">
                    <ul className="social-links">
                        <li><a href="https://x.com/series27228" target="_blank">X (Twitter)</a></li>
                        <li><a href="https://www.youtube.com/@WECSS81" target="_blank">YouTube</a></li>
                    </ul>
                    <p className="copyright">© 2024 WEC Sprint Series. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
