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
                        <p>WEC Sprint Seriesは、レースシミュレーター<span className="nowrap">「Le Mans Ultimate」</span>を使用した日本国内のシリーズ戦およびコミュニティ</p>
                        <p>初心者から上級者まで、モータースポーツを愛する全てのドライバーが公平かつ熱いバトルを楽しめる環境を提供</p>
                        <p>Hypercar、LMP2、GTEの3クラス混走による、WEC世界耐久選手権さながらの戦略的かつダイナミックなレース体験。<br />全戦YouTubeでの実況・解説付き生配信を実施し、バーチャルモータースポーツの新たな熱狂を創造します。</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
