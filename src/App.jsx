import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SiteClosed from './components/SiteClosed';
import Tracker from './pages/Tracker';
import Drivers from './pages/Drivers';
import PitCalculator from './pages/PitCalculator';
import SetupTool from './pages/SetupTool';

import Results from './pages/Results';
import Regulations from './pages/Regulations';
import Sponsorship from './pages/Sponsorship';
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

function AppContent() {
    const [isClosed, setIsClosed] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Check for admin unlock parameter
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.get('unlock') === 'ciccida') {
            localStorage.setItem('wecss_admin_unlocked', 'true');
            // Remove the parameter from the URL to hide it
            searchParams.delete('unlock');
            const newSearch = searchParams.toString() ? `?${searchParams.toString()}` : '';
            window.history.replaceState({}, '', `${location.pathname}${newSearch}`);
        }

        const checkClosure = () => {
            const isUnlocked = localStorage.getItem('wecss_admin_unlocked') === 'true';
            if (isUnlocked) {
                setIsClosed(false);
                return;
            }

            // Target closure time: POSTPONED (was August 23, 2026, 16:00 JST)
            const closureTime = new Date('2099-12-31T23:59:59+09:00').getTime();
            const now = new Date().getTime();

            if (searchParams.get('preview') === 'closed') {
                setIsClosed(true);
            }
        };

        checkClosure();
        
        // Optional: setup an interval to re-check if someone leaves the page open
        const interval = setInterval(checkClosure, 60000);
        return () => clearInterval(interval);
    }, [location]);

    if (isClosed) {
        return <SiteClosed />;
    }

    return (
        <>
            <ScrollToTop />
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/tracker" element={<Tracker />} />
                    <Route path="/drivers" element={<Drivers />} />
                    {/* [RELEASE 4/29] Full Routes */}
                    <Route path="/results" element={<Results />} />
                    <Route path="/regulations" element={<Regulations />} />
                    <Route path="/setup-engineer" element={<SetupTool />} />
                    <Route path="/sponsorship" element={<Sponsorship />} />
                    <Route path="/calculator" element={<PitCalculator />} />
                </Routes>
            </Layout>
        </>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
