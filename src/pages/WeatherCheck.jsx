import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TRACKS } from '../data/weatherTracks';
import { fetchHistoricalWeather } from '../utils/weatherService';
import { Roulette } from '../components/Roulette';
import { ServerConfig } from '../components/ServerConfig';
import { CloudSun } from 'lucide-react';
import './WeatherCheck.css';

const WeatherCheck = () => {
    const [selectedTrackId, setSelectedTrackId] = useState(TRACKS[0].id);
    const [weatherData, setWeatherData] = useState([]);
    const [hourlyData, setHourlyData] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const selectedTrack = TRACKS.find(t => t.id === selectedTrackId);
    const rouletteRef = useRef();
    const resultsRef = useRef(null);

    // Fetch weather based on Race Date ±14 days
    useEffect(() => {
        const loadWeather = async () => {
            setLoading(true);
            setError(null);
            setResult(null);

            try {
                if (!selectedTrack || !selectedTrack.raceDate) {
                    throw new Error("Invalid track data or missing race date.");
                }

                // Calculate date range: Race Date - 14 days to Race Date + 14 days
                const raceDate = new Date(selectedTrack.raceDate);
                const startDateObj = new Date(raceDate);
                startDateObj.setDate(raceDate.getDate() - 14);

                const endDateObj = new Date(raceDate);
                endDateObj.setDate(raceDate.getDate() + 14);

                const formatDate = (date) => date.toISOString().split('T')[0];
                const startDate = formatDate(startDateObj);
                const endDate = formatDate(endDateObj);

                console.log(`Fetching weather for ${selectedTrack.name}: ${startDate} to ${endDate}`);

                const responseData = await fetchHistoricalWeather(selectedTrack.lat, selectedTrack.lon, startDate, endDate);

                if (responseData && responseData.hourly) {
                    setHourlyData(responseData.hourly);
                }

                if (responseData && responseData.daily && responseData.daily.time) {
                    const rowData = responseData.daily.time.map((t, index) => ({
                        time: t,
                        temperature_2m_max: responseData.daily.temperature_2m_max[index],
                        temperature_2m_min: responseData.daily.temperature_2m_min[index],
                        precipitation_sum: responseData.daily.precipitation_sum[index],
                        rain_sum: responseData.daily.rain_sum ? responseData.daily.rain_sum[index] : 0,
                        cloudcover_mean: responseData.daily.cloudcover_mean[index],
                    }));
                    setWeatherData(rowData);
                } else {
                    setWeatherData([]);
                }
            } catch (err) {
                console.error(err);
                setError("天気データの取得に失敗しました。");
            } finally {
                setLoading(false);
            }
        };

        loadWeather();
    }, [selectedTrackId, selectedTrack]);

    // Auto-scroll to results when they appear
    useEffect(() => {
        if (result && resultsRef.current) {
            // Add a small delay to ensure the animation has started/layout is ready
            setTimeout(() => {
                resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 1000);
        }
    }, [result]);

    const handleSpin = () => {
        if (rouletteRef.current && weatherData.length > 0) {
            setResult(null);
            rouletteRef.current.spin();
        } else if (weatherData.length === 0 && !loading) {
            setError("スピンするデータがありません。サーキットを選択してください。");
        }
    };

    const handleRouletteComplete = (winner) => {
        setResult(winner);
    };

    return (
        <div className="weather-page-container">
            <div className="weather-content">
                <div className="weather-header">
                    <h1 className="weather-title">
                        <CloudSun size={56} color="var(--color-secondary)" />
                        <span>LMU WEATHER RANDOMIZER</span>
                    </h1>
                    <p className="weather-subtitle">
                        Real-World Historical Weather Generator
                    </p>

                    <div className="weather-grid">
                        {/* Explanation Section */}
                        <div className="info-card">
                            <h3 className="info-title">
                                <div className="info-pill"></div>
                                ABOUT TOOL
                            </h3>
                            <p className="info-description">
                                各サーキットの正確な座標と<span className="info-highlight">2025年の実際の<br />
                                    気象データ</span>を使用し、
                                リアリティのある気候を再現します。
                            </p>
                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="info-icon">📍</span>
                                    <span>サーキット固有の気候特性を反映</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-icon">📅</span>
                                    <span>レース開催日の前後14日間から抽出</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-icon">🎲</span>
                                    <span>完全ランダムな展開（晴れ/雨/曇り）</span>
                                </div>
                            </div>
                        </div>

                        {/* Controls Section */}
                        <div className="controls-card">
                            <div className="controls-accent-bar"></div>

                            <div className="controls-container">
                                <div className="control-group">
                                    <label className="control-label">
                                        SELECT CIRCUIT
                                    </label>
                                    <select
                                        className="track-select"
                                        value={selectedTrackId}
                                        onChange={(e) => setSelectedTrackId(e.target.value)}
                                    >
                                        {TRACKS.map(track => (
                                            <option key={track.id} value={track.id}>
                                                {track.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <div className="date-display-group">
                                        <label className="control-label" style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem' }}>2025年開催日</label>
                                        <span className="date-value">
                                            {selectedTrack.raceDate}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSpin}
                                    disabled={loading || weatherData.length === 0}
                                    className="spin-button"
                                >
                                    {loading ? "FETCHING DATA..." : "SPIN WEATHER"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <div className="loading-text">GENERATING WEATHER SCENARIO...</div>
                        </div>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                            {/* Roulette Section */}
                            <div className="roulette-section">
                                <Roulette
                                    ref={rouletteRef}
                                    items={weatherData}
                                    onComplete={handleRouletteComplete}
                                    key={`${selectedTrackId}-${weatherData.length}`}
                                />
                            </div>

                            {/* Result Section */}
                            {result && hourlyData && (
                                <motion.div
                                    ref={resultsRef}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, type: "spring" }}
                                    className="result-section"
                                >
                                    <ServerConfig
                                        weather={result}
                                        trackName={selectedTrack.name}
                                        hourlyData={hourlyData}
                                    />
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WeatherCheck;
