import React from 'react';
import { Link } from 'react-router-dom';

const PortalHome = () => {
    return (
        <div style={{ 
            minHeight: '100vh', 
            color: '#fff', 
            padding: '120px 20px', 
            textAlign: 'center',
            backgroundImage: 'linear-gradient(rgba(10,10,10,0.85), rgba(10,10,10,0.95)), url("/assets/hero-bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}>
            <h1 style={{ 
                fontSize: '4.5rem', 
                fontWeight: '900', 
                marginBottom: '50px',
                background: 'linear-gradient(90deg, #ff003c, #00d2ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
            }}>
                WECSS COMMUNITY HUB
            </h1>
            
            {/* メインの入り口（ボタン）を説明文の上に配置し、目立たせる */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', marginBottom: '80px' }}>
                {/* Racing Link */}
                <Link to="/racing" style={{
                    display: 'block', width: '350px', background: 'rgba(20,20,20,0.8)', 
                    border: '1px solid rgba(255,0,60,0.4)', borderRadius: '15px', padding: '50px 20px',
                    textDecoration: 'none', color: '#fff', transition: 'all 0.3s',
                    backdropFilter: 'blur(5px)', boxShadow: '0 10px 30px rgba(255,0,60,0.1)'
                }} className="portal-card">
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '15px', color: '#ff003c', fontWeight: '900' }}>🏁 RACING</h2>
                    <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '2' }}>
                        タイムアタック、大会リザルト、<br/>レギュレーションなど、<br/>レース本編の情報はこちら。
                    </p>
                </Link>

                {/* Tracker Link - BETA TESTING ONLY */}
                {/* <Link to="/tracker" style={{
                    display: 'block', width: '350px', background: 'rgba(20,20,20,0.8)', 
                    border: '1px solid rgba(0,210,255,0.4)', borderRadius: '15px', padding: '50px 20px',
                    textDecoration: 'none', color: '#fff', transition: 'all 0.3s',
                    backdropFilter: 'blur(5px)', boxShadow: '0 10px 30px rgba(0,210,255,0.1)'
                }} className="portal-card-tracker">
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '15px', color: '#00d2ff', fontWeight: '900' }}>📈 TRACKER</h2>
                    <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '2' }}>
                        自分のDR・SRの成長記録を<br/>入力してグラフ化！<br/>みんなのプロフも確認できます。
                    </p>
                </Link> */}
            </div>

            {/* コミュニティ説明セクション */}
            <div style={{
                background: 'rgba(20,20,20,0.7)',
                border: '1px solid transparent',
                borderRadius: '15px',
                padding: '60px 40px',
                maxWidth: '900px',
                margin: '0 auto 60px',
                position: 'relative',
                boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                backgroundImage: 'linear-gradient(#111, #111), linear-gradient(90deg, #ff003c, #00d2ff)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
                backdropFilter: 'blur(5px)'
            }}>
                <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '10px' }}>日本最高峰の</h2>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', letterSpacing: '2px', marginBottom: '10px' }}>LE MANS ULTIMATE</h1>
                <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '20px', letterSpacing: '5px' }}>コミュニティ</h2>
                
                {/* 団体名の明記 */}
                {/* 団体名の明記 (Heroスタイル) */}
                <div style={{ marginBottom: '40px', fontFamily: '"Syncopate", sans-serif', textTransform: 'uppercase' }}>
                    <h3 style={{ fontSize: '3rem', fontWeight: '900', margin: 0, fontStyle: 'italic', display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                        <span style={{ color: '#fff' }}>WEC SPRINT</span>
                        <span style={{ color: '#ff003c', background: 'linear-gradient(90deg, #ff003c, #ff4b72)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SERIES</span>
                    </h3>
                </div>
                
                <div style={{ width: '60px', height: '4px', background: 'linear-gradient(90deg, #ff003c, #00d2ff)', margin: '0 auto 40px' }}></div>

                <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: '2.4', marginBottom: '30px', fontSize: '1.1rem' }}>
                    WEC Sprint Series（WECSS）は、レースシミュレーター「Le Mans Ultimate」を楽しむ<br/>全てのプレイヤーが集う総合ポータルコミュニティです。
                </p>
                
                <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: '2.4', marginBottom: '30px', fontSize: '1.1rem' }}>
                    本格的なシリーズ戦を戦い抜く「RACING」部門と、<br/>日々の成長を記録・共有できる「TRACKER」機能を提供。
                </p>
                
                <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: '2.4', marginBottom: '50px', fontSize: '1.1rem' }}>
                    本戦でしのぎを削るトップドライバーから、スキルアップを目指すカジュアルレーサーまで、<br/>モータースポーツを愛するすべての人が、自分のスタイルで熱狂できる環境を用意しています。
                </p>
                
                {/* 誘導リンク */}
                <div style={{ background: 'rgba(0,0,0,0.5)', padding: '30px', borderRadius: '10px', display: 'inline-block' }}>
                    <p style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '15px', lineHeight: '1.8' }}>
                        Discordサーバーへの参加（コミュニティ加入・レース参戦）をご希望の方は、<br/>公式XアカウントへDMにてご連絡をお願いいたします。
                    </p>
                    <a href="https://x.com/series27228" target="_blank" rel="noopener noreferrer" 
                       style={{ 
                           display: 'inline-block', 
                           background: '#ff003c', 
                           color: '#fff', 
                           padding: '12px 30px', 
                           borderRadius: '30px', 
                           textDecoration: 'none', 
                           fontWeight: 'bold',
                           letterSpacing: '1px',
                           transition: 'background 0.3s'
                       }}
                       onMouseOver={(e) => e.target.style.background = '#d40032'}
                       onMouseOut={(e) => e.target.style.background = '#ff003c'}
                    >
                        公式X（@series27228）へDMを送る
                    </a>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
                .portal-card:hover { transform: translateY(-10px); background: rgba(255,0,60,0.15) !important; border-color: #ff003c !important; box-shadow: 0 15px 35px rgba(255,0,60,0.3) !important; }
                .portal-card-tracker:hover { transform: translateY(-10px); background: rgba(0,210,255,0.15) !important; border-color: #00d2ff !important; box-shadow: 0 15px 35px rgba(0,210,255,0.3) !important; }
            `}} />
        </div>
    );
};

export default PortalHome;
