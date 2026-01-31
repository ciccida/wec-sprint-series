import React from 'react';
import './Hero.css';
import { Play } from 'lucide-react';

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-background">
                <img src="/assets/hero-bg.png" alt="Racing Background" />
                <div className="overlay"></div>
            </div>
            <div className="container hero-content">
                <div className="hero-text-wrapper">
                    <h2 className="subtitle">LeMans Ultimate Japanese Community Presents...</h2>
                    <h1 className="title">
                        <span className="wec">WEC</span> Sprint <span className="series">Series</span>
                    </h1>
                    <p className="description">
                        レースシム「Le Mans Ultimate」を使用したシリーズ戦 & 日本コミュニティ。<br />
                        不定期で単発レースも開催中！<br />
                        <a href="https://x.com/series27228" target="_blank" rel="noopener noreferrer" className="join-text">参加希望の方は公式Xまで</a>
                    </p>
                    <div className="cta-group">
                        <a href="https://www.youtube.com/@WECSS81" target="_blank" rel="noopener noreferrer" className="btn-primary">
                            <Play size={20} fill="currentColor" /> Watch Live
                        </a>
                        <a href="#about" className="btn-secondary">
                            Learn More
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
