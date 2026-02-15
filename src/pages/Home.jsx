import React, { useState } from 'react';
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
    const [selectedRound, setSelectedRound] = useState(3);

    const roundNames = {
        1: "Rd.1 Lusail",
        2: "Rd.2 Imola",
        3: "Rd.3 Spa"
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
                        <div className="round-selector" style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {Object.entries(roundNames).map(([round, name]) => (
                                <button
                                    key={round}
                                    onClick={() => setSelectedRound(Number(round))}
                                    className={`uk-button ${selectedRound === Number(round) ? 'uk-button-primary' : 'uk-button-default'}`}
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
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
