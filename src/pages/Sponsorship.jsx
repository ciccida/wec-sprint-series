import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Sponsorship = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: '#fff', paddingTop: '120px', paddingBottom: '80px', fontFamily: '"Inter", sans-serif' }}>
            <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#ff003c', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px' }}>
                        Partner With Us
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: '#94a3b8', lineHeight: '1.8' }}>
                        WEC Sprint Series は、LeMansUltimateに情熱を燃やすシムレーサーたちのコミュニティです。<br/>
                        シリーズを共に盛り上げ、支えてくださる企業様・個人サポーター様を募集しています。
                    </p>
                </div>

                {/* 企業・プロジェクト向けスポンサー */}
                <div style={{ backgroundColor: '#111', border: '1px solid rgba(255,0,60,0.3)', borderRadius: '16px', padding: '50px', marginBottom: '40px', boxShadow: '0 10px 40px rgba(255,0,60,0.05)' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '900', borderBottom: '2px solid #ff003c', paddingBottom: '15px', marginBottom: '30px', display: 'inline-block' }}>
                        🤝 Official Sponsorship
                    </h2>
                    <p style={{ color: '#cbd5e1', marginBottom: '35px', lineHeight: '1.8', fontSize: '1.05rem' }}>
                        現在、まだまだ発展途上のコミュニティではございますが、少しでもお互いのプロモーションに繋がるよう、以下のリターンをご用意しております。大会運営やサーバー維持費へのご支援を頂ける企業様・チーム様をお待ちしております。
                    </p>
                    
                    <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: '30px', borderRadius: '12px', marginBottom: '40px', borderLeft: '4px solid #00f0ff' }}>
                        <h3 style={{ fontSize: '1.3rem', color: '#00f0ff', marginBottom: '20px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                            提供可能なリターン
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#e2e8f0', lineHeight: '2.5', fontSize: '1.05rem' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: '#00f0ff' }}>✓</span> 毎回の公式配信（YouTube）でのロゴ常時掲載</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: '#00f0ff' }}>✓</span> 大会公式サイト（本サイト）へのロゴおよびリンクの掲載</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: '#00f0ff' }}>✓</span> 公式配信内でのサービス・製品のご紹介</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: '#00f0ff' }}>✓</span> 大会公式SNSでの相互フォローおよび定期的なPRのお手伝い</li>
                        </ul>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <a href="https://twitter.com/series27228" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', backgroundColor: '#000', border: '1px solid #333', color: '#fff', padding: '16px 40px', borderRadius: '30px', fontWeight: 'bold', textDecoration: 'none', letterSpacing: '1px', transition: 'all 0.3s', fontSize: '1.1rem' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.497h2.039L6.482 3.239H4.295l13.312 17.411z" />
                            </svg>
                            公式XのDMからお問い合わせ
                        </a>
                        <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#64748b' }}>※お気軽にDMにてご連絡ください。</p>
                    </div>
                </div>

                {/* 個人向けサポーター */}
                <div style={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '50px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '25px' }}>
                        💎 Community Supporter
                    </h2>
                    <p style={{ color: '#94a3b8', marginBottom: '35px', lineHeight: '1.8', fontSize: '1.05rem' }}>
                        「大会をもっと盛り上げたい」「運営のサーバー代の足しにしてほしい」<br/>
                        そんな温かいご支援をいただける個人サポーター様向けの窓口です。<br/>
                        皆様からのご支援が、より良いレース環境の構築に繋がります。
                    </p>
                    
                    <a href="https://doneru.jp/wecsprintseries" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', backgroundColor: '#00f0ff', color: '#000', padding: '15px 35px', borderRadius: '8px', fontWeight: '900', textDecoration: 'none', fontSize: '1.2rem', transition: 'transform 0.2s', boxShadow: '0 4px 15px rgba(0,240,255,0.2)' }}>
                        <span style={{ fontSize: '1.5rem' }}>💎</span> Doneruで支援する
                    </a>
                    <p style={{ marginTop: '25px', fontSize: '0.85rem', color: '#64748b' }}>
                        ※ 投げ銭サービス「Doneru (どねる)」のページへ移動します。
                    </p>
                </div>

                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                    <Link to="/" style={{ color: '#fff', textDecoration: 'none', borderBottom: '1px solid #ff003c', paddingBottom: '5px', fontWeight: 'bold' }}>
                        ← ホームへ戻る
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Sponsorship;
