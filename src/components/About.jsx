import React from 'react';
import './About.css';

const About = () => {
    return (
        <section id="about" className="section about-section">
            <div className="container">
                <h2 className="section-title">WEC Sprint Seriesについて</h2>
                <div className="about-content centered">
                    <div className="about-card">
                        <h3>日本最高峰の<br /><span className="nowrap">Le Mans Ultimate</span><br />コミュニティ</h3>
                        <div className="about-divider"></div>
                        <p>WEC Sprint Seriesは、レースシミュレーター<span className="nowrap">「Le Mans Ultimate」</span>を使用した日本国内のシリーズ戦およびコミュニティです。</p>
                        <p>初心者から上級者まで、モータースポーツを愛する全てのドライバーが公平かつ熱いバトルを<br />楽しめる環境を提供しています。</p>
                        <p>定期的なシリーズ戦に加え、不定期での単発イベントレースも開催。<span className="nowrap">実況・解説付き</span>のライブ配信も行い、レースの興奮を余すところなくお届けします。</p>
                        <p className="about-cta">
                            <a href="https://twitter.com/series27228" target="_blank" rel="noopener noreferrer">
                                参加希望の方は公式Xまで
                            </a>
                        </p>
                    </div>
                </div>            </div>
        </section>
    );
};

export default About;
