import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LatestVideos from './components/LatestVideos';
import TwitterFeed from './components/TwitterFeed';
import Ranking from './components/Ranking';
import Calculator from './components/Calculator';
import About from './components/About';
import Sponsors from './components/Sponsors';
import Footer from './components/Footer';

function App() {
    return (
        <>
            <Navbar />
            <Hero />
            <TwitterFeed />
            <LatestVideos />
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
