/**
 * Calculate pit strategy based on race parameters.
 * @param {number} raceDurationMinutes - Duration of the race in minutes.
 * @param {number} lapTimeSeconds - Average lap time in seconds.
 * @param {number} fuelPerLap - Fuel/Energy consumption per lap.
 * @param {number} tankCapacity - Maximum fuel/energy capacity.
 * @returns {object} Strategy details including stints and pit windows.
 */
export function calculateStrategy(raceDurationMinutes, lapTimeSeconds, fuelPerLap, tankCapacity) {
    const raceDurationSeconds = raceDurationMinutes * 60;

    // Max laps per stint (leaving a small safety margin of 1 lap)
    const lapsPerStint = Math.floor(tankCapacity / fuelPerLap) - 1;
    const stintDurationSeconds = lapsPerStint * lapTimeSeconds;

    // Total laps in the race (approximate)
    const totalLaps = Math.ceil(raceDurationSeconds / lapTimeSeconds);

    const pitStopsCount = Math.ceil(totalLaps / lapsPerStint) - 1;

    const stints = [];
    let currentLap = 0;
    let currentTime = 0;

    for (let i = 0; i <= pitStopsCount; i++) {
        const isLastStint = i === pitStopsCount;
        const stintLaps = isLastStint ? (totalLaps - currentLap) : lapsPerStint;

        stints.push({
            stintNumber: i + 1,
            startLap: currentLap + 1,
            endLap: currentLap + stintLaps,
            startTime: formatTime(currentTime),
            duration: formatTime(stintLaps * lapTimeSeconds),
            isPitNext: !isLastStint
        });

        currentLap += stintLaps;
        currentTime += stintLaps * lapTimeSeconds;
    }

    return {
        totalLaps,
        pitStopsCount,
        stints
    };
}

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    if (h > 0) {
        return `${h}h ${m}m ${s}s`;
    }
    return `${m}m ${s}s`;
}
