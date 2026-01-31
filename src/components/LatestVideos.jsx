import React from 'react';
import './LatestVideos.css';
import { Youtube } from 'lucide-react';

const LatestVideos = () => {
    return (
        <section id="latest" className="section latest-videos">
            <div className="container">
                <h2 className="section-title">最新の配信</h2>
                <div className="video-grid">
                    {/* Main card linking to the Live/Streams tab */}
                    <a href="https://www.youtube.com/@WECSS81/streams" target="_blank" rel="noopener noreferrer" className="video-main-link">
                        <div className="video-main-content">
                            <Youtube size={64} color="#ff003c" />
                            <h3>最新の配信をチェック</h3>
                            <p>WEC Sprint Seriesの熱戦をリアルタイム・アーカイブで視聴</p>
                            <span className="visit-btn">配信ページへ移動</span>
                        </div>
                        <div className="video-main-bg"></div>
                    </a>

                    <div className="video-links">
                        {/* Secondary card for general video list */}
                        <a href="https://www.youtube.com/@WECSS81/videos" target="_blank" className="video-card full-height">
                            <div className="card-content">
                                <h3>動画一覧</h3>
                                <p>過去のレースハイライトなどはこちら</p>
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
