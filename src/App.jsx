import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PitCalculator from './pages/PitCalculator';
import SetupTool from './pages/SetupTool';
import WeatherCheck from './pages/WeatherCheck';
import Results from './pages/Results';
import Regulations from './pages/Regulations';
import Footer from './components/Footer';

function ScrollToTop() {
    const { pathname, hash } = useLocation();
    React.useLayoutEffect(() => {
        if (!hash) {
            // Temporarily remove smooth scrolling to force an instant jump
            const html = document.documentElement;
            const originalStyle = html.style.scrollBehavior;
            html.style.scrollBehavior = 'auto';
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            
            // Restore original smooth behavior after browser has painted
            const timeoutId = setTimeout(() => {
                if (originalStyle) {
                    html.style.scrollBehavior = originalStyle;
                } else {
                    html.style.removeProperty('scroll-behavior');
                }
            }, 50);
            
            return () => clearTimeout(timeoutId);
        }
    }, [pathname, hash]);
    return null;
}

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
            <ScrollToTop />
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    {/* [RELEASE 4/29] Uncomment these routes */}
                    {/* <Route path="/results" element={<Results />} /> */}
                    {/* <Route path="/regulations" element={<Regulations />} /> */}
                    {/* <Route path="/setup-engineer" element={<SetupTool />} /> */}

                    {/* <Route path="/results" element={<Results />} /> */}
                    {/* <Route path="/regulations" element={<Regulations />} /> */}
                    <Route path="/calculator" element={<PitCalculator />} />
                    <Route path="/ai-setup-engineer-lab-exclusive-v33" element={<SetupTool />} />
                    <Route path="/weather" element={<WeatherCheck />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
