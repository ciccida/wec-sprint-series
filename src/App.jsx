import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PitCalculator from './pages/PitCalculator';
import Footer from './components/Footer';

function ScrollToTop() {
    const { pathname, hash } = useLocation();
    React.useLayoutEffect(() => {
        if (!hash) {
            // Temporarily remove smooth scrolling to force an instant jump
            const originalStyle = document.documentElement.style.scrollBehavior;
            document.documentElement.style.scrollBehavior = 'auto';
            window.scrollTo(0, 0);
            // Restore original smooth behavior if it existed
            if (originalStyle) {
                document.documentElement.style.scrollBehavior = originalStyle;
            } else {
                document.documentElement.style.removeProperty('scroll-behavior');
            }
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
                    <Route path="/calculator" element={<PitCalculator />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
