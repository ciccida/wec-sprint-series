import React, { useState } from 'react';
import './TimeConverter.css';

const TimeConverter = () => {
    // 時間→分
    const [hours, setHours] = useState('');
    const [totalMinutesResult, setTotalMinutesResult] = useState(0);

    // 分→時間
    const [inputMinutes, setInputMinutes] = useState('');
    const [timeResult, setTimeResult] = useState({ h: 0, m: 0, s: 0 });

    const handleToMinutes = () => {
        const h = parseFloat(hours) || 0;
        setTotalMinutesResult(h * 60);
    };

    const handleToTime = () => {
        const total = parseFloat(inputMinutes) || 0;
        const h = Math.floor(total / 60);
        const m = Math.floor(total % 60);
        const s = Math.round((total % 1) * 60);
        setTimeResult({ h, m, s });
    };

    return (
        <div className="time-converter-bar card">
            <div className="bar-title">時間⇄分変換</div>
            <div className="converter-sections-wrapper">
                <div className="converter-section">
                    <span className="section-label">時間 → 分</span>
                    <div className="input-group-compact">
                        <input
                            type="number"
                            step="0.1"
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                            placeholder="時間"
                        />
                        <button className="btn-small" onClick={handleToMinutes}>変換</button>
                        {totalMinutesResult > 0 && (
                            <span className="result-inline">{totalMinutesResult.toFixed(0)}分</span>
                        )}
                    </div>
                </div>

                <div className="divider-vertical"></div>

                <div className="converter-section">
                    <span className="section-label">分 → 時間</span>
                    <div className="input-group-compact">
                        <input
                            type="number"
                            value={inputMinutes}
                            onChange={(e) => setInputMinutes(e.target.value)}
                            placeholder="分"
                        />
                        <button className="btn-small" onClick={handleToTime}>変換</button>
                        {(timeResult.h > 0 || timeResult.m > 0 || timeResult.s > 0) && (
                            <span className="result-inline">
                                {timeResult.h > 0 ? `${timeResult.h}時間 ` : ''}{timeResult.m}分</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimeConverter;
