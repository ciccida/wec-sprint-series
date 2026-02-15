import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import WeatherCheck from './pages/WeatherCheck';
import PitCalculator from './pages/PitCalculator';
import Footer from './components/Footer';

// Wrapper to conditionally show footer or handle layout specific logic if needed
const Layout = ({ children }) => {
    return (
        <div className="app-container">
            <Navbar />
            <main>{children}</main>
            <Footer />
        </div>
    );
};

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/weather" element={<WeatherCheck />} />
                    <Route path="/calculator" element={<PitCalculator />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
