import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LatestVideos from './components/LatestVideos';
import TwitterFeed from './components/TwitterFeed';
import About from './components/About';
import Sponsors from './components/Sponsors';
import Footer from './components/Footer';

function App() {
    return (
        <>
            <Navbar />
            <Hero />
            <TwitterFeed />
            <About />
            <LatestVideos />
            <Sponsors />
            <Footer />
        </>
    );
}

export default App;
