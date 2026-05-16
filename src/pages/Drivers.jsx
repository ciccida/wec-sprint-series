import React, { useState, useEffect } from 'react';

const API_URL = "https://script.google.com/macros/s/AKfycbz-CzGcMTcsIBX_4XBm3BMaBoNPHI02YNt3bhXHEhnNwNII7JXR7OYF3fKr7z9sVUpfcw/exec";

// ランクの強さを数値化してソートするための定義
const ratingOptions = [
    "Bronze 1", "Bronze 2", "Bronze 3",
    "Silver 1", "Silver 2", "Silver 3",
    "Gold 1", "Gold 2", "Gold 3",
    "Platinum 1", "Platinum 2", "Platinum 3"
];
const ratingToValue = ratingOptions.reduce((acc, curr, index) => {
    acc[curr] = index + 1;
    return acc;
}, {});

const parseRankString = (rankStr) => {
    if (!rankStr) return { rankName: "Bronze 1", progress: 0 };
    const match = rankStr.toString().match(/(.*?)(?:\s*\((\d+)%\))?$/);
    if (match) {
        return {
            rankName: match[1].trim(),
            progress: match[2] ? parseInt(match[2], 10) : 0
        };
    }
    return { rankName: rankStr.trim(), progress: 0 };
};

const getRankColor = (rankName) => {
    if (rankName.includes("Bronze")) return "#cd7f32";
    if (rankName.includes("Silver")) return "#c0c0c0";
    if (rankName.includes("Gold")) return "#ffd700";
    if (rankName.includes("Platinum")) return "#00d2ff"; // プラチナは水色系
    return "#555";
};

const Drivers = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_URL);
            const data = await response.json();
            
            // 全履歴から、各ドライバーの「最新のデータ」だけを抽出する
            const latestDataMap = {};
            
            data.forEach(item => {
                const name = item.driverName;
                if (!name) return;
                
                const currentDate = new Date(item.timestamp).getTime();
                
                // まだ登録されていない、または既存のものより新しいデータなら上書き
                if (!latestDataMap[name] || currentDate > latestDataMap[name].timeValue) {
                    latestDataMap[name] = {
                        ...item,
                        timeValue: currentDate
                    };
                }
            });
            
            // 配列に戻して、DRが高い順にソート
            const sortedDrivers = Object.values(latestDataMap).sort((a, b) => {
                const drA = parseRankString(a.dr);
                const drB = parseRankString(b.dr);
                const valA = ratingToValue[drA.rankName] || 0;
                const valB = ratingToValue[drB.rankName] || 0;
                
                if (valA !== valB) return valB - valA; // DRのベースランクで比較
                return drB.progress - drA.progress;    // 同じならパーセンテージで比較
            });

            setDrivers(sortedDrivers);
            
        } catch (error) {
            console.error("Error fetching drivers:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0a0a0a', color: '#fff' }}>
                <p>ドライバーデータを読み込み中...</p>
            </div>
        );
    }

    return (
        <div style={{ 
            minHeight: '100vh', 
            color: '#fff', 
            padding: '120px 20px 50px',
            backgroundImage: 'linear-gradient(rgba(10,10,10,0.85), rgba(10,10,10,0.95)), url("/assets/hero-bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#00d2ff', letterSpacing: '3px' }}>DRIVER CARDS</h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)' }}>WEC Sprint Series 登録ドライバー一覧</p>
                </div>

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                    gap: '25px' 
                }}>
                    {drivers.map((driver, index) => {
                        const parsedDr = parseRankString(driver.dr);
                        const parsedSr = parseRankString(driver.sr);
                        
                        const drColor = getRankColor(parsedDr.rankName);
                        const srColor = getRankColor(parsedSr.rankName);

                        return (
                            <div key={index} style={{
                                background: 'rgba(20,20,20,0.8)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '15px',
                                padding: '25px',
                                position: 'relative',
                                overflow: 'hidden',
                                backdropFilter: 'blur(5px)',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                cursor: 'pointer'
                            }} className="driver-card">
                                
                                {/* 上部のアクセントライン */}
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '5px', background: `linear-gradient(90deg, ${drColor}, ${srColor})` }}></div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                                    <div style={{ 
                                        width: '50px', height: '50px', borderRadius: '50%', background: '#333',
                                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                                        fontSize: '1.5rem', fontWeight: 'bold', border: `2px solid ${drColor}`
                                    }}>
                                        {driver.driverName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '1px' }}>{driver.driverName}</h3>
                                        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>WECSS DRIVER</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                                    <div style={{ flex: 1, background: 'rgba(0,0,0,0.5)', padding: '15px 10px', borderRadius: '10px', textAlign: 'center', borderTop: `2px solid ${drColor}` }}>
                                        <p style={{ margin: '0 0 5px 0', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>DRIVER RANK</p>
                                        <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: drColor }}>{parsedDr.rankName}</p>
                                        <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: '#fff' }}>{parsedDr.progress}%</p>
                                    </div>
                                    <div style={{ flex: 1, background: 'rgba(0,0,0,0.5)', padding: '15px 10px', borderRadius: '10px', textAlign: 'center', borderTop: `2px solid ${srColor}` }}>
                                        <p style={{ margin: '0 0 5px 0', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>SAFETY RANK</p>
                                        <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: srColor }}>{parsedSr.rankName}</p>
                                        <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: '#fff' }}>{parsedSr.progress}%</p>
                                    </div>
                                </div>

                            </div>
                        );
                    })}
                </div>
                
                {drivers.length === 0 && !loading && (
                    <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginTop: '50px' }}>
                        データがありません。
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                .driver-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 15px 40px rgba(0, 210, 255, 0.2) !important;
                    border-color: rgba(0, 210, 255, 0.3) !important;
                }
            `}} />
        </div>
    );
};

export default Drivers;
