import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { WeatherCard } from './WeatherCard';
import './Components.css';

export const Roulette = forwardRef(({ items, onComplete }, ref) => {
    const [spinning, setSpinning] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useImperativeHandle(ref, () => ({
        spin: () => {
            startSpin();
        }
    }));

    const startSpin = () => {
        if (spinning || items.length === 0) return;
        setSpinning(true);

        // Simple interval based mock-spin
        let currentIter = 0;
        const totalIters = 50; // How many ticks
        const baseInterval = 50; // ms

        const spinLogic = (i) => {
            // Easing: slower at the end
            const progress = i / totalIters;
            // Exponential ease out for delay
            const delay = baseInterval + (Math.pow(progress, 3) * 300);

            setTimeout(() => {
                const nextIndex = Math.floor(Math.random() * items.length);
                setSelectedIndex(nextIndex);

                if (i < totalIters) {
                    spinLogic(i + 1);
                } else {
                    setSpinning(false);
                    onComplete(items[nextIndex]);
                }
            }, delay);
        };

        spinLogic(0);
    };

    return (
        <div className="roulette-container">
            <div className="roulette-frame">
                {/* Pointer Indicator */}
                <div className="roulette-pointer">
                    ▼
                </div>

                <div className="roulette-window">
                    <WeatherCard weather={items[selectedIndex]} isSelected={true} />
                </div>
            </div>
        </div>
    );
});

Roulette.displayName = 'Roulette';
