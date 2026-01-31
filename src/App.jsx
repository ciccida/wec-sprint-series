import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LatestVideos from './components/LatestVideos';
import TwitterFeed from './components/TwitterFeed';
import About from './components/About';
import Footer from './components/Footer';

function App() {
    return (
        <>
            <Navbar />
            <Hero />
            <About />
            <LatestVideos />
            <TwitterFeed />
            <Footer />
        </>
    );
}

export default App;
