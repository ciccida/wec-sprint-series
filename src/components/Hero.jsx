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
                        日本国内最大の「Le Mans Ultimate」コミュニティが贈る、<br />最高峰の耐久スプリントシリーズ。<br />
                        HypercarやLMGT3など、複数クラス混走による熱きバトルがここに。
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
