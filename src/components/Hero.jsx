import React from 'react';
import { Link } from 'react-router-dom';
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
                    <div style={{ textAlign: 'center', width: '100%', marginBottom: '30px' }}>
                        <Link to="/sponsorship" className="sponsorship-badge" style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            margin: '0 auto',
                            position: 'relative',
                            left: '40px',
                            gap: '10px', 
                            background: 'linear-gradient(45deg, #ff003c, #990024)', 
                            border: '2px solid #fff', 
                            color: '#fff', 
                            padding: '10px 25px', 
                            borderRadius: '30px', 
                            fontSize: '1rem', 
                            fontWeight: '900', 
                            letterSpacing: '1px', 
                            textDecoration: 'none', 
                            backdropFilter: 'blur(5px)',
                            transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        }}
                        >
                            <span>公式スポンサー ＆ 個人サポーター 募集中！ 詳細はこちら ➔</span>
                        </Link>
                    </div>
                    <h2 className="subtitle">LeMans Ultimate Japanese Community Presents...</h2>
                    <h1 className="title">
                        <span className="wec">WEC</span> Sprint <span className="series">Series</span>
                    </h1>
                    <p className="description">
                        日本国内最大の「Le Mans Ultimate」コミュニティが贈る、<br />最高峰の耐久スプリントシリーズ。<br />
                        WEC世界耐久選手権の興奮と熱狂がここに。
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
