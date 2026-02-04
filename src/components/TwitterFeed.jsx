import React from 'react';
import './TwitterFeed.css';
import GenericNewsCard from './GenericNewsCard';
import raceInfo from '../data/race-info.json';
import { Twitter } from 'lucide-react';

const TwitterFeed = () => {
    return (
        <section id="news" className="section twitter-feed">
            <div className="container">
                <h2 className="section-title">最新ニュース</h2>

                {/* News Grid */}
                <div className="news-grid">
                    {/* Card 1: Next Race */}
                    <GenericNewsCard
                        label="NEXT RACE"
                        title={`${raceInfo.round} ${raceInfo.circuit}`}
                        date={raceInfo.date}
                        time={raceInfo.time}
                        image={raceInfo.image}
                        description={raceInfo.description}
                        link={raceInfo.broadcastLink}
                        linkText="配信リマインダーを設定"
                    />

                    {/* Card 2: Environment Setting Stream */}
                    <GenericNewsCard
                        label="SPECIAL STREAM"
                        title="天候環境設定配信 Round 3 Spa"
                        date="2026.02.05 (THU)"
                        time="22:00 (JST)-"
                        image="/assets/weather-setting-stream.jpg"
                        description={"次戦スパの天候と路面コンジションを決める運命の抽選会。\n雨か晴れか、それとも嵐か？レースの行方を左右する瞬間を見逃すな！"}
                        link="https://www.youtube.com/live/lD7h33xK08A"
                        linkText="配信リマインダーを設定"
                    />
                </div>

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
