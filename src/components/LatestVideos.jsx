import React from 'react';
import './LatestVideos.css';

const LatestVideos = () => {
    return (
        <section id="latest" className="section latest-videos">
            <div className="container">
                <h2 className="section-title">最新の配信</h2>
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
                        {/* Secondary card for general video list */}
                        <a href="https://www.youtube.com/@WECSS81/videos" target="_blank" className="video-card full-height">
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
