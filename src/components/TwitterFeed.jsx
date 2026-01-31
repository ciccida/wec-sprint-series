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
                    <a href="https://twitter.com/series27228" target="_blank" rel="noopener noreferrer" className="btn-twitter-primary">
                        <Twitter size={20} fill="currentColor" />
                        公式Xで最新情報をチェック
                    </a>
                </div>
            </div>
        </section>
    );
};

export default TwitterFeed;

export default TwitterFeed;
