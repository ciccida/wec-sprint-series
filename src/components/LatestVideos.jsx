import React from 'react';
import './LatestVideos.css';
import { Youtube } from 'lucide-react';

const LatestVideos = () => {
    return (
        <section id="latest" className="section latest-videos">
            <div className="container">
                <h2 className="section-title">LATEST MOVIES</h2>
                <div className="video-grid">
                    {/* Main card with Embedded Player */}
                    <div className="video-main">
                        <div className="video-embed-container">
                            <iframe
                                src="https://www.youtube.com/embed/4rNMHaPTm9o?si=q8z8-Z4U4-0"
                                title="WEC Sprint Series Round 1 Highlights"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <h3>ハイライト - Round 1 Lusail</h3>
                    </div>

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
                </div>
            </div>
        </section>
    );
};

export default LatestVideos;
