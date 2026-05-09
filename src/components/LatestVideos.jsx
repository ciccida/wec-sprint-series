import React from 'react';
import './LatestVideos.css';
import { Youtube } from 'lucide-react';

const LatestVideos = () => {
    return (
        <section id="latest" className="section latest-videos">
            <div className="container">
                <h2 className="section-title">LATEST MOVIES</h2>
                <div className="video-grid">
                    <div className="video-links">
                        {/* Stream Archive Link (Renamed from Latest Stream) */}
                        <a href="https://www.youtube.com/@WECSS81/streams" target="_blank" rel="noopener noreferrer" className="video-card">
                            <div className="card-content">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                                    <Youtube size={32} color="#ff003c" />
                                    <h3 style={{ margin: 0 }}>配信アーカイブ</h3>
                                </div>
                                <p>過去のレース配信（フル）はこちら</p>
                            </div>
                            <div className="card-bg" style={{ background: 'linear-gradient(45deg, #000, #333)' }}></div>
                        </a>

                        {/* Secondary card for general video list */}
                        <a href="https://www.youtube.com/@WECSS81/videos" target="_blank" className="video-card">
                            <div className="card-content">
                                <h3>動画一覧</h3>
                                <p>過去のレースハイライトなどはこちら </p>
                            </div>
                            <div className="card-bg" style={{ background: 'linear-gradient(45deg, #eee, #999)' }}></div>
                        </a>
                    </div>

                    {/* Main card with New Info */}
                    <div className="video-main">
                        <div className="video-info-container">
                            <img src="/images/s3_rd1_monza.jpg" alt="Season 3 Round 1 Monza" className="video-thumbnail" />
                            <div className="video-overlay">
                                <div className="video-details">
                                    <h3>WEC Sprint Series Season 3<br />Round 1 Monza</h3>
                                    <div className="stream-schedule">
                                        <p><strong>Broadcast:</strong> 2026/05/09 21:50(JST)-</p>
                                        <p><strong>Practice:</strong> 2026/05/09 22:00(JST)-</p>
                                        <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.8 }}>Supported By Pimax / ENDLESS</p>
                                    </div>
                                    <a href="https://youtube.com/live/Dcj9PBZc6Ko?feature=share" target="_blank" rel="noopener noreferrer" className="watch-live-btn">
                                        WATCH LIVE
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LatestVideos;
