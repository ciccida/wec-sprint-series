import React, { useEffect, useRef } from 'react';
import './TwitterFeed.css';

const TwitterFeed = () => {
    const wrapperRef = useRef(null);

    useEffect(() => {
        // Twitter script JS URL
        const scriptId = 'twitter-wjs';
        const scriptSrc = 'https://platform.twitter.com/widgets.js';

        // 1. Ensure script is scheduled to load
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = scriptSrc;
            script.async = true;
            script.charset = 'utf-8';
            document.body.appendChild(script);
        }

        // 2. If script is already loaded (or finishes loading), scan for new widgets.
        // We do this by checking if window.twttr is ready.
        const tryLoadWidgets = () => {
            if (window.twttr && window.twttr.widgets) {
                window.twttr.widgets.load(wrapperRef.current);
            }
        };

        // Try immediately
        tryLoadWidgets();

        // Also set up a poller just in case the script is lazy loading right now
        const interval = setInterval(tryLoadWidgets, 1000);

        // Cleanup
        return () => clearInterval(interval);
    }, []);

    return (
        <section id="news" className="section twitter-feed">
            <div className="container">
                <h2 className="section-title">最新ニュース</h2>
                <div className="twitter-embed-wrapper" ref={wrapperRef} style={{ minHeight: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    {/* The anchor tag that Twitter's script converts into a widget */}
                    <a className="twitter-timeline"
                        data-theme="dark"
                        data-height="600"
                        data-lang="ja"
                        href="https://twitter.com/series27228?ref_src=twsrc%5Etfw">
                        Tweets by series27228
                    </a>

                    {/* Fallback link if script fails heavily (e.g. adblock) */}
                    <div className="fallback-link" style={{ marginTop: '1rem' }}>
                        <a href="https://twitter.com/series27228" target="_blank" rel="noopener noreferrer" style={{ color: '#888', fontSize: '0.8rem' }}>
                            表示されない場合はこちら
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TwitterFeed;
