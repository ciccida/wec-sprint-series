import React, { useState } from 'react';
import { regulationsData } from '../data/regulations';
import './SharedPageStyles.css'; // 共通のスタイリングを利用

const Regulations = () => {
    const availableSeasons = Object.keys(regulationsData);
    const [selectedSeason, setSelectedSeason] = useState("Vol3");
    const [activeTab, setActiveTab] = useState("overview");

    const data = regulationsData[selectedSeason];

    const getSeasonLabel = (season) => {
        if (season === "Vol1") return "Vol.1";
        if (season === "Vol2") return "Vol.2";
        if (season.startsWith("Vol")) {
            const num = season.replace("Vol", "");
            return `Season ${num}`;
        }
        return season;
    };

    const renderContent = (sectionData) => {
        return (
            <div className="reg-section-content" style={{ animation: 'fadeIn 0.5s ease' }}>
                <h2 style={{ 
                    fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', 
                    fontWeight: '900', 
                    color: '#ff003c', 
                    marginBottom: '40px', 
                    textAlign: 'center', 
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    lineHeight: '1.4'
                }}>
                    {sectionData.title}
                </h2>
                {sectionData.content.map((item, idx) => (
                    <div key={idx} style={{ 
                        marginBottom: '30px', 
                        background: 'rgba(255,255,255,0.03)', 
                        padding: '30px', 
                        borderRadius: '4px', 
                        border: '1px solid rgba(255,255,255,0.08)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                    }}>
                        <h3 style={{ 
                            fontSize: '1.2rem', 
                            fontWeight: '900', 
                            color: '#fff', 
                            borderLeft: '5px solid #ff003c', 
                            paddingLeft: '15px', 
                            marginBottom: '20px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            {item.subtitle}
                        </h3>
                        {item.text && <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.9)', lineHeight: '1.8', marginBottom: item.list ? '20px' : '0', fontWeight: '500' }}>{item.text}</p>}
                        {item.list && (
                            <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                                {item.list.map((li, lIdx) => (
                                    <li key={lIdx} style={{ 
                                        fontSize: '0.95rem', 
                                        color: 'rgba(255,255,255,0.7)', 
                                        lineHeight: '1.7', 
                                        marginBottom: '12px', 
                                        display: 'flex', 
                                        alignItems: 'flex-start',
                                        paddingLeft: '5px'
                                    }}>
                                        <span style={{ color: '#ff003c', marginRight: '12px', marginTop: '2px' }}>▶</span>
                                        <span style={{ flex: 1 }}>{li}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="weather-check-page">
            <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '900px' }}>
                
                <div className="setup-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '10px' }}>
                        REGULATIONS
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '2px', fontWeight: 'bold' }}>シリーズ規則とエチケット</p>
                </div>

                {/* Season Selector */}
                <div className="season-mini-selector" style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginBottom: '40px' }}>
                    {availableSeasons.map(season => (
                        <button
                            key={season}
                            onClick={() => setSelectedSeason(season)}
                            style={{
                                background: selectedSeason === season ? '#ff003c' : 'rgba(255,255,255,0.05)',
                                border: `1px solid ${selectedSeason === season ? '#ff003c' : 'rgba(255,255,255,0.1)'}`,
                                color: '#fff',
                                padding: '6px 20px',
                                fontSize: '0.9rem',
                                fontWeight: '800',
                                cursor: 'pointer',
                                borderRadius: '2px',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {getSeasonLabel(season)}
                        </button>
                    ))}
                </div>

                {/* Tabs */}
                <div className="reg-tabs" style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <button 
                        onClick={() => setActiveTab("overview")}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            borderBottom: activeTab === "overview" ? '3px solid #ff003c' : '3px solid transparent',
                            color: activeTab === "overview" ? '#fff' : 'rgba(255,255,255,0.4)',
                            padding: '15px 25px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        概要・基本ルール
                    </button>
                    <button 
                        onClick={() => setActiveTab("incidents")}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            borderBottom: activeTab === "incidents" ? '3px solid #ff003c' : '3px solid transparent',
                            color: activeTab === "incidents" ? '#fff' : 'rgba(255,255,255,0.4)',
                            padding: '15px 25px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        インシデント審議
                    </button>
                    <button 
                        onClick={() => setActiveTab("etiquette")}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            borderBottom: activeTab === "etiquette" ? '3px solid #ff003c' : '3px solid transparent',
                            color: activeTab === "etiquette" ? '#fff' : 'rgba(255,255,255,0.4)',
                            padding: '15px 25px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        レーシングエチケット
                    </button>
                </div>

                {/* Content Area */}
                <div className="reg-content-container" style={{ minHeight: '400px' }}>
                    {data && renderContent(data[activeTab])}
                </div>

            </div>
        </div>
    );
};

export default Regulations;
