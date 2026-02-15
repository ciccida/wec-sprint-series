import React, { useState, useEffect } from 'react';
import { tracks } from '../data/tracks';
import { carClasses } from '../data/cars';
import { calculateStrategy } from '../utils/calculator';
import { parseTimeToSeconds, formatSecondsToTime, formatFriendlyTime } from '../utils/timeFormat';
import TimeConverter from './TimeConverter';
import './Calculator.css';

const Calculator = () => {
    const [raceDuration, setRaceDuration] = useState(60);
    const [selectedTrackId, setSelectedTrackId] = useState(tracks[0].id);
    const [selectedLayoutId, setSelectedLayoutId] = useState(tracks[0].layouts[0].id);
    const [selectedClassId, setSelectedClassId] = useState(carClasses[0].id);
    const [selectedCarId, setSelectedCarId] = useState(carClasses[0].cars[0].id);
    const [lapTimeInput, setLapTimeInput] = useState('');
    const [fuelMeasure, setFuelMeasure] = useState('lap'); // 'lap' or 'percent'
    const [fuelValue, setFuelValue] = useState('');
    const [strategy, setStrategy] = useState(null);

    const track = tracks.find(t => t.id === selectedTrackId);
    const layout = track.layouts.find(l => l.id === selectedLayoutId);
    const carClass = carClasses.find(c => c.id === selectedClassId);
    const car = carClass.cars.find(c => c.id === selectedCarId);

    // 初期表示時や選択変更時にラップタイムをリセット
    useEffect(() => {
        setLapTimeInput(formatSecondsToTime(layout.baseLapTime));
    }, [selectedLayoutId]);

    // クラス変更時に車両をリセット
    useEffect(() => {
        setSelectedCarId(carClass.cars[0].id);
        setFuelValue(carClass.fuelPerLap.toString());
    }, [selectedClassId]);

    useEffect(() => {
        const duration = Math.min(Math.max(raceDuration, 0), 1440);
        const lapTimeSeconds = parseTimeToSeconds(lapTimeInput);
        const safeLapTime = lapTimeSeconds > 0 ? lapTimeSeconds : layout.baseLapTime;

        // 燃料計算のロジックを調整
        let fuelPerLap = parseFloat(fuelValue) || carClass.fuelPerLap;
        let tankCapacity = carClass.tankCapacity;

        if (fuelMeasure === 'percent') {
            // パーセント入力の場合、タンク容量を100として計算
            tankCapacity = 100;
        }

        const result = calculateStrategy(
            duration,
            safeLapTime,
            fuelPerLap,
            tankCapacity
        );

        // 翻訳用のスタブ（calculator.jsを修正せずに済むようここでフォーマットを上書き）
        if (result && result.stints) {
            result.stints = result.stints.map(s => ({
                ...s,
                startTimeFormatted: formatFriendlyTime(parseTimeToSeconds(s.startTime)), // 既存ロジックが文字列で返してくるため
                durationFormatted: formatFriendlyTime(parseTimeToSeconds(s.duration))
            }));
        }

        setStrategy(result);
    }, [raceDuration, selectedLayoutId, selectedClassId, selectedCarId, lapTimeInput, fuelMeasure, fuelValue]);

    return (
        <div className="calculator-wrapper">


            <TimeConverter />

            <div className="calculator-grid">
                <div className="input-panel">
                    <div className="card">
                        <h2 className="card-title">レース設定</h2>

                        <div className="form-group">
                            <label>レース時間 (分)</label>
                            <input
                                type="number"
                                value={raceDuration}
                                onChange={(e) => setRaceDuration(parseInt(e.target.value) || 0)}
                                min="1"
                            />
                        </div>

                        <div className="form-group">
                            <label>サーキット & レイアウト</label>
                            <div className="track-layout-grid">
                                <select value={selectedTrackId} onChange={(e) => {
                                    const newTrack = tracks.find(t => t.id === e.target.value);
                                    setSelectedTrackId(e.target.value);
                                    setSelectedLayoutId(newTrack.layouts[0].id);
                                }}>
                                    {tracks.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                                <select value={selectedLayoutId} onChange={(e) => setSelectedLayoutId(e.target.value)}>
                                    {track.layouts.map(l => (
                                        <option key={l.id} value={l.id}>{l.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>車両クラス</label>
                            <div className="class-selector">
                                {carClasses.map(c => (
                                    <button
                                        key={c.id}
                                        className={`class-btn ${selectedClassId === c.id ? 'active' : ''}`}
                                        onClick={() => setSelectedClassId(c.id)}
                                    >
                                        {c.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>車両選択</label>
                            <select value={selectedCarId} onChange={(e) => setSelectedCarId(e.target.value)}>
                                {carClass.cars.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>平均ラップタイム (分:秒.nnn)</label>
                            <input
                                type="text"
                                placeholder="3:35.000"
                                value={lapTimeInput}
                                onChange={(e) => setLapTimeInput(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>燃費設定</label>
                            <div className="fuel-input-group">
                                <select value={fuelMeasure} onChange={(e) => setFuelMeasure(e.target.value)} className="fuel-unit-select">
                                    <option value="lap">消費量(L)/周</option>
                                    <option value="percent">消費率(%)/周</option>
                                </select>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={fuelValue}
                                    onChange={(e) => setFuelValue(e.target.value)}
                                    placeholder={fuelMeasure === 'percent' ? "例: 4.5" : "例: 3.5"}
                                />
                            </div>
                            <p className="form-help">
                                {fuelMeasure === 'percent'
                                    ? "満タン(100%)に対する1周あたりの消費割合を入力します。"
                                    : "1周あたりの具体的な燃料消費量(リットル等)を入力します。"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="output-panel card">
                    <h2 className="card-title">戦略結果</h2>

                    {strategy && (
                        <div className="results">
                            <div className="summary-grid">
                                <div className="summary-item">
                                    <span className="label">推定合計周回数</span>
                                    <span className="value">{strategy.totalLaps}周</span>
                                </div>
                                <div className="summary-item">
                                    <span className="label">ピット回数</span>
                                    <span className="value accent">{strategy.pitStopsCount}回</span>
                                </div>
                            </div>

                            <div className="stints-list">
                                {strategy.stints.map((stint) => (
                                    <div key={stint.stintNumber} className="stint-card">
                                        <div className="stint-header">
                                            <h3>スティント #{stint.stintNumber}</h3>
                                            <span className="laps">{stint.startLap} - {stint.endLap}周目</span>
                                        </div>
                                        <div className="stint-details">
                                            <p>開始時間: {stint.stintNumber === 1 ? "スタート" : stint.startTimeFormatted}</p>
                                            <p>想定持続時間: {stint.durationFormatted}</p>
                                        </div>
                                        {stint.isPitNext && (
                                            <div className="pit-alert">
                                                <span className="pit-icon">⛽</span> {stint.endLap}周目終了時にピットイン
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Calculator;
