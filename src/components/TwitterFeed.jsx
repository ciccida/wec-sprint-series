import React from 'react';
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import './TwitterFeed.css';

const TwitterFeed = () => {
    return (
        <section id="news" className="section twitter-feed">
            <div className="container">
                <h2 className="section-title">最新ニュース</h2>
                <div className="twitter-embed-wrapper" style={{ minHeight: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Render the timeline directly without conditional hiding */}
                    <div style={{ width: '100%', maxWidth: '600px' }}>
                        <TwitterTimelineEmbed
                            sourceType="profile"
                            screenName="series27228"
                            theme="dark"
                            lang="ja"
                            options={{ height: 600 }}
                            noFooter
                            placeholder={
                                <div className="loading-placeholder">
                                    <div className="spinner"></div>
                                    <p>タイムライン読み込み中...</p>
                                </div>
                            }
                        />
                    </div>

                    {/* Static link always visible at bottom, unobtrusive */}
                    <a href="https://twitter.com/series27228" target="_blank" rel="noopener noreferrer" className="twitter-direct-link">
                        公式Xで表示する
                    </a>
                </div>
            </div>
        </section>
    );
};

export default TwitterFeed;
