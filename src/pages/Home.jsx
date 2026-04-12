import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import NextRace from '../components/NextRace';
import LatestVideos from '../components/LatestVideos';
import TwitterFeed from '../components/TwitterFeed';
import Schedule from '../components/Schedule';
import Ranking from '../components/Ranking';
import RaceResults from '../components/RaceResults';
import { raceResults } from '../data/raceResults';
import About from '../components/About';
import Sponsors from '../components/Sponsors';

const Home = () => {
    const [selectedRound, setSelectedRound] = useState(7);
    const { hash } = useLocation();

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

    const roundNames = {
        1: "Rd.1 Lusail",
        2: "Rd.2 Imola",
        3: "Rd.3 Spa",
        4: "Rd.4 Le Mans",
        5: "Rd.5 Interlagos",
        6: "Rd.6 COTA",
        7: "Rd.7 Fuji"
    };

    return (
        <>
            <Hero />
            <NextRace />
            <TwitterFeed />
            <LatestVideos />
            <section id="schedule">
                <Schedule />
            </section>
            <section id="results">
                <div className="ranking-container">
                    <div className="ranking-header">
                        <h2>Race Results</h2>
                        <div className="round-selector">
                            {Object.entries(roundNames).map(([round, name]) => (
                                <button
                                    key={round}
                                    onClick={() => setSelectedRound(Number(round))}
                                    className={`round-btn ${selectedRound === Number(round) ? 'active' : ''}`}
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                        <style>{`
                            .round-selector {
                                display: flex;
                                gap: 10px;
                                margin-top: 15px;
                                justify-content: center;
                                flex-wrap: wrap;
                                padding: 10px;
                            }
                            .round-btn {
                                background: rgba(255, 255, 255, 0.05);
                                border: 1px solid rgba(255, 255, 255, 0.1);
                                color: #aaa;
                                padding: 6px 16px;
                                font-size: 12px;
                                font-weight: 700;
                                text-transform: uppercase;
                                letter-spacing: 0.1em;
                                cursor: pointer;
                                transition: all 0.3s ease;
                                border-radius: 2px;
                            }
                            .round-btn:hover {
                                background: rgba(255, 255, 255, 0.1);
                                color: #fff;
                            }
                            .round-btn.active {
                                background: #ff003c;
                                border-color: #ff003c;
                                color: #fff;
                                box-shadow: 0 0 15px rgba(255, 0, 60, 0.3);
                            }
                        `}</style>
                    </div>
                    <RaceResults results={raceResults[selectedRound]} roundName={roundNames[selectedRound]} />
                </div>
            </section>
            <section id="ranking">
                <Ranking />
            </section>
            <About />
            <Sponsors />
        </>
    );
};

export default Home;
