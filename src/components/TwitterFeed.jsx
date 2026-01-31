import React from 'react';
import './TwitterFeed.css';
import NextRace from './NextRace';
import { Twitter } from 'lucide-react';

const TwitterFeed = () => {
    return (
        <section id="news" className="section twitter-feed">
            <div className="container">
                <h2 className="section-title">最新ニュース</h2>

                {/* Next Race Information Section */}
                <NextRace />

                <div className="twitter-cta-wrapper">
                    <p className="cta-description">最新情報は公式X（旧Twitter）にて随時発信中</p>
                    <a href="https://twitter.com/series27228" target="_blank" rel="noopener noreferrer" className="btn-x-primary">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.497h2.039L6.482 3.239H4.295l13.312 17.411z" />
                        </svg>
                        公式Xで最新情報をチェック
                    </a>
                </div>
            </div>
        </section>
    );
};

export default TwitterFeed;
