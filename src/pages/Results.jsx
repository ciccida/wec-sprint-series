import React, { useState, useEffect } from 'react';
import Ranking from '../components/Ranking';
import RaceResults from '../components/RaceResults';
import TimeAttackResults from '../components/TimeAttackResults';
import { rankingData, rounds } from '../data/ranking';
import { raceResults } from '../data/raceResults';
import { timeAttackData } from '../data/timeAttackData';
import './WeatherCheck.css';

const Results = () => {
    // 利用可能なシーズン
    const availableSeasons = ["Vol1", "Vol2", "Vol3"];
    
    // セクションごとに独立したステート
    const [seasonTa, setSeasonTa] = useState("Vol3"); 
    const [seasonRanking, setSeasonRanking] = useState("Vol3");
    const [seasonRace, setSeasonRace] = useState("Vol3");

    // 各セクションの最新ラウンドを取得する補助関数
    const getLatestRound = (dataObj, isTimeAttack = false) => {
        const rounds = Object.keys(dataObj || {}).map(Number).filter(n => !isNaN(n));
        const roundsWithData = rounds.filter(r => {
            const content = dataObj[r];
            if (!content) return false;
            // タイムアタックの場合は .results 配列の中身をチェック
            if (isTimeAttack) {
                return Array.isArray(content.results) && content.results.length > 0;
            }
            return Array.isArray(content) ? content.length > 0 : !!content;
        });
        return roundsWithData.length > 0 ? Math.max(...roundsWithData) : 1;
    };

    // シーズン表記を変換する補助関数
    const getSeasonLabel = (season) => {
        if (season === "Vol1") return "Vol.1";
        if (season === "Vol2") return "Vol.2";
        if (season.startsWith("Vol")) {
            const num = season.replace("Vol", "");
            return `Season ${num}`;
        }
        return season;
    };

    const [selectedTaRound, setSelectedTaRound] = useState(() => getLatestRound(timeAttackData["Vol3"]));
    const [selectedRaceRound, setSelectedRaceRound] = useState(() => getLatestRound(raceResults["Vol2"]));

    // シーズンが切り替わった際に、そのシーズンの最新ラウンドを自動選択する
    useEffect(() => {
        setSelectedTaRound(getLatestRound(timeAttackData[seasonTa], true));
    }, [seasonTa]);

    useEffect(() => {
        setSelectedRaceRound(getLatestRound(raceResults[seasonRace]));
    }, [seasonRace]);

    // 補助関数: シーズンセレクターのレンダリング
    const renderSeasonSelector = (current, setter, seasonList = availableSeasons) => (
        <div className="season-mini-selector" style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginBottom: '15px' }}>
            {seasonList.map(season => (
                <button
                    key={season}
                    onClick={() => setter(season)}
                    style={{
                        background: current === season ? '#ff003c' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${current === season ? '#ff003c' : 'rgba(255,255,255,0.1)'}`,
                        color: '#fff',
                        padding: '4px 12px',
                        fontSize: '0.8rem',
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
    );

    return (
        <div className="weather-check-page">
            <div className="container" style={{ paddingTop: '120px', paddingBottom: '60px' }}>
                
                <div className="setup-header" style={{ textAlign: 'center', marginBottom: '0px' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '4px' }}>
                        RESULTS
                    </h1>
                </div>

                {/* 1. Time Attack Section */}
                <section style={{ marginBottom: '0px', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>

                    <div className="section-title-area" style={{ textAlign: 'center', marginBottom: '10px' }}>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#fff', marginBottom: '10px' }}>TIME ATTACK LEADERBOARD</h2>
                        
                        {renderSeasonSelector(seasonTa, setSeasonTa, availableSeasons)}

                        <div className="round-selector" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', maxWidth: '500px', margin: '0 auto' }}>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((round) => {
                                const roundData = timeAttackData[seasonTa] && timeAttackData[seasonTa][round];
                                const hasData = !!(roundData && ((Array.isArray(roundData.results) && roundData.results.length > 0) || roundData.image));
                                return (
                                    <button
                                        key={round}
                                        disabled={!hasData}
                                        onClick={() => setSelectedTaRound(round)}
                                        style={{
                                            background: selectedTaRound === round ? '#ff003c' : 'rgba(255,255,255,0.03)',
                                            border: '1px solid ' + (selectedTaRound === round ? '#ff003c' : 'rgba(255,255,255,0.08)'),
                                            color: hasData ? '#fff' : '#444',
                                            padding: '8px',
                                            cursor: hasData ? 'pointer' : 'not-allowed',
                                            borderRadius: '2px',
                                            fontSize: '0.85rem',
                                            opacity: hasData ? 1 : 0.3
                                        }}
                                    >
                                        Rd.{round}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Round Cover Image */}
                    {timeAttackData[seasonTa] && timeAttackData[seasonTa][selectedTaRound] && timeAttackData[seasonTa][selectedTaRound].image && (
                        <div className="ta-cover-container" style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <img 
                                src={timeAttackData[seasonTa][selectedTaRound].image} 
                                alt={`Rd.${selectedTaRound} Cover`} 
                                style={{
                                    maxWidth: '720px',
                                    width: '100%',
                                    display: 'block',
                                    margin: '0 auto',
                                    aspectRatio: '16 / 9',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    boxShadow: '0 15px 30px rgba(0,0,0,0.4)',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}
                            />
                        </div>
                    )}

                    {timeAttackData[seasonTa] && timeAttackData[seasonTa][selectedTaRound] && timeAttackData[seasonTa][selectedTaRound].results && timeAttackData[seasonTa][selectedTaRound].results.length > 0 ? (
                        <TimeAttackResults data={timeAttackData[seasonTa][selectedTaRound].results} />
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>No data available for {getSeasonLabel(seasonTa)} Rd.{selectedTaRound}.</div>
                    )}
                </section>

                {/* 2. Series Standings Section */}
                <section style={{ marginBottom: '10px' }}>
                    <Ranking 
                        data={rankingData[seasonRanking] || []} 
                        rounds={rounds[seasonRanking] || []} 
                        seasonName={`${getSeasonLabel(seasonRanking)} Standings`} 
                        selector={renderSeasonSelector(seasonRanking, setSeasonRanking, availableSeasons)}
                        titleColor="#fff"
                    />
                </section>

                {/* 3. Race Results Section */}
                <section style={{ marginBottom: '10px' }}>
                    <div className="section-title-area" style={{ textAlign: 'center', marginBottom: '10px' }}>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#fff', marginBottom: '10px' }}>DETAILED RACE RESULTS</h2>
                        
                        {renderSeasonSelector(seasonRace, setSeasonRace, availableSeasons)}

                        <div className="round-selector" style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '10px' }}>
                            {(rounds[seasonRace] || []).map((r) => {
                                const hasResult = !!(raceResults[seasonRace] && raceResults[seasonRace][r.id]);
                                return (
                                    <button
                                        key={r.id}
                                        disabled={!hasResult}
                                        onClick={() => setSelectedRaceRound(r.id)}
                                        style={{
                                            background: selectedRaceRound === r.id ? '#ff003c' : 'rgba(255,255,255,0.05)',
                                            border: '1px solid ' + (selectedRaceRound === r.id ? '#ff003c' : 'rgba(255,255,255,0.08)'),
                                            color: hasResult ? '#fff' : '#444',
                                            padding: '6px 15px',
                                            cursor: hasResult ? 'pointer' : 'not-allowed',
                                            borderRadius: '2px',
                                            fontSize: '0.8rem',
                                            opacity: hasResult ? 1 : 0.3
                                        }}
                                    >
                                        {r.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    {raceResults[seasonRace] && raceResults[seasonRace][selectedRaceRound] ? (
                        <RaceResults 
                            results={raceResults[seasonRace][selectedRaceRound]} 
                            roundName={(rounds[seasonRace] || []).find(r => r.id === selectedRaceRound)?.name || `Rd.${selectedRaceRound}`} 
                        />
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Race results not yet available for {getSeasonLabel(seasonRace)}.</div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Results;
