import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import NextRace from '../components/NextRace';
import LatestVideos from '../components/LatestVideos';
import TwitterFeed from '../components/TwitterFeed';
import Schedule from '../components/Schedule';
import Ranking from '../components/Ranking';
import RaceResults from '../components/RaceResults';
import About from '../components/About';
import Sponsors from '../components/Sponsors';
import { rankingData, rounds } from '../data/ranking';
import { raceResults } from '../data/raceResults';
import { timeAttackData } from '../data/timeAttackData';
import TimeAttackResults from '../components/TimeAttackResults';
import { Link } from 'react-router-dom';

const Home = () => {
    const { hash } = useLocation();

    // シーラベル表記を変換する補助関数
    const getSeasonLabel = (season) => {
        if (season === "Vol1") return "Vol.1";
        if (season === "Vol2") return "Vol.2";
        if (season.startsWith("Vol")) {
            const num = season.replace("Vol", "");
            return `Season ${num}`;
        }
        return season;
    };

    // 最新のシーズンを取得（ランキング用）
    // 利用可能なシーズン (4/29リリース版)
    const availableSeasons = ["Vol1", "Vol2", "Vol3"];
    const seasons = Object.keys(rankingData);
    const latestSeason = "Vol3";
    
    // タイムアタックの最新シーズンを独自に取得
    const taSeasons = Object.keys(timeAttackData);
    const latestTaSeason = [...taSeasons].reverse().find(s => {
        const seasonData = timeAttackData[s];
        return Object.values(seasonData).some(rd => rd.results && rd.results.length > 0);
    }) || "Vol3";

    // 最新シーズンのランキングとラウンド情報
    const currentRanking = rankingData[latestSeason] || [];
    const currentRounds = rounds[latestSeason] || [];
    
    // タイムアタックの最新ラウンドを取得
    const taSeasonData = timeAttackData[latestTaSeason] || {};
    const taRoundsWithData = Object.keys(taSeasonData)
        .filter(rd => taSeasonData[rd] && Array.isArray(taSeasonData[rd].results) && taSeasonData[rd].results.length > 0)
        .map(Number)
        .sort((a, b) => b - a);
    const latestTaRound = taRoundsWithData[0] || 1;
    const latestTaResults = (taSeasonData[latestTaRound] && taSeasonData[latestTaRound].results) || [];

    // ラウンドリザルト用のステート (最新の8ラウンドをデフォルトに)
    const [selectedRound, setSelectedRound] = useState(8);

    useEffect(() => {
        if (hash) {
            setTimeout(() => {
                const id = hash.replace('#', '');
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }, [hash]);

    return (
        <>
            <Hero />
            <NextRace />
            <TwitterFeed />
            <LatestVideos />

            <section id="schedule">
                <Schedule />
            </section>
            
            {/* [RELEASE 4/29] Season 3 Time Attack Results */}
            <section id="time-attack" style={{ padding: '80px 0 40px 0', background: 'linear-gradient(to bottom, #1a1a1a, #000)' }}>
                <div className="container">
                    <div className="section-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: '900', color: '#ff003c', textTransform: 'uppercase' }}>Season 3 Time Attack</h2>
                        <p style={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '2px' }}>RD.{latestTaRound} {latestTaRound === 2 ? 'PORTIMAO' : ''} - {latestTaRound === 2 ? 'INTERIM' : 'OFFICIAL'} RESULTS</p>
                    </div>
                    
                    {latestTaResults.length > 0 && (
                        <div className="ta-featured">
                            <TimeAttackResults data={latestTaResults} limit={3} />
                        </div>
                    )}
                </div>
            </section>
            
            {/* 1. Series Standings (Full - Production Style) */}
            <section id="ranking" style={{ padding: '80px 0 40px 0' }}>
                <div className="container">
                    <Ranking 
                        data={currentRanking} 
                        rounds={currentRounds} 
                        seasonName={`SERIES POINT STANDINGS (${getSeasonLabel(latestSeason)})`} 
                        titleColor="#ff003c"
                    />
                </div>
            </section>

            {/* 2. Race Results Section with Selector (Production Style) */}
            <section id="results" style={{ padding: '40px 0 80px 0', background: 'rgba(0,0,0,0.2)' }}>
                <div className="container">
                    <div className="ranking-header" style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#ff003c', textTransform: 'uppercase' }}>Race Results</h2>
                        
                        <div className="round-selector" style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
                            {currentRounds.map((r) => (
                                <button
                                    key={r.id}
                                    onClick={() => setSelectedRound(r.id)}
                                    className={`uk-button uk-button-small ${selectedRound === r.id ? 'uk-button-danger' : 'uk-button-default'}`}
                                    style={{
                                        background: selectedRound === r.id ? '#ff003c' : 'rgba(255,255,255,0.05)',
                                        color: '#fff',
                                        border: '1px solid ' + (selectedRound === r.id ? '#ff003c' : 'rgba(255,255,255,0.1)'),
                                        borderRadius: '2px',
                                        fontWeight: 'bold',
                                        padding: '5px 15px'
                                    }}
                                >
                                    {r.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <RaceResults 
                        results={raceResults[latestSeason] ? raceResults[latestSeason][selectedRound] : []} 
                        roundName={`${getSeasonLabel(latestSeason)} ${currentRounds.find(r => r.id === selectedRound)?.name} - ${currentRounds.find(r => r.id === selectedRound)?.venue}`}
                    />
                </div>
            </section>

            <About />
            <Sponsors />
        </>
    );
};

export default Home;
