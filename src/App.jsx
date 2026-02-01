import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LatestVideos from './components/LatestVideos';
import TwitterFeed from './components/TwitterFeed';
import Schedule from './components/Schedule';
import Ranking from './components/Ranking';
import Calculator from './components/Calculator';
import RaceResults from './components/RaceResults';
import { raceResults } from './data/raceResults';
import About from './components/About';
import Sponsors from './components/Sponsors';
import Footer from './components/Footer';

function App() {
    // Default to the latest round (2)
    const [selectedRound, setSelectedRound] = useState(2);

    // Mapping for display names
    const roundNames = {
        1: "Rd.1 Lusail",
        2: "Rd.2 Imola"
    };

    return (
        <>
            <Navbar />
            <Hero />
            <TwitterFeed />
            <LatestVideos />
            <section id="schedule">
                <Schedule />
            </section>
            <section id="results">
                <div className="ranking-container">
                    <div className="ranking-header">
                        <h2>Race Results</h2>
                        <div className="round-selector" style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center' }}>
                            <button
                                onClick={() => setSelectedRound(1)}
                                className={`uk-button ${selectedRound === 1 ? 'uk-button-primary' : 'uk-button-default'}`}
                            >
                                Rd.1 Lusail
                            </button>
                            <button
                                onClick={() => setSelectedRound(2)}
                                className={`uk-button ${selectedRound === 2 ? 'uk-button-primary' : 'uk-button-default'}`}
                            >
                                Rd.2 Imola
                            </button>
                        </div>
                    </div>
                    <RaceResults results={raceResults[selectedRound]} roundName={roundNames[selectedRound]} />
                </div>
            </section>
            <section id="ranking">
                <Ranking />
            </section>
            <section id="calculator">
                <Calculator />
            </section>
            <About />
            <Sponsors />
            <Footer />
        </>
    );
}

export default App;
